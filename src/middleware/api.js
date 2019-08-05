export default function callAPIMiddleware({ dispatch, getState }) {
  return next => action => {
    const {
      types,
      method,
      callRef,
      data,
      shouldCallAPI = () => true,
      payload = {}
    } = action

    if (!types) {
      // Normal action: pass it on
      return next(action)
    }

    if (
      !Array.isArray(types) ||
      types.length !== 3 ||
      !types.every(type => typeof type === 'string')
    ) {
      throw new Error('Expected an array of three string types.')
    }

    if (!shouldCallAPI(getState())) {
      return
    }

    const [requestType, successType, failureType] = types;

    dispatch(
      Object.assign({}, payload, {
        type: requestType
      })
    )
    
    return callRef[method](data).then((response) => {
      return dispatch(
        Object.assign({}, payload, {
          response,
          type: successType
        })
      )
    }).catch((error) => {
      dispatch(
        Object.assign({}, payload, {
          error,
          type: failureType
        })
      )
    })
  }
}
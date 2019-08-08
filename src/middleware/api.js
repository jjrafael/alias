import config from '../config';

export default function callAPIMiddleware({ dispatch, getState }) {
  return next => action => {
    const {
      types,
      method,
      callRef,
      data,
      shouldCallAPI = () => true,
      payload = {}
    } = action;
    const { disableAPI, readOnlyAPI } = config;

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

    if (!shouldCallAPI(getState()) || disableAPI || (readOnlyAPI && method !== 'get')) {
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
          type: successType,
          payload: data
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
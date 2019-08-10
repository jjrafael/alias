import config from '../config';

export default function callAPIMiddleware({ dispatch, getState }) {
  return next => action => {
    const {
      types,
      method,
      operType,
      callRef,
      data,
      shouldCallAPI = () => true,
      payload = {}
    } = action;
    const { disableAPI, readOnlyAPI } = config;
    const writeMethods = ['set', 'add', 'delete', 'update'];

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

    if (!shouldCallAPI(getState()) || disableAPI || (readOnlyAPI && writeMethods.indexOf(method) !== -1)) {
      return
    }

    const [requestType, successType, failureType] = types;

    dispatch(
      Object.assign({}, payload, {
        type: requestType
      })
    )
    
    if(['on', 'once'].indexOf(method) !== -1){
      return callRef[method](operType).then((snapshot) => {
        return dispatch(
          Object.assign({}, payload, {
            response: snapshot && snapshot.val() ? snapshot.val() : {},
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
    }else{
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
}
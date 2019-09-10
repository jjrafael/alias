import { functions } from '../Firebase';
import config from '../config';

export default function callAPIMiddleware({ dispatch, getState }) {
  return next => action => {
    const {
      types,
      method,
      callRef,
      data,
      shouldCallAPI = () => true,
      listenData = {},
      payload = {},
      overPayload,
    } = action;
    const { disableAPI, readOnlyAPI } = config;
    const writeMethods = ['set', 'add', 'delete', 'update', 'deleteAll'];
    const changeTypes = ['added', 'modified', 'removed'];
    const listenMethods = ['listen','listenBrowse'];
    const isWrite = writeMethods.indexOf(method) !== -1;
    const isListen = listenMethods.indexOf(method) !== -1;
    const { isColl, changeType, returnData } = listenData;

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

    if (!shouldCallAPI(getState()) || disableAPI || (readOnlyAPI && isWrite)) {
      return
    }

    const [requestType, successType, failureType] = types;

    dispatch(
      Object.assign({}, payload, {
        type: requestType
      })
    )
    
    if(isListen && isColl){
      return callRef.onSnapshot(snapshot => {
        let snapshotVal = [];
        let changes = snapshot.docChanges();

        changes.forEach(d => {
          if(changeTypes.indexOf(changeType) !== -1){
            if(d.type === changeType){
              const _data = returnData ? {...d.doc.data(), id: d.doc.id} : d.doc;
              snapshotVal.push(_data);
            }
          }else if(changeType === 'no-removed'){
            if(d.type !== 'removed'){
              const _data = returnData ? {...d.doc.data(), id: d.doc.id} : d.doc;
              snapshotVal.push(_data);
            }
          }else{
            const _data = returnData ? {...d.doc.data(), id: d.doc.id} : d.doc;
            snapshotVal.push(_data);
          }
        });

        return dispatch(
          Object.assign({}, payload, {
            response: snapshotVal,
            type: successType,
            payload: overPayload || data
          })
        )

      })
    }else if(isListen && !isColl){
      callRef.onSnapshot(snapshot => {
        return dispatch(
          Object.assign({}, payload, {
            response: snapshot,
            type: successType,
            payload: overPayload || data
          })
        )
      })
    }else if(method === 'deleteAll'){
      functions.deleteFn({path: callRef}).then((response) => {
        const isArray = response && !!response.docs;
        let res = response;

        if(isArray){
          res = response.docs.map(d => {
            return { ...d.data(), id: d.id };
          })
        }
        
        return dispatch(
          Object.assign({}, payload, {
            response: res,
            type: successType,
            payload: overPayload || data
          })
        )
      }).catch((error) => {
        return dispatch(
          Object.assign({}, payload, {
            error,
            type: failureType
          })
        )
      })
    }else if(method === 'delete'){
      return callRef[method]().then((response) => {
        const isArray = response && !!response.docs;
        let res = response;

        if(isArray){
          res = response.docs.map(d => {
            return { ...d.data(), id: d.id };
          })
        }
        
        return dispatch(
          Object.assign({}, payload, {
            response: res,
            type: successType,
            payload: overPayload || data
          })
        )
      }).catch((error) => {
        return dispatch(
          Object.assign({}, payload, {
            error,
            type: failureType
          })
        )
      })
    }else{
      return callRef[method](data).then((response) => {
        const isArray = response && !!response.docs;
        let res = response;

        if(isArray){
          res = response.docs.map(d => {
            return { ...d.data(), id: d.id };
          })
        }
        
        return dispatch(
          Object.assign({}, payload, {
            response: res,
            type: successType,
            payload: overPayload || data
          })
        )
      }).catch((error) => {
        return dispatch(
          Object.assign({}, payload, {
            error,
            type: failureType
          })
        )
      })
    }
  }
}
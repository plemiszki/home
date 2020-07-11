import HandyTools from 'handy-tools'

export function createEntity(args, arrayName) {
  return (dispatch) => {
    return $.ajax({
      method: 'POST',
      url: `/api/${args.directory}`,
      data: {
        [HandyTools.convertToUnderscore(args.entityName)]: HandyTools.convertObjectKeysToUnderscore(args.entity)
      }
    }).then(
      (response) => {
        let obj = Object.assign(response, { type: 'CREATE_ENTITY' });
        dispatch(obj);
      },
      (response) => dispatch({
        type: 'ERRORS',
        errors: response
      })
    );
  }
}

export function sendRequest(args) {
  let { url, method, data } = args;
  return (dispatch) => {
    return $.ajax({
      method: method.toUpperCase(),
      url,
      data
    }).then(
      (response) => {
        let obj = Object.assign(response, { type: 'SEND_REQUEST' });
        dispatch(obj);
      }
    );
  }
}

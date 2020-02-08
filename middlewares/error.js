const ErrorHandler = (error) => {
    let retObj = null;
    switch (error) {
        case 'EXIST' :
            retObj = { result : false, status : 409, message : 'Conflict'}
            break
        case 'No_AUTH' : 
            retObj = { result : false, status : 401, message : 'Unauthorized'}
            break
        case 'FORBIDDEN':
            retObj = { result : false, status : 403, message : 'Forbidden'}
            break
        case 'BADREQ' :
            retObj = { result : false, status : 400, message : 'Bad Request'}
            break
        case 'NOTFOUND' : 
            retObj = { result : false, status : 404, message : 'Not Found'}
            break
        default :
            retObj = { result : false, status : 400, message : 'Process Error'}
    }
    return retObj
}

const errors = {
    EXIST : 'EXIST',
    No_AUTH : 'NO_AUTH',
    FORBIDDEN :'FORBIDDEN',
    BADREQ :'BADREQ',
    NOTFOUND :'NOTFOUND',
}

module.exports = {
    ErrorHandler,
    errors
}
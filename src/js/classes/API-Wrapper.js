


class ApiWrapper 
{    
    /**********************************************************
    Send a post Users request to the API
    
    Parms:
        userInfoStruct - user object containing all the fields
    **********************************************************/
    static requestPostUser(userInfoStruct, fnSuccess, fnError) {
        // ensure the argument contains all the required fields
        if (!ApiWrapper.objectContainsAllFields(userInfoStruct, ApiWrapper.REQ_FIELDS_USER_POST)) {
            console.log('missing fields');
            return;
        }
        
        if (fnSuccess == undefined) {
            fnSuccess = console.log;
        }
        
        if (fnError == undefined) {
            fnError = console.error;
        }
        
        $.ajax({
            // headers: {"X-USER-ID" :  m_User.userID},
            url: ApiWrapper.URL_USERS,
            type: ApiWrapper.REQUEST_TYPES.POST,
            data: userInfoStruct,
            success: fnSuccess,
            error: fnError,
        });
    }
    
    /**********************************************************
    Send a post Users request to the API
    
    Parms:
        userInfoStruct - user object containing all the fields
    **********************************************************/
    static requestLogin(loginStruct, fnSuccess, fnError) {
        // ensure the argument contains all the required fields
        if (!ApiWrapper.objectContainsAllFields(loginStruct, ApiWrapper.REQ_FIELDS_LOGIN)) {
            console.log('missing fields');
            return;
        }
        
        if (fnSuccess == undefined) {
            fnSuccess = console.log;
        }
        
        if (fnError == undefined) {
            fnError = console.error;
        }
        
        $.ajax({
            // headers: {"X-USER-ID" :  m_User.userID},
            url: ApiWrapper.URL_LOGIN,
            type: ApiWrapper.REQUEST_TYPES.GET,
            data: loginStruct,
            success: fnSuccess,
            error: fnError,
        });
    }
    
    /**********************************************************
    Send a GET request for a user from the API
    
    Parms:
        userID - the id of the user that wants to be requested
        userEmail - user's email
        userPassword - user's password
        fnSuccess - successful request callback
        fnError - unsuccessful request callback
    **********************************************************/
    static requestGetUser(userID, fnSuccess, fnError) {
        $.ajax({
            // username: userEmail,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', ApiWrapper.getBasicAuthToken());
            },
            url: ApiWrapper.URL_USERS + '/' + userID,
            type: ApiWrapper.REQUEST_TYPES.GET,
            // data: userInfoStruct,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Checks if an object contains all the fields in a list
    
    Parms:
        a_object - the object that needs to be validated
        a_requiredFields - list of fields the object needs
    **********************************************************/
    static objectContainsAllFields(a_object, a_requiredFields) {
        let result = true;
        
        for (const field of a_requiredFields) {
            if (!a_object.hasOwnProperty(field)) {
                result = false;
                break;
            }
        }
        
        return result;
    }

    /**********************************************************
    Create a basic HTTP auth token from the email and password
    saved in LocalStorage

    See: https://stackoverflow.com/questions/10226333/ajax-authentication-with-jquery
    **********************************************************/
    static getBasicAuthToken() {
        const tok = LocalStorage.getEmail() + ':' + LocalStorage.getPassword();
        const hash = btoa(tok);
        return 'Basic ' + hash;
    }
}

ApiWrapper.URL_BASE = API_BASE_URL;
ApiWrapper.URL_USERS = ApiWrapper.URL_BASE + '/users';
ApiWrapper.URL_LOGIN = ApiWrapper.URL_BASE + '/login';


ApiWrapper.REQUEST_TYPES = {
    GET   : 'GET',
    POST  : 'POST',
    DELETE: 'DELETE',
    PUT   : 'PUT',
    PATCH : 'PATCH',
};

// required fields for each api request 
ApiWrapper.REQ_FIELDS_USER_POST = ['email', 'password', 'name_first', 'name_last', 'birth_date'];
ApiWrapper.REQ_FIELDS_LOGIN = ['email', 'password'];

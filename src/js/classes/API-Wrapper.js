


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

        // $.post(ApiWrapper.URL_USERS, userInfoStruct, function(response) {
        //     console.log('success');
        // });

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
}

ApiWrapper.URL_BASE = API_BASE_URL;
ApiWrapper.URL_USERS = ApiWrapper.URL_BASE + '/users';


ApiWrapper.REQUEST_TYPES = {
    GET   : 'GET',
    POST  : 'POST',
    DELETE: 'DELETE',
    PUT   : 'PUT',
    PATCH : 'PATCH',
};
    
// required fields for each api request 
ApiWrapper.REQ_FIELDS_USER_POST = ['email', 'password', 'name_first', 'name_last', 'birth_date'];
    
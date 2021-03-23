

class LocalStorage {

    /**********************************************************
    Set the user id in local storage
    
    Parms:
        newUserID - the userID to be set
    **********************************************************/
    static setUserID(newUserID) {
        if (newUserID == undefined || newUserID ==  null) {
            console.error('Invalid userID');
            return;
        }

        window.localStorage.removeItem(LocalStorage.KEY_USER_ID);
        window.localStorage.setItem(LocalStorage.KEY_USER_ID, newUserID);
    }

    /**********************************************************
    Get the user id in local storage
    **********************************************************/
    static getUserID() {
        return window.localStorage.getItem(LocalStorage.KEY_USER_ID);
    }

    /**********************************************************
    Checks if the user id is set in local storage.

    If yes: returns true
    If no: returns false
    **********************************************************/
    static isUserIDSet() {
        let result = false;

        const userID = LocalStorage.getUserID();
        if (userID != null && userID != undefined) {
            result = true;
        }

        return result;
    }
}

LocalStorage.KEY_USER_ID = 'userID';
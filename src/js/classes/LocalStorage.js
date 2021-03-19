

class LocalStorage {

    static setUserID(newUserID) {
        if (newUserID == undefined || newUserID ==  null) {
            console.error('Invalid userID');
            return;
        }

        window.localStorage.removeItem(LocalStorage.KEY_USER_ID);
        window.localStorage.setItem(LocalStorage.KEY_USER_ID, newUserID);
    }

    static getUserID() {
        return window.localStorage.getItem(LocalStorage.KEY_USER_ID);
    }

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
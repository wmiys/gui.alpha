(function(){'use strict';const API_URL_PREFIX = {
    Production: 'https://api.wmiys.com',
    Development: 'http://10.0.0.82:5000',
};

const API_BASE_URL = window.location.hostname == '10.0.0.82' ? API_URL_PREFIX.Development : API_URL_PREFIX.Production;class LocalStorage {

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

        window.sessionStorage.removeItem(LocalStorage.KEY_USER_ID);
        window.sessionStorage.setItem(LocalStorage.KEY_USER_ID, newUserID);
    }

    /**********************************************************
    Get the user id in local storage
    **********************************************************/
    static getUserID() {
        return window.sessionStorage.getItem(LocalStorage.KEY_USER_ID);
    }

    /**********************************************************
    Checks if the user id, email, and password are set
    **********************************************************/
    static areCredentialsSet() {
        if (!LocalStorage.isUserIDSet()) {
            return false;
        }

        if (!LocalStorage.isUserEmailSet()) {
            return false;
        }

        if (!LocalStorage.isUserPasswordSet()) {
            return false;
        }

        return true;
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

    /**********************************************************
    Checks if the user email is set in session storage.

    If yes: returns true
    If no: returns false
    **********************************************************/
    static isUserEmailSet() {
        let result = false;

        const email = LocalStorage.getEmail();
        if (email != null && email != undefined) {
            result = true;
        }

        return result;
    }

    /**********************************************************
    Checks if the user password is set in session storage.

    If yes: returns true
    If no: returns false
    **********************************************************/
    static isUserPasswordSet() {
        let result = false;

        const password = LocalStorage.getPassword();
        if (password != null && password != undefined) {
            result = true;
        }

        return result;
    }

    /**********************************************************
    Get the user's email from local storage
    **********************************************************/
    static getEmail() {
        return window.sessionStorage.getItem(LocalStorage.KEY_EMAIL);
    }

    /**********************************************************
    Get the user's password fromo local storage
    **********************************************************/
    static getPassword() {
        return window.sessionStorage.getItem(LocalStorage.KEY_PASSWORD);
    }

    /**********************************************************
    Set the email in local storage
    
    Parms:
        newEmail - the email to be set
    **********************************************************/
    static setEmail(newEmail) {
        if (newEmail == undefined || newEmail ==  null) {
            console.error('Invalid email');
            return;
        }

        window.sessionStorage.removeItem(LocalStorage.KEY_EMAIL);
        window.sessionStorage.setItem(LocalStorage.KEY_EMAIL, newEmail);
    }

    /**********************************************************
    Set the password in local storage
    
    Parms:
        newPassword - the password to be set
    **********************************************************/
    static setPassword(newPassword) {
        if (newPassword == undefined || newPassword ==  null) {
            console.error('Invalid email');
            return;
        }

        window.sessionStorage.removeItem(LocalStorage.KEY_PASSWORD);
        window.sessionStorage.setItem(LocalStorage.KEY_PASSWORD, newPassword);
    }


    /**********************************************************
    Checks to be sure the user is properly logged in.
    If not, redirect them to the argument passed in.
    **********************************************************/
    static validateStatus(redirectLocation = '/login') {
        if (!LocalStorage.areCredentialsSet()) {
            window.location.href = redirectLocation;
        }
    }

    /**********************************************************
    Clear's the session storage.
    **********************************************************/
    static clear() {
        window.sessionStorage.clear();
    }
}

LocalStorage.KEY_USER_ID  = 'userID';
LocalStorage.KEY_EMAIL    = 'email';
LocalStorage.KEY_PASSWORD = 'password';class ApiWrapper 
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
            // url: ApiWrapper.URLS.USERS,
            url: '/api/create-account',
            type: ApiWrapper.REQUEST_TYPES.POST,
            data: userInfoStruct,
            success: function(result,status,xhr) {
                fnSuccess(result, status, xhr);
            },
            error: function() {
                fnError(xhr, status, error);
            },
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
            url: '/api/login',
            type: ApiWrapper.REQUEST_TYPES.GET,
            data: loginStruct,
            success: fnSuccess,
            error: fnError,
        });
    }
    
    /**********************************************************
    Send a GET request for a user from the API
    **********************************************************/
    static async requestGetUser() {
        const url = `/api/users`;
        const response = await fetch(url);
        return response;
    }

    /**********************************************************
    Send a PUT request for a user from the API. 
    Updates the user's info.
    
    Parms:
        userID: the user's id
        oUser: an object containing the user's info. Optional fields are:
            - email
            - password
            - name_first
            - name_last
            - birth_date
        fnSuccess: successful request callback
        fnError: unsuccessful request callback
    **********************************************************/
    static requestPutUser(oUser, fnSuccess=console.log, fnError=console.error) {
        const url = `/api/users`;
        
        $.ajax({
            url: url,
            data: oUser,
            type: ApiWrapper.REQUEST_TYPES.PUT,
            success: fnSuccess,
            error: fnError,
        });
    }


    /**********************************************************
    Send a GET request to retrieve all of the product categories
    
    Parms:
        fnSuccess - successful request callback
        fnError - unsuccessful request callback
    **********************************************************/
    static requestGetProductCategories(fnSuccess=console.log, fnError=console.error) {
        const url = `${ApiWrapper.URLS.PRODUCT_CATEGORIES}`;

        $.ajax({
            // username: userEmail,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', ApiWrapper.getBasicAuthToken());
            },
            url: url,
            type: ApiWrapper.REQUEST_TYPES.GET,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a GET request to retrieve major product categories
    
    Parms:
        fnSuccess - successful request callback
        fnError - unsuccessful request callback
    **********************************************************/
    static requestGetProductCategoriesMajor(fnSuccess, fnError) {
        const url = `${ApiWrapper.URLS.PRODUCT_CATEGORIES}/major`;

        $.ajax({
            // username: userEmail,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', ApiWrapper.getBasicAuthToken());
            },
            url: url,
            type: ApiWrapper.REQUEST_TYPES.GET,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a GET request to retrieve minor product categories
    
    Parms:
        majorCategoryID - major category id
        fnSuccess - successful request callback
        fnError - unsuccessful request callback
    **********************************************************/
    static requestGetProductCategoriesMinor(majorCategoryID, fnSuccess, fnError) {
        const url = `${ApiWrapper.URLS.PRODUCT_CATEGORIES}/major/${majorCategoryID}/minor`;

        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', ApiWrapper.getBasicAuthToken());
            },
            url: url,
            type: ApiWrapper.REQUEST_TYPES.GET,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a GET request to retrieve sub product categories
    
    Parms:
        majorCategoryID - major category id
        majorCategoryID - minor category id
        fnSuccess - successful request callback
        fnError - unsuccessful request callback
    **********************************************************/
    static requestGetProductCategoriesSub(majorCategoryID, minorCategoryID, fnSuccess, fnError) {
        const url = `${ApiWrapper.URLS.PRODUCT_CATEGORIES}/major/${majorCategoryID}/minor/${minorCategoryID}/sub`;

        $.ajax({
            // username: userEmail,
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', ApiWrapper.getBasicAuthToken());
            },
            url: url,
            type: ApiWrapper.REQUEST_TYPES.GET,
            success: fnSuccess,
            error: fnError,
        });
    }


    /**********************************************************
    Send a POST request to create a new product
    **********************************************************/
    static requestPostProduct(data, fnSuccess, fnError) {
        const url = `/api/products`;
        
        $.ajax({
            url: url,
            data: data,
            processData: false,
            contentType: false,
            type: ApiWrapper.REQUEST_TYPES.POST,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a PUT request to create a new product
    **********************************************************/
    static requestPutProduct(productID, data, fnSuccess, fnError) {
        const url = `/api/products/${productID}`;
        
        $.ajax({
            url: url,
            data: data,
            processData: false,
            contentType: false,
            type: ApiWrapper.REQUEST_TYPES.PUT,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a GET request to fetch all of a user's products
    **********************************************************/
    static requestGetUserProducts(fnSuccess = console.log, fnError=console.error) {
        const url = `${ApiWrapper.URLS.USERS}/${LocalStorage.getUserID()}/products`;
        
        $.ajax({
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', ApiWrapper.getBasicAuthToken());
            },
            url: url,
            type: ApiWrapper.REQUEST_TYPES.GET,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a GET request to fetch a single product availability record.
    **********************************************************/
    static requestGetProductAvailability(productID, productAvailabilityID, fnSuccess=console.log, fnError=console.error) {
        const url = `/api/products/${productID}/availability/${productAvailabilityID}`;
        
        $.ajax({
            url: url,
            type: ApiWrapper.REQUEST_TYPES.GET,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a PUT request to update a single product availability record.
    **********************************************************/
    static requestPutProductAvailability(productID, productAvailabilityID, productData, fnSuccess=console.log, fnError=console.error) {
        const url = `/api/products/${productID}/availability/${productAvailabilityID}`;
        
        $.ajax({
            url: url,
            data: productData,
            type: ApiWrapper.REQUEST_TYPES.PUT,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a DELETE product availability request
    **********************************************************/
    static requestDeleteProductAvailability(productID, productAvailabilityID, fnSuccess=console.log, fnError=console.error) {
        const url = `/api/products/${productID}/availability/${productAvailabilityID}`;
        
        $.ajax({
            url: url,
            type: ApiWrapper.REQUEST_TYPES.DELETE,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a POST product availability request
    **********************************************************/
    static requestPostProductAvailability(productID, productAvailabilityData, fnSuccess=console.log, fnError=console.error) {
        const url = `/api/products/${productID}/availability`;
        
        $.ajax({
            url: url,
            type: ApiWrapper.REQUEST_TYPES.POST,
            data: productAvailabilityData,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a GET product images request.
    Retrieve all the product images for a single product.
    **********************************************************/
    static requestGetProductImages(productID, fnSuccess=console.log, fnError=console.error) {
        const url = `/api/products/${productID}/images`;
        
        $.ajax({
            url: url,
            type: ApiWrapper.REQUEST_TYPES.GET,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a POST product images request.
    **********************************************************/
    static requestPostProductImages(productID, filesList, fnSuccess=console.log, fnError=console.error) {
        const url = `/api/products/${productID}/images`;

        $.ajax({
            url: url,
            data: filesList,
            processData: false,
            contentType: false,
            type: ApiWrapper.REQUEST_TYPES.POST,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a DELETE product images request.
    Deletes all images of a product.
    **********************************************************/
    static requestDeleteProductImages(productID, fnSuccess=console.log, fnError=console.error) {
        const url = `/api/products/${productID}/images`;

        $.ajax({
            url: url,
            type: ApiWrapper.REQUEST_TYPES.DELETE,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a GET location request to the API
    **********************************************************/
    static requestGetLocation(locationID, fnSuccess=console.log, fnError=console.error) {
        const url = `/api/locations/${locationID}`;

        $.ajax({
            url: url,
            type: ApiWrapper.REQUEST_TYPES.GET,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a GET product availability request to the API
    **********************************************************/
    static requestGetProductListingAvailability(productID, locationID, startsOn, endsOn, fnSuccess=console.log, fnError=console.error) {
        const url = `/api/listings/${productID}/availability`;

        const apiData = {
            location_id: locationID,
            starts_on: startsOn,
            ends_on: endsOn,
        };

        $.ajax({
            url: url,
            data: apiData,
            type: ApiWrapper.REQUEST_TYPES.GET,
            success: fnSuccess,
            error: fnError,
        });
    }

    /**********************************************************
    Send a POST product request to the API
    **********************************************************/
    static async requestPostProductRequest(productID, locationID, startsOn, endsOn) {
        const url = '/api/requests/submitted';

        const apiData = new FormData();
        apiData.append('location_id', locationID);
        apiData.append('starts_on', startsOn);
        apiData.append('ends_on', endsOn);
        apiData.append('product_id', productID);

        const response = await fetch(url, {
            method: 'POST',
            body: apiData,
        });

        return response;
    }


    /**********************************************************
    Send a post product request status response
    **********************************************************/
    static async requestPostProductRequestResponse(responseID, status) {
        const url = `/api/requests/received/${responseID}/${status}`;

        const response = await fetch(url, {
            method: 'POST',
        });

        return response;
    }

    /**********************************************************
    Send a post balance transfer for a lender
    **********************************************************/
    static async requestPostBalanceTransfer() {
        const url = '/api/balance-transfers';

        const response = await fetch(url, {
            method: 'POST',
        });

        return response;
    }
    
    
    /**********************************************************
    Send a post password reset request
    **********************************************************/
    static async requestPostPasswordReset(email) {
        const url = '/api/password-resets';

        const formData = new FormData();
        formData.append('email', email);

        const response = await fetch(url, {
            method: 'POST',
            body: formData,
        });

        return response;
    }

    /**********************************************************
    Update a password reset record
    **********************************************************/
    static async requestPutPasswordReset(passwordResetID, newPassword) {
        const url = `/api/password-resets/${passwordResetID}`;

        const formData = new FormData();
        formData.append('password', newPassword);
        
        const response = await fetch(url, {
            method: 'PUT',
            body: formData,
        });

        return response;
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

/**********************************************************
ApiWrapper static properties
**********************************************************/
ApiWrapper.URL_BASE = API_BASE_URL;

ApiWrapper.URLS = {
    USERS             : ApiWrapper.URL_BASE + '/users',
    LOGIN             : ApiWrapper.URL_BASE + '/login',
    PRODUCT_CATEGORIES: ApiWrapper.URL_BASE + '/product-categories',
};

ApiWrapper.URLS.SEARCH = {
    LOCATIONS: ApiWrapper.URL_BASE + '/search/locations',
};

ApiWrapper.REQUEST_TYPES = {
    GET   : 'GET',
    POST  : 'POST',
    DELETE: 'DELETE',
    PUT   : 'PUT',
    PATCH : 'PATCH',
};

// required fields for each api request 
ApiWrapper.REQ_FIELDS_USER_POST = ['email', 'password', 'name_first', 'name_last', 'birth_date'];
ApiWrapper.REQ_FIELDS_LOGIN     = ['email', 'password'];class CommonHtml {
    
    constructor() {
        //
    }
}

CommonHtml.spinner = '<div class="spinner-border" role="status"></div>';
CommonHtml.spinnerSmall = '<div class="spinner-border spinner-border-sm" role="status"></div>';/************************************************
This class contains logic for disabling and then re-enabling html buttons.
When the button is disabled, a spinner is shown and it is set to disabled.
*************************************************/

class SpinnerButton
{
    /************************************************
    Constructor

    Parms:
        a_strSelector - the html selector
        a_strDisplayText - the original text to display
    *************************************************/
    constructor(a_strSelector, a_strDisplayText) {
        this.selector = a_strSelector;
        this.displayText = a_strDisplayText;
    }

    /************************************************
    Disable the button and show the spinner.
    *************************************************/
    showSpinner() {
        const self = this;
        const width = $(self.selector).width();
        $(self.selector).html(CommonHtml.spinnerSmall).width(width).prop('disabled', true);
    }

    /************************************************
    Reset the button back to its normal state
    *************************************************/
    reset() {
        const self = this;
        const width = $(self.selector).width();
        $(self.selector).text(self.displayText).width(width).prop('disabled', false);
    }

    
}/************************************************
This object represents the General Information form.
It includes all of its inputs and buttons.
*************************************************/
const eFormBasic = {
    form: $('.form-account-settings-basic'),

    inputs: {
        nameFirst: '#form-account-settings-basic-name-first',
        nameLast : '#form-account-settings-basic-name-last',
        email    : '#form-account-settings-basic-email',
        dob :      '#form-account-settings-basic-dob',
    },

    buttons: {
        submit: '#form-account-settings-basic-submit',
    },

    inputClassIdentifier: '.form-account-settings-basic-input',

    getValues: function() {
        const values = {};

        for (const inputKey of Object.keys(eFormBasic.inputs)) {
            values[inputKey] = $(eFormBasic.inputs[inputKey]).val();
        }

        return values;
    },
};

// button to update their password
const eBtnUpdatePassword = '#btn-update-password';


({
    container: $('.card-account-settings-sidenav'),

    profileSection: {
        picture: $('.img-profile-pic'),
        nameFirst: $('.profile-info-name-first'),
        nameLast: $('.profile-info-name-last'),
    }
});

/************************************************
Represents the alert display section.
*************************************************/
const eAlertDisplay = {
    alert: '.alert-top',
    close: '.btn-close-alert',
};

/************************************************
Main logic
*************************************************/
$(document).ready(function() {
    addEventListeners();
    activateSidelink();
});

/************************************************
Registers all of the page event listeners.
*************************************************/
function addEventListeners() {

    $(eFormBasic.buttons.submit).on('click', function() {
        updateUserInfo();
    });

    // hide the alert display
    $(eAlertDisplay.close).on('click', function() {
        $(this).closest('.alert').prop('hidden', true);
    });

    // update password
    $(eBtnUpdatePassword).on('click', function() {
        updatePassword();
    });
}


function activateSidelink() {
    $('#v-pills-general-tab').addClass('active');
}


/************************************************
Sends an update request to the api
*************************************************/
function updateUserInfo() {
    disableSaveButton();

    const values = eFormBasic.getValues();

    const formattedData = {
        email: values.email,
        name_first: values.nameFirst,
        name_last: values.nameLast,
        birth_date: values.dob,
    };

    ApiWrapper.requestPutUser(formattedData, updateUserInfoSuccess, updateUserInfoError);
}

/************************************************
Callback for a successful api request to update the user info
*************************************************/
function updateUserInfoSuccess(result,status,xhr) {
    enableSaveButton();
    displayAlert('Updated successfully.', 'success');
}


/************************************************
Callback for an unsuccessful api request to update the user info
*************************************************/
function updateUserInfoError(xhr, status, error) {
    enableSaveButton();
    console.error('updateUserInfoError');
    console.error(xhr);
    console.error(status);
    console.error(error);
}

/************************************************
Disabled the save changes button
*************************************************/
function disableSaveButton() {
    const initWidth = $(eFormBasic.buttons.submit).width();
    $(eFormBasic.buttons.submit).prop('disabled', true).width(initWidth);
}

/************************************************
Enables the save changes button
*************************************************/
function enableSaveButton() {
    const initWidth = $(eFormBasic.buttons.submit).width();
    $(eFormBasic.buttons.submit).width(initWidth).prop('disabled', false);
}

/************************************************
Displays an alert on the screen
*************************************************/
function displayAlert(message='Success', alertType='success') {
    const alertClass = `alert-${alertType}`;
    $(eAlertDisplay.alert).prop('hidden', false).addClass(alertClass).find('.message').html(message);
}


/************************************************
Send a request to update a user's password
*************************************************/
async function updatePassword() {
    // disable the spinner button
    const buttonText = $(eBtnUpdatePassword).text();
    const spinnerBtn = new SpinnerButton(eBtnUpdatePassword, buttonText);
    spinnerBtn.showSpinner();
    
    // get the user's email
    const userData = await (await ApiWrapper.requestGetUser()).json();
    const email = userData.email;

    // tell the api that they want to update their password
    const apiResponse = await (await ApiWrapper.requestPostPasswordReset(email)).json();

    // redirect the user to the password reset page
    window.location.href = `/password-reset/${apiResponse.id}`;

    // spinnerBtn.reset();
}})();//# sourceMappingURL=account-settings-general.bundle.js.map

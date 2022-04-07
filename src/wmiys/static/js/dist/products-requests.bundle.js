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
Global Constants
*************************************************/

luxon.DateTime;/************************************************
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

    
}class UrlParser
{   
    /**********************************************************
    Get the path value of the current url/
    **********************************************************/
    static getPathValue(index) {
        const urlPath = window.location.pathname;
        const pathValues = urlPath.split("/");

        const adjustedIndex = index + 1;    // empty string in the first index of pathValues

        if (adjustedIndex < pathValues.length && adjustedIndex >= 1) {
            return pathValues[adjustedIndex];
        }

        return null;
    }

    /**********************************************************
    Returns the value of a URL query parm

        example.com?name=shit
    
    getQueryParm('name') would return 'shit'
    **********************************************************/
    static getQueryParm(a_strParmName) {
        const urlParams = UrlParser.getSearchParms();
        const value = urlParams.get(a_strParmName);
        return value;
    }

    /**********************************************************
    Set's the query paramters of the url.
    Then refreses the page.
    **********************************************************/
    static setQueryParm(a_strKey, a_strValue, a_bRefresh=true) {
        const urlParams = UrlParser.getSearchParms();
        urlParams.set(a_strKey, a_strValue);

        if (a_bRefresh) {
            window.location.search = urlParams;
        } else {
            return urlParams;
        }

    }

    /**********************************************************
    Returns the current URLSearchParams
    **********************************************************/
    static getSearchParms() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams;
    }

    /**********************************************************
    Set's the url query parms of the current url to the key, values contained in the object.
    AND DOES NOT REFRESH THE PAGE!!!!... MAGIC BITCH.
    **********************************************************/
    static setQueryParmsNoReload(newQueryParmsObject) {
        const url = new URL(window.location);

        for (const key in newQueryParmsObject) {
            url.searchParams.set(key, newQueryParmsObject[key]);
        }

        window.history.pushState({}, '', url);
    }
}class Utilities {    
    
    /************************************************
    displays an alert on the screen
    *************************************************/
    static displayAlert(text) {
        $.toast({
            text: text,
            position: 'bottom-center',
            loader: false,
            bgColor: '#3D3D3D',
            textColor: 'white'
        });
    }

    /************************************************
    Validates the form attributes.
    *************************************************/
    static validateForm(formElement) {
        const isValid = $(formElement)[0].reportValidity();
        return isValid;
    }

    /************************************************
    Transform a float to a currency with commas
    *************************************************/
    static toCurrencyFormat(numberToFormat) {
        let result = '$' + numberToFormat.toLocaleString();

        return result;
    }

    static getJqueryElementID(a_oJqueryElement) {
        return `#${$(a_oJqueryElement).attr('id')}`;
    }
}const eRequestButtons = '.product-request-btn';
const eProductRequestClass = '.product-request';
const eStatusDropdown = '.dropdown-status';

const STATUS_FILTERS = {
    All: 'all',
    Accepted: 'accepted',
    Denied: 'denied',
    Expired: 'expired',
    Pending: 'pending',
};



/************************************************
Main logic.
*************************************************/
$(document).ready(function() {
    $('#products-sidenav-link-requests').addClass('active');
    setActiveStatusDropdownOption();
    addEventListeners();
});


/************************************************
Registers all the event listeners to the html 
elements on the page.
*************************************************/
function addEventListeners() {
    $(eRequestButtons).on('click', function() {
        sendRequestResponse(this);
    });
}


/************************************************
Action event listener for hitting the accept button.
*************************************************/
async function sendRequestResponse(responseButtonClicked) {

    // disable the clicked button
    const originalText = $(responseButtonClicked).text();
    const spinningBtn = new SpinnerButton(responseButtonClicked, originalText);
    spinningBtn.showSpinner();

    // send the request to the api
    const requestID = $(responseButtonClicked).closest(eProductRequestClass).attr('data-request-id');
    const status = $(responseButtonClicked).attr('data-status-value');
    let apiResponse = ApiWrapper.requestPostProductRequestResponse(requestID, status);
    apiResponse = await Promise.resolve(apiResponse);

    
    if (apiResponse.ok) {
        // refresh the page
        window.location.href = window.location.href;    
    } else {
        // reset the button
        spinningBtn.reset();

        Utilities.displayAlert('Error. Response not saved.');
    }
}


/************************************************
Set the active status filter dropdown.
*************************************************/
function setActiveStatusDropdownOption() {
    const urlStatusParmValue = UrlParser.getQueryParm('status');

    // use pending if no status filter is set in the url
    const statusFilter = urlStatusParmValue != null ? urlStatusParmValue : STATUS_FILTERS.Pending;

    // select the active dropdown item
    const eActiveDropdownItem = $(eStatusDropdown).find(`.dropdown-item[data-status='${statusFilter}']`);
    $(eActiveDropdownItem).addClass('active');    
}})();//# sourceMappingURL=products-requests.bundle.js.map

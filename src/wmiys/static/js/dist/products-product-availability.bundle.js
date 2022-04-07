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
ApiWrapper.REQ_FIELDS_LOGIN     = ['email', 'password'];/************************************************
Global Constants
*************************************************/

const DateTime = luxon.DateTime;class FlatpickrRange
{
    /**********************************************************
    Constructor

    Parms:
        a_eInputElement - the html input element that you want to transform into a flatpickr date instance
        a_bMinDateToday - a boolean to indicate that you want the minimum date to be today.
    **********************************************************/
    constructor(a_eInputElement, a_bMinDateToday = false) {
        this.inputElement = a_eInputElement;
        this.setMinDateToToday = a_bMinDateToday;

        let flatpickrConfig = {
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            mode: "range",
        };

        if (a_bMinDateToday) {
            flatpickrConfig.minDate = "today";
        }


        this.flatpickrInstance = $(this.inputElement).flatpickr(flatpickrConfig);
    }

    /**********************************************************
    Returns the product search date range input values.

    Return value is an object containing the fields:
        - startsOn
        - endsOn
    **********************************************************/
    getDateValues() {
        const selectedDates = this.flatpickrInstance.selectedDates;

        if (selectedDates.length == 0) {
            const nullReturn = {
                startsOn: null,
                endsOn: null,
            };
            
            return nullReturn;    // no dates are set
        }
        
        // transform the js dates into ISO format: YYYY-MM-DD
        let startsOnVal = DateTime.fromJSDate(selectedDates[0]);
        let endsOnVal = DateTime.fromJSDate(selectedDates[1]);
    
        const dateValues = {
            startsOn: startsOnVal.toISODate(),
            endsOn: endsOnVal.toISODate(),
        };
    
        return dateValues;
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
}/************************************************
edit product availability form element
*************************************************/
const eFormAvailabilityNew = {
    form     : '#product-availability-new-form',
    container: '#product-availability-new-container',

    inputs: {
        datesRange: '#product-availability-new-input-dates',
        note    : '#product-availability-new-input-note',
    },

    buttons: {
        create: '#product-availability-new-btn-create',
        cancel: '#product-availability-new-btn-cancel',
    },

    classNames: {
        inputs : '.product-availability-new-input',
        buttons: '.product-availability-new-btn',
    },

    getValues: function() {
        return getFormValues(eFormAvailabilityNew.inputs);
    }
};

/************************************************
Product availability table element
*************************************************/
const eTableAvailability = {
    table: '#product-availability-table',

    classNames: {
        th  : '.product-availability-th',
        row : '.product-availability-row',
        cell: '.product-availability-cell',
    },
};

/************************************************
Edit modal
*************************************************/
const eModalEdit = {
    modal: '#product-availability-edit-modal',
    productAvailabilityID: 'data-product-availability-id',

    getActiveProductAvailabilityID: function() {
        return $(eModalEdit.modal).attr(eModalEdit.productAvailabilityID);
    },

    setActiveProductAvailabilityID: function(newID) {
        $(eModalEdit.modal).attr(eModalEdit.productAvailabilityID, newID);
    },

    open: function(newID) {
        eModalEdit.setActiveProductAvailabilityID(newID);
        $(eModalEdit.modal).modal('show');
    },

    toggleLoadingDisplay: function(a_showLoading = true) {
        let formHeight = $(eModalEdit.modal).find('.modal-body').height();

        if (a_showLoading) {
            $(eModalEdit.modal).addClass('loading').find('.loading-spinner').height(formHeight);
        } else {
            $(eModalEdit.modal).removeClass('loading').find('.loading-spinner').height(formHeight);
        }
    },
};

/************************************************
Edit product availability record form
*************************************************/
const eFormAvailabilityEdit = {
    form     : '#product-availability-edit-form',

    inputs: {
        datesRange: '#product-availability-edit-input-dates',
        note    : '#product-availability-edit-input-note',
    },

    buttons: {
        save: '#product-availability-edit-btn-save',
        delete: '#product-availability-edit-btn-delete',
    },

    classNames: {
        inputs : '.product-availability-edit-input',
        buttons: '.product-availability-edit-btn',
    },

    getValues: function() {
        return getFormValues(eFormAvailabilityEdit.inputs);
    }
};

const mProductID = UrlParser.getPathValue(1);   // the product id found in the url: /products/42


let dateRangeEdit = null;
let dateRangeNew = null;

/************************************************
Possible page alerts to set before reloading the page.
*************************************************/
const PageAlerts = {
    key: 'product-availability-alert',

    values: {
        successfulPost: 1,
        successfulPut: 2,
        successfulDelete: 3,
    }
};

const eAlertPageTop = {
    alert: '#alert-page-top',

    displayMessage: function(message, alertType = 'success') {
        const elementClass = `alert alert-${alertType} alert-dismissible`;
        $(eAlertPageTop.alert).removeClass().addClass(elementClass).prop('hidden', false).find('.message').text(message);

    },
};

/************************************************
Main logic
*************************************************/
$(document).ready(function() {
    $('#product-edit-navbar-tab-availability').addClass('active');
    checkForAlerts();
    addEventListeners();
    initFlatpickrs();
});

/************************************************
Check for and display any alerts set by the page before it was reloaded.
*************************************************/
function checkForAlerts() {
    let alertValue = window.sessionStorage.getItem(PageAlerts.key);
    window.sessionStorage.removeItem(PageAlerts.key);

    if (alertValue == null) {   // no alerts set from previous page
        return;
    }

    if (alertValue == PageAlerts.values.successfulPost) {
        eAlertPageTop.displayMessage("Item created.");
    } else if (alertValue == PageAlerts.values.successfulDelete) {
        eAlertPageTop.displayMessage("Item deleted.");
    } else if (alertValue == PageAlerts.values.successfulPut)  {
        eAlertPageTop.displayMessage("Item updated.");
    } else {
        eAlertPageTop.displayMessage("Success.");
    }
}

/************************************************
Registers all the event listeners
*************************************************/
function addEventListeners() {
    // open the edit modal
    $(eTableAvailability.classNames.row).on('click', function() {
        openEditModal(this);
    });

    $(eModalEdit.modal).on('shown.bs.modal', function (e) {
        eModalEdit.toggleLoadingDisplay(true);
    });

    // the edit product availability form SUBMIT button was clicked
    $(eFormAvailabilityEdit.buttons.save).on('click', function() {
        updateProductAvailability();
    });

    // the edit product availability form DELETE button was clicked
    $(eFormAvailabilityEdit.buttons.delete).on('click', function() {
        deleteProductAvailability();
    });

    // create a new product availability
    $(eFormAvailabilityNew.buttons.create).on('click', function() {
        createProductAvailability();
    });
}


/**********************************************************
Initialize the flat pickr inputs
**********************************************************/
function initFlatpickrs() {

    dateRangeEdit = new FlatpickrRange(eFormAvailabilityEdit.inputs.datesRange, false);
    dateRangeNew = new FlatpickrRange(eFormAvailabilityNew.inputs.datesRange, true);
}

/************************************************
Returns an object containing a form's input values.

Parms:
    a_formInputElementObject: an object with the form inputs.
*************************************************/
function getFormValues(a_formInputElementObject) {
    const values = {};

    for (inputKey of Object.keys(a_formInputElementObject)) {
        values[inputKey] = $(a_formInputElementObject[inputKey]).val();
    }

    return values;
}

/************************************************
Open the edit product availability modal

Parms:
    a_eTableRow: the table row clicked/selected that the user wishes to view
*************************************************/
function openEditModal(a_eTableRow) {
    // eModalEdit.toggleLoadingDisplay(true);
    const newProductAvailabilityID = $(a_eTableRow).attr(eModalEdit.productAvailabilityID);
    ApiWrapper.requestGetProductAvailability(mProductID, newProductAvailabilityID, openEditModalSuccess, openEditModalError);
    eModalEdit.open(newProductAvailabilityID);
}

/************************************************
Callback for a successful product availability GET request to the API
*************************************************/
function openEditModalSuccess(response, status, xhr) {
    setEditModalFormValues(response);
    eModalEdit.toggleLoadingDisplay(false);
}

/************************************************
Callback for an unsuccessful product availability GET request to the API
*************************************************/
function openEditModalError(xhr, status, error) {
    Utilities.displayAlert('API error. Check log');
    console.error('submitFormEventError');
    console.error(xhr);
    console.error(status);
    console.error(error); 
}


/************************************************
Sets the edit modal form inputs

Parms:
     oProductAvailability: an object containing the fields:
        - starts_on
        - ends_on
        - note
*************************************************/
function setEditModalFormValues(oProductAvailability) {
    $(eFormAvailabilityEdit.inputs.note).val(oProductAvailability.note);
    dateRangeEdit.flatpickrInstance.setDate([oProductAvailability.starts_on, oProductAvailability.ends_on], true);
}

/************************************************
Update the product availability. Send request.
*************************************************/
function updateProductAvailability() {    
    disableFormEdit(eFormAvailabilityEdit.buttons.save);
    const dates = dateRangeEdit.getDateValues();

    let requestBody = {
        starts_on: dates.startsOn,
        ends_on: dates.endsOn,
        note: $(eFormAvailabilityEdit.inputs.note).val(),
    };
    
    const availabilityID = eModalEdit.getActiveProductAvailabilityID();
    ApiWrapper.requestPutProductAvailability(mProductID, availabilityID, requestBody, updateProductAvailabilitySuccess, updateProductAvailabilityError);
}

/**********************************************************
Successful product availability PUT request callback.
Refreshes the page.
**********************************************************/
function updateProductAvailabilitySuccess(response, status, xhr) {
    window.sessionStorage.setItem(PageAlerts.key, PageAlerts.values.successfulPut);
    window.location.href = window.location.href;
}

/**********************************************************
Unsuccessful product availability PUT request callback
**********************************************************/
function updateProductAvailabilityError(xhr, status, error) {
    enableFormEdit();

    Utilities.displayAlert('API error.');

    console.error('updateProductAvailabilityError');
    console.error(xhr);
    console.error(status);
    console.error(error); 
}

/**********************************************************
Delete a product availabiulity record.
**********************************************************/
function deleteProductAvailability() {
    // this can't be undone
    if (!confirm('Are you sure you want to delete this? It can\'t be undone.')) {
        return;
    }

    disableFormEdit(eFormAvailabilityEdit.buttons.delete);

    const availabilityID = eModalEdit.getActiveProductAvailabilityID();
    ApiWrapper.requestDeleteProductAvailability(mProductID, availabilityID, deleteProductAvailabilitySuccess, deleteProductAvailabilityError);
}

/**********************************************************
Successful product availability DELETE request callback.
Refreshes the page.
**********************************************************/
function deleteProductAvailabilitySuccess(response, status, xhr) {
    window.sessionStorage.setItem(PageAlerts.key, PageAlerts.values.successfulDelete);
    window.location.href = window.location.href;
}

/**********************************************************
Unsuccessful product availability DELETE request callback
**********************************************************/
function deleteProductAvailabilityError(xhr, status, error) {
    enableFormEdit(eFormAvailabilityEdit.buttons.delete);
    
    Utilities.displayAlert('API error.');

    console.error('updateProductAvailabilityError');
    console.error(xhr);
    console.error(status);
    console.error(error); 
}


/************************************************
Update a new product availability. 
Send request to the api
*************************************************/
function createProductAvailability() {
    disableFormNew();

    const dates = dateRangeNew.getDateValues();

    let requestBody = {
        starts_on: dates.startsOn,
        ends_on: dates.endsOn,
        note: $(eFormAvailabilityNew.inputs.note).val(),
    };
    
    ApiWrapper.requestPostProductAvailability(mProductID, requestBody, createProductAvailabilitySuccess, createProductAvailabilityError);
}

/************************************************
Callback for a successful product availability POST request to the API
*************************************************/
function createProductAvailabilitySuccess(response, status, xhr) {
    window.sessionStorage.setItem(PageAlerts.key, PageAlerts.values.successfulPost);
    window.location.href = window.location.href;
    // enableFormNew();
}

/************************************************
Callback for an unsuccessful product availability POST request to the API
*************************************************/
function createProductAvailabilityError(xhr, status, error) {
    enableFormNew();
    
    Utilities.displayAlert('API error. Check log');
    console.error('submitFormEventError');
    console.error(xhr);
    console.error(status);
    console.error(error); 
}


/************************************************
Disable the new form elements
*************************************************/
function disableFormNew() {
    $(eFormAvailabilityNew.buttons.create).find('.spinner-border').removeClass('d-none');   // show the spinner in the button
    $(eFormAvailabilityNew.classNames.buttons).prop('disabled', true);                      // disable the buttons
    $(eFormAvailabilityNew.classNames.inputs).prop('disabled', true);                       // disabled the inputs
}

/************************************************
Enable the new form elements
*************************************************/
function enableFormNew() {
    $(eFormAvailabilityNew.buttons.create).find('.spinner-border').addClass('d-none');   // show the spinner in the button
    $(eFormAvailabilityNew.classNames.buttons).prop('disabled', false);                      // disable the buttons
    $(eFormAvailabilityNew.classNames.inputs).prop('disabled', false);                       // disabled the inputs
}

/************************************************
Disable the edit form elements
*************************************************/
function disableFormEdit(eSpinnerButton) {
    $(eSpinnerButton).find('.spinner-border').removeClass('d-none');   // show the spinner in the button
    $(eFormAvailabilityEdit.classNames.buttons).prop('disabled', true);                      // disable the buttons
    $(eFormAvailabilityEdit.classNames.inputs).prop('disabled', true);                       // disabled the inputs
}

/************************************************
Enable the edit form elements
*************************************************/
function enableFormEdit(eSpinnerButton) {
    $(eSpinnerButton).find('.spinner-border').addClass('d-none');   // show the spinner in the button
    $(eFormAvailabilityEdit.classNames.buttons).prop('disabled', false);                      // disable the buttons
    $(eFormAvailabilityEdit.classNames.inputs).prop('disabled', false);                       // disabled the inputs
}})();//# sourceMappingURL=products-product-availability.bundle.js.map

(function(){'use strict';class UrlParser
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
}const API_URL_PREFIX = {
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
}class LocationsSelect 
{
    /**********************************************************
    Initialize a select2 location search plugin.
    **********************************************************/
    static init(a_eInput, a_strPlaceholder = '', a_iMinimumInputLength = 3) {
        return $(a_eInput).select2({
            minimumInputLength: a_iMinimumInputLength,
            theme: 'bootstrap4',
            placeholder: a_strPlaceholder,
            ajax: {
                delay: 50,
                url: ApiWrapper.URLS.SEARCH.LOCATIONS,
                allowClear: true,
                data: function (params) {
                    const urlParms = {      // set the request url ?parms
                        q: params.term,
                    };                
                    return urlParms;
                },
                processResults: function (apiResponse) {
                    let processedData = [];
                    for (let count = 0; count < apiResponse.length; count++) {
                        const location = apiResponse[count];
                        const text = `${location.city}, ${location.state_name}`;
                        processedData.push({id: location.id, text: text});
                    }
                    
                    return ({results: processedData});
                }
            },
        });
    }
}class ProductListingForm
{
    /**********************************************************
    Constructor
    **********************************************************/
    constructor(a_iProductID) {
        // this.productID = a_iProductID;
        LocationsSelect.init(ProductListingForm.inputs.location, 'Location', 3);
        this.datesFlatpickr = new FlatpickrRange(ProductListingForm.inputs.dates, true);
        this.setInputValuesFromUrl();
    }

    /**********************************************************
    Setup the object.
    **********************************************************/
    init() {
        const self = this;
        self.setInputValuesFromUrl();
        self.addEventListeners();
        self.showSpinnerForCheckButton();
    }
    
    /**********************************************************
    Register all the event listeners.
    **********************************************************/
    addEventListeners() {
        const self = this;
        
        $(ProductListingForm.inputs.location).on('select2:select', function(e) {
            self.setLocationUrlQueryParmToInputValue();
        }).bind(this);

        
        $(ProductListingForm.inputs.dates).on('change', function() {
            self.setDatesUrlQueryParmsToInputValues();
        }).bind(this);


        $(ProductListingForm.inputClass).on('change', function() {
            self.checkAvailability();
        }).bind(this);

        $(ProductListingForm.buttons.check).on('click', function() {
            self.checkAvailability();
        }).bind(this);

        $(ProductListingForm.buttons.book).on('click', function() {
            self.sendProductRequest();
        }).bind(this);
    }

    /**********************************************************
    Send a new product request.
    **********************************************************/
    async sendProductRequest() {
        // disable the button
        this.showSpinnerForBookButton();

        $(ProductListingForm.form).submit();


        const formData = new FormData();

        formData.append('product_id',  UrlParser.getPathValue(1));
        formData.append('location_id', this.getLocationValue());
        formData.append('starts_on', this.getStartsOnValue());
        formData.append('ends_on', this.getEndsOnValue());
    }

    /**********************************************************
    Checks the availability of the product listing based on the 
    inputs in the form.
    **********************************************************/
    checkAvailability() {
        const self = this;

        this.toggleErrorMessage(false);

        const productID = UrlParser.getPathValue(1);
        const locationID = this.getLocationValue();
        const startsOn = this.getStartsOnValue();
        const endsOn = this.getEndsOnValue();

        if (Array(productID, locationID, startsOn, endsOn).includes(null)) {
            return;
        }

        this.showSpinnerForCheckButton();
        this.toggleCheckButtons(false);

        ApiWrapper.requestGetProductListingAvailability(productID, locationID, startsOn, endsOn, function(response) {
            const isAvailabile = response.available;

            self.showNormalCheckButton();

            if (isAvailabile) {
                self.toggleCheckButtons(true);
            } 
            else {
                self.toggleCheckButtons(false);
                self.toggleErrorMessage(true);
            }

        }, function(response) {                 // error actions
            self.toggleCheckButtons(false);
            self.showNormalCheckButton();
        });
    }

    /**********************************************************
    Sets the location_id, starts_on, and ends_on url query parms 
    to the values in their respective inputs.
    **********************************************************/
    setUrlQueryParmsToInputValues() {
        this.setDatesUrlQueryParmsToInputValues();
        this.setDatesUrlQueryParmsToInputValues();
    }

    /**********************************************************
    Sets the location_id url query parm to the values in its 
    respective input.
    **********************************************************/
    setLocationUrlQueryParmToInputValue() {

        const newLocationID = this.getLocationValue();

        if (newLocationID != null) {
            UrlParser.setQueryParmsNoReload({location_id: newLocationID});
        }
    }

    /**********************************************************
    Sets the starts_on and ends_on url query parms to the values 
    in their respective inputs.
    **********************************************************/
    setDatesUrlQueryParmsToInputValues() {
        
        // default the new values to their existing value
        const newUrlParms = {
            starts_on: UrlParser.getQueryParm(ProductListingForm.urlQueryParms.startsOn),
            ends_on: UrlParser.getQueryParm(ProductListingForm.urlQueryParms.endsOn),
        };


        const dates = this.getDatesValues();

        if (dates.endsOn != null) {
            newUrlParms.ends_on = dates.endsOn;
            $(ProductListingForm.inputs.hidden.endsOn).val(dates.endsOn);
        }
        if (dates.startsOn != null) {
            newUrlParms.starts_on = dates.startsOn;
            $(ProductListingForm.inputs.hidden.startsOn).val(dates.startsOn);
        }

        UrlParser.setQueryParmsNoReload(newUrlParms);
    }

    /**********************************************************
    Retrieves the values of the current URL query parms, and 
    sets the input element values to them.

    The URL query parms are:
        - starts_on
        - ends_on
        - location_id
    **********************************************************/
    setInputValuesFromUrl() {
        const self = this;

        const startsOn = UrlParser.getQueryParm(ProductListingForm.urlQueryParms.startsOn);
        const endsOn = UrlParser.getQueryParm(ProductListingForm.urlQueryParms.endsOn);
        const locationID = UrlParser.getQueryParm(ProductListingForm.urlQueryParms.locationID);

        this.setDatesValues(startsOn, endsOn);
        ApiWrapper.requestGetLocation(locationID, self.setLocationValue.bind(self));
    }

    /**********************************************************
    Sets the dates input element starts on and ends on values.
    **********************************************************/
    setDatesValues(startsOn, endsOn) {
        this.datesFlatpickr.flatpickrInstance.setDate([startsOn, endsOn], true);

        // set the hidden inputs
        $(ProductListingForm.inputs.hidden.endsOn).val(endsOn);
        $(ProductListingForm.inputs.hidden.startsOn).val(startsOn);
    }

    /**********************************************************
    Takes in a location object and sets the location input value 
    to City, State combo recieved.
    **********************************************************/
    setLocationValue(locationObject) {
        const self = this;

        const displayText = `${locationObject.city}, ${locationObject.state_name}`;
        const html = `<option value="${locationObject.id}" selected>${displayText}</option>`;

        $(ProductListingForm.inputs.location).html(html);

        self.checkAvailability();
    }

    /**********************************************************
    Returns the current value of the location input.
    **********************************************************/
    getLocationValue() {
        return $(ProductListingForm.inputs.location).val();
    }

    /**********************************************************
    Returns the current value of the startsOn input.
    **********************************************************/
    getStartsOnValue() {
        const dates = this.getDatesValues();
        return dates.startsOn;
    }

    /**********************************************************
    Returns the current value of the endsOn input.
    **********************************************************/
    getEndsOnValue() {
        const dates = this.getDatesValues();
        return dates.endsOn;
    }

    /**********************************************************
    Returns the current values of the dates input as an 
    object: startsOn and endsOn.
    **********************************************************/
    getDatesValues() {
        const dates = this.datesFlatpickr.getDateValues();
        return dates;
    }

    /**********************************************************
    Show the error message section:
        True - show the section
        False - hide the message
    **********************************************************/
    toggleErrorMessage(a_bShowMessage) {
        if (a_bShowMessage) {
            $(ProductListingForm.errorMessage).removeClass('d-none');
        } else {
            $(ProductListingForm.errorMessage).addClass('d-none');
        }
    }

    /**********************************************************
    Show/hide the book/check buttons:
        true = show the book button, hide the check button
        false = hide the book button, show the check button
    **********************************************************/
    toggleCheckButtons(a_bShowBookButton) {
        if (a_bShowBookButton) {
            $(ProductListingForm.buttons.book).removeClass('d-none');
            $(ProductListingForm.buttons.check).addClass('d-none');
        } else {
            $(ProductListingForm.buttons.book).addClass('d-none');
            $(ProductListingForm.buttons.check).removeClass('d-none');
        }
    }

    /**********************************************************
    Display the spinner element in the check availability button
    **********************************************************/
    showSpinnerForCheckButton() {
        const checkBtn = ProductListingForm.buttons.check;
        const width = $(checkBtn).width();

        $(checkBtn).html(CommonHtml.spinnerSmall).width(width).prop('disabled', true);
    }
    
    /**********************************************************
    Remove the spinner, and show the normal text for the check 
    availability button.
    **********************************************************/
    showNormalCheckButton() {
        const checkBtn = ProductListingForm.buttons.check;
        const width = $(checkBtn).width();
        const originalText = 'Check availability';

        $(checkBtn).text(originalText).width(width).prop('disabled', false);
    }

    /**********************************************************
    Display the spinner element in the book button
    **********************************************************/
    showSpinnerForBookButton() {
        const checkBtn = ProductListingForm.buttons.book;
        const width = $(checkBtn).width();

        $(checkBtn).html(CommonHtml.spinnerSmall).width(width).prop('disabled', true);
    }
    
    /**********************************************************
    Remove the spinner, and show the normal text for the book button.
    **********************************************************/
    showNormalBookButton() {
        const checkBtn = ProductListingForm.buttons.book;
        const width = $(checkBtn).width();
        const originalText = 'Book your stay';

        $(checkBtn).text(originalText).width(width).prop('disabled', false);
    }

}


/**********************************************************
Static constants for ProductListingForm
**********************************************************/
ProductListingForm.form = '#product-listing-form';
ProductListingForm.inputClass = '.product-listing-form-input';
ProductListingForm.errorMessage = '#product-listing-form-error-message';


ProductListingForm.inputs = {
    location: '#product-listing-form-input-location',
    dates: '#product-listing-form-input-dates',
    hidden: {
        startsOn: 'input[name="hidden-starts-on"]',
        endsOn: 'input[name="hidden-ends-on"]',
    }
};


ProductListingForm.buttons = {
    book: '#product-listing-form-button-book',
    check: '#product-listing-form-button-check',
};

ProductListingForm.urlQueryParms = {
    startsOn: 'starts_on',
    endsOn: 'ends_on',
    locationID: 'location_id',
};new Swiper('.swiper-container', {
    // Optional parameters
    // direction: 'horizontal',
    // // loop: true,
    // centeredSlides: true,
    slidesPerView: 1,
    // slidesPerView: "auto",
    cssMode: true,

    breakpoints: {
        // 320: {
        //     slidesPerView: 2,
        //     // spaceBetween: 20
        // },
        // // when window width is >= 480px
        // 480: {
        //     slidesPerView: 3,
        //     // spaceBetween: 30
        // },
        // when window width is >= 640px
        768: {
            slidesPerView: 3,
            // spaceBetween: 40
        },

        992: {
            slidesPerView: 4,
        },
    },


    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
    },

    // Navigation arrows
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});const mProductID = UrlParser.getPathValue(1);   // the product id found in the url: /products/42
const mProductListingForm = new ProductListingForm(mProductID);

const eDescriptionShowMoreBtn = $('.product-listing-description-show-more-btn');
const eDescriptionText = $('.product-listing-description-data');


/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    mProductListingForm.init();

    // mProductListingForm.showSpinnerForCheckButton();

    addListeners();
});


/**********************************************************
Register all the event listeners
**********************************************************/
function addListeners() {
    
    $(eDescriptionShowMoreBtn).on('click', function() {
        toggleFullDescription();
    });


    $(document).on('myCustomEvent', function() {
        console.log('hey');
    });
}

/**********************************************************
Show/hide the full product description
**********************************************************/
function toggleFullDescription() {
    $(eDescriptionText).toggleClass('less');
    $(eDescriptionShowMoreBtn).toggleClass('d-none');
}})();//# sourceMappingURL=product-listings-product-listing.bundle.js.map

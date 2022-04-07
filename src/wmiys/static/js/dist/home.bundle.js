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
}/**********************************************************
Product search form
**********************************************************/
const eFormProductSearch = {
    form: '#product-search-form',

    inputs: {
        location: '#product-search-form-input-location',
        dates: '#product-search-form-input-dates',
        category: '#product-search-form-input-category',
    },

    dropdownDataAttr:'data-product-category-sub-id',
    subCategoryDataAttr: 'data-category-sub-id',

    classes: {
        input: '.product-search-form-input',
    },

    dateRangesFlatpick: null,

    buttons: {
        search: '#product-search-form-button-search',
    },

    dropdownText: '#product-search-form-input-category-text',

    getInputValues: function() {
        let values = {};
        
        // location
        values.location_id = $(eFormProductSearch.inputs.location).val();

        // date range
        const dates = eFormProductSearch.dateRangesFlatpick.getDateValues();
        values.starts_on = dates.startsOn;
        values.ends_on = dates.endsOn;
        
        
        values.product_categories_sub_id = eFormProductSearch.getProductCategorySubId();

        return values;
    },

    getProductCategorySubId: function() {
        const result = $(eFormProductSearch.inputs.category).attr(eFormProductSearch.dropdownDataAttr);
        return parseInt(result);
    },
};


/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    loadPlugins();
    setEventListeners();
});


/**********************************************************
Loads all of the js plugins
**********************************************************/
function loadPlugins() {
    LocationsSelect.init(eFormProductSearch.inputs.location, 'Location', 3);
    eFormProductSearch.dateRangesFlatpick = new FlatpickrRange(eFormProductSearch.inputs.dates, true);
    loadCategories();
}

/**********************************************************
Registers all of the event handlers
**********************************************************/
function setEventListeners() {
    // product search category input change
    $(eFormProductSearch.inputs.category).on('click', '.dropdown-item', function() {
        handleProductSearchCategoryChange(this);
    });

    $(eFormProductSearch.buttons.search).on('click', function() {
        gotoSearchProductsPage();
    });

    $(eFormProductSearch.classes.input).on('change', function() {
        inputValueChange();
    });
}



/**********************************************************
Handler for when the product search category input is changed.
**********************************************************/
function handleProductSearchCategoryChange(eDropdownItem) {
    // set it to active in the dropdown menu
    $(eFormProductSearch.inputs.category).find('.dropdown-item').removeClass('active');
    $(eDropdownItem).addClass('active');

    // set the dropdown data attribute to the id of the sub category selected
    const subCategoryID = $(eDropdownItem).attr(eFormProductSearch.subCategoryDataAttr);
    $(eFormProductSearch.inputs.category).attr(eFormProductSearch.dropdownDataAttr, subCategoryID);

    // show the name
    const subCategoryName = $(eDropdownItem).text();
    $(eFormProductSearch.dropdownText).text(subCategoryName);
}

/**********************************************************
Fetch the product category data from the API.
**********************************************************/
function loadCategories() {
    ApiWrapper.requestGetProductCategories(loadCategoriesSuccess, loadCategoriesError);
}

/**********************************************************
Callback for an unsuccessful fetch of the product categories (loadCategories)
**********************************************************/
function loadCategoriesError(xhr, status, error) {
    console.error('Error: loadCategoriesError');
    console.error(xhr);
    console.error(status);
    console.error(error);
}

/**********************************************************
Callback for a successful fetch of the product categories (loadCategories)
**********************************************************/
function loadCategoriesSuccess(result,status,xhr) {
    const categories = genertateMinorCategoryMap(result);
    let minors = sortCategories(categories);
    let html = generateCategorieshDropdownHtml(minors);

    $(eFormProductSearch.inputs.category).find('.dropdown-menu').html(html);
}

/**********************************************************
Transforms a list of product category objects into a map:
    key = minor category id
    value = object(name, subs: [])
**********************************************************/
function genertateMinorCategoryMap(categoriesTableList) {
    let minors = {};

    // break down the categories into a map of minor categories with an empty list for the sub categories
    for (const cat of categoriesTableList) {
        minors[cat.minor_id] = {
            name: cat.minor_name,
            subs: [],
        };
    }

    // insert all the sub categories into the sub category list
    for (const cat of categoriesTableList) {
        const sub = {
            id: cat.sub_id,
            name: cat.sub_name,
        };
        minors[cat.minor_id].subs.push(sub);
    }

    return minors;
}

/**********************************************************
Sorts the list of product categories by Minor, Sub category.

This doesn't really do anything right now...
**********************************************************/
function sortCategories(unsortedCategories) {
    return unsortedCategories;
}



/**********************************************************
Generates the dropdown menu html for the #product-search-form-input-category.
The input is a "minor product category" map generated by genertateMinorCategoryMap.
**********************************************************/
function generateCategorieshDropdownHtml(minorCategoriesMap) {
    let html = '';

    for (const minorID of Object.keys(minorCategoriesMap)) {
        const minorName = minorCategoriesMap[minorID].name;

        html += `<div class="header-section">`;
        html += `<h6 class="dropdown-header">${minorName}</h6>`;
        
        // generate the html of the sub categories
        for (const sub of minorCategoriesMap[minorID].subs) {
            html += getSubCategoryDropdownHtml(sub.id, sub.name);
        }

        html += `<div class="dropdown-divider"></div>`;
        html += `</div">`;
    }

    return html;
}

/**********************************************************
Generates the dropdown menu item html for a single sub category.
**********************************************************/
function getSubCategoryDropdownHtml(id, name) {
    let html = `<button class="dropdown-item" type="button" data-category-sub-id="${id}">${name}</button>`;
    return html;
}


/**********************************************************
Creates the search page url and then loads the page
**********************************************************/
function gotoSearchProductsPage() {
    const searchInputValues = eFormProductSearch.getInputValues();

    if (searchInputValues.ends_on == null) {
        return;
    } else if (searchInputValues.starts_on == null) {
        return;
    } else if (searchInputValues.location_id == "" || searchInputValues.location_id == null) {
        return;
    }

    let urlQueryParms = `location_id=${searchInputValues.location_id}&starts_on=${searchInputValues.starts_on}&ends_on=${searchInputValues.ends_on}`;

    let newUrl = `/search/products`;
    if (searchInputValues.product_categories_sub_id > 0) {
        // append the sub product category if they selected one
        newUrl += `/categories/minor/${searchInputValues.product_categories_sub_id}`;
    }

    window.location.href = `${newUrl}?${urlQueryParms}`;
}


/**********************************************************
When an input value is changed, check if the search button
can be enabled. 

The dates and location inputs all need a value in order to
search for a product.
**********************************************************/
function inputValueChange(eChangedInput) {
    const searchInputValues = eFormProductSearch.getInputValues();

    if (Object.values(searchInputValues).includes(null)) {
        $(eFormProductSearch.buttons.search).prop('disabled', true);
    } else {
        $(eFormProductSearch.buttons.search).prop('disabled', false);
    }
}})();//# sourceMappingURL=home.bundle.js.map

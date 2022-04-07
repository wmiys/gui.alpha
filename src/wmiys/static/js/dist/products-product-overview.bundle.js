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
CommonHtml.spinnerSmall = '<div class="spinner-border spinner-border-sm" role="status"></div>';class UrlParser
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
}/**********************************************************
Module variables
**********************************************************/
$('.form-new-product');

// tab pages
({
    category   : $('#form-new-product-page-category'),
    location   : $('#form-new-product-page-location'),
    renterInfo : $('#form-new-product-page-renter-info'),
    photos     : $('#form-new-product-page-photos'),
    nameDesc   : $('#form-new-product-page-name-desc'),
    price      : $('#form-new-product-page-price'),
});

// form inputs
const eInputs = {
    categoryMajor    : $('#form-new-product-input-category-major'),
    categoryMinor    : $('#form-new-product-input-category-minor'),
    categorySub      : $('#form-new-product-input-category-sub'),
    location         : $('#form-new-product-input-location'),
    dropoffDistance  : $('#form-new-product-input-dropoff-distance'),
    coverPhoto       : $('#form-new-product-input-cover-photo'),
    productImages    : $('#form-new-product-input-photos'),
    name             : $('#form-new-product-input-name'),
    description      : $('#form-new-product-input-description'),
    priceFull        : $('#form-new-product-input-price-full'),
    minimumAge       : $('#form-new-product-input-minimum-age'),
};

// buttons
const eButtons = {
    submit: $('.form-new-product-btn-submit'),
    resetCategories: $('#form-new-product-btn-category-reset'),
    removeImage: $('#form-new-product-btn-image-change'),
    formSteps: {
        prev: $('#form-new-product-btn-step-prev'),
        next: $('#form-new-product-btn-step-next'),
    },
    saveImg: {
        cover: '#form-new-product-btn-save-img-cover',
        imgs: '#form-new-product-btn-save-img-imgs',
    },
    
};

// form tabs
const eTabs    = $('.form-new-product-tabs');

const eProgressBar = $('.progress .progress-bar');

// classes
const cInputs  = '.form-new-product-input';
const cBtnStep = '.form-new-product-btn-step';


let filePondCover = null;
let filePondImages = null;

const mProductID = UrlParser.getPathValue(1);   // the product id found in the url: /products/42



let descriptionTextEditor = null;


/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    $('#product-edit-navbar-tab-edit').addClass('active');
    loadSelect2();
    registerFilePondExtensions();
    initProductCoverImagePlugin();
    loadProductImagesPlugin();
    checkIfCategoriesAreSet();
    addEventListeners();
    initPell();
});


/**********************************************************
Adds event listeners to the page elements
**********************************************************/
function addEventListeners() {
    $(eInputs.categoryMajor).on('change', function() {
        const majorCategoryID = $(eInputs.categoryMajor).find('option:selected').val();
        ApiWrapper.requestGetProductCategoriesMinor(majorCategoryID, loadMinorCategoriesSuccess, console.error);
    });
    
    $(eInputs.categoryMinor).on('change', function() {
        const majorCategoryID = $(eInputs.categoryMajor).find('option:selected').val();
        const minorCategoryID = $(eInputs.categoryMinor).find('option:selected').val();
        ApiWrapper.requestGetProductCategoriesSub(majorCategoryID, minorCategoryID, loadSubCategoriesSuccess, console.error);
    });
    
    $(cBtnStep).on('click', function() {
        stepToFormPage(this);
    });
    
    $(cInputs).on('keydown change', function() {
        removeInvalidClass(this);
    });

    $(eButtons.submit).on('click', function() {
        submitFormEvent();
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        setNewStepButtonLocations(e.target);
        submitFormEvent();
    });

    $(eButtons.resetCategories).on('click', function() {
        resetProductCategories();
    });

    $(eButtons.saveImg.cover).on('click', function() {
        saveCoverImage();
    });

    $(eButtons.saveImg.imgs).on('click', function() {
        // saveProductImages();
        uploadNewProductImages();
    });

    filePondCover.on('updatefiles', function(error, file) {
        handleCoverPhotoEdit();
    });
}

/**********************************************************
Registers all of the FilePond extensions.
Need to do this for the FilePond instantiations to work.
**********************************************************/
function registerFilePondExtensions() {
    FilePond.registerPlugin(FilePondPluginFileValidateType);
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginImageValidateSize);
}

/**********************************************************
Load the file selector plugin for the cover photo
**********************************************************/
function initProductCoverImagePlugin() {
    const inputElement = document.querySelector(Utilities.getJqueryElementID(eInputs.coverPhoto));
    
    filePondCover = FilePond.create(inputElement, {
        allowImagePreview: true,
        allowFileTypeValidation: true,
        acceptedFileTypes: ['image/*'],
        // imageValidateSizeMinWidth: 1200,
        // imageValidateSizeMinHeight: 800,
        credits: false,
    });

    displayInitialCoverPhoto();
}


function displayInitialCoverPhoto() {
    const currentImgUrl = $(Utilities.getJqueryElementID(eInputs.coverPhoto)).closest('.form-group-image').attr('data-img-src');

    if (currentImgUrl == "-1") {
        return;
    }

    const pondImage = {
        source: currentImgUrl,
        options: {type: 'remote'},
    };

    filePondCover.addFiles([pondImage]);   
}

/**********************************************************
Load the file selector plugin for the product images.
Then, try to fetch the product images.
**********************************************************/
function loadProductImagesPlugin() {    
    const inputElement = document.querySelector(Utilities.getJqueryElementID(eInputs.productImages));

    filePondImages = FilePond.create(inputElement, {
        // files: files,
        allowMultiple: true,
        allowImagePreview: true,
        allowReorder: true,
        maxFiles: 5,
        allowFileTypeValidation: true,
        acceptedFileTypes: ['image/*'],
        credits: false,
    });

    ApiWrapper.requestGetProductImages(mProductID, getProductImagesSuccess, getProductImagesError); 
}

/**********************************************************
Callback for a successful GET for loadProductImagesPlugin.
Transforms the response data into FilePond 'readable' objects.
Then insert them into the filepond input so the user can see them.
**********************************************************/
function getProductImagesSuccess(response, status, xhr) {
    const files = [];


    for (const img of response) {
        files.push({
            source: img.file_name,
            options: {type: 'remote'},
        });
    }

    filePondImages.addFiles(files);
}

/**********************************************************
Callback for an error encountered in the GET for loadProductImagesPlugin.
**********************************************************/
function getProductImagesError(xhr, status, error) {
    console.error('getProductImagesError');
    console.error(xhr);
    console.error(status);
    console.error(error); 
}


/**********************************************************
Loads the select2 library on the location input
**********************************************************/
function loadSelect2() {
    $(eInputs.location).select2({
        minimumInputLength: 3,
        theme: 'bootstrap4',
        ajax: {
            delay: 150,
            url: ApiWrapper.URLS.SEARCH.LOCATIONS,
            placeholder: "Select a state",
            allowClear: true,
            data: function (params) {
                const urlParms = {      // set the request url ?parms
                    q: params.term,
                };                
                return urlParms;
            },
            processResults: function (data) {
                const processedResults = processLocationSearchApiResponse(data);
                return processedResults;
            }
        },
        
    });
}


/**********************************************************
Setup the description textarea editor
**********************************************************/
function initPell() {
    // save the description text and clear it from the screen
    const initialText = $(eInputs.description).text();
    $(eInputs.description).text('');


    // init the pell library
    const editor = document.getElementById($(eInputs.description)[0].id);
    
    descriptionTextEditor = window.pell.init({
        element: editor,
        onChange: (html) => {
            console.log(html);
        },
        actions: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            // 'heading1',
            // 'heading2',
            'olist',
            'ulist',
        ],
    });

    editor.content.innerHTML = initialText;
}

/**********************************************************
Process the api response data for the location search request.

It is transformed into the recognized format for select2.
**********************************************************/
function processLocationSearchApiResponse(apiResponse) {
    let processedData = [];
    for (let count = 0; count < apiResponse.length; count++) {
        const location = apiResponse[count];
        const text = `${location.city}, ${location.state_name}`;
        processedData.push({id: location.id, text: text});
    }
    
    return ({results: processedData});
}


/**********************************************************
Load the major category options if the category fields
are not set.
**********************************************************/
function checkIfCategoriesAreSet() {
    const subVal = $(eInputs.categorySub).val();

    if (subVal.length == 0) {
        ApiWrapper.requestGetProductCategoriesMajor(loadMajorCategoriesSuccess, loadMajorCategoriesError);
    }
}

/**********************************************************
Load the major categories into the select element
**********************************************************/
function loadMajorCategoriesSuccess(result,status,xhr) {
    let html = '';
    for (majorCategory of result) {
        html += `<option value="${majorCategory.id}">${majorCategory.name}</option>`;
    }
    
    $(eInputs.categoryMajor).prop('disabled', false).html(html);
    $(eInputs.categoryMajor).selectpicker('refresh');
}


/**********************************************************
Error fetching the major categories
**********************************************************/
function loadMajorCategoriesError(xhr, status, error) {
    console.error(xhr);
    console.error(status);
    console.error(error);
    
    enableSubmitButton();
    // Utilities.displayAlert('Error loading major categories');
}


/**********************************************************
Update the minor categories to show the ones that belong 
to the selected major category.
**********************************************************/
function loadMinorCategoriesSuccess(result,status,xhr) {
    let html = '';
    for (minorCategory of result) {
        html += `<option value="${minorCategory.id}">${minorCategory.name}</option>`;
    }
    
    $(eInputs.categoryMinor).prop('disabled', false).html(html).val('');
    $(eInputs.categoryMinor).selectpicker('refresh');
}

/**********************************************************
Load the sub categories based on the minor category
**********************************************************/
function loadSubCategoriesSuccess(result, status, xhr) {
    let html = '';
    for (subCategory of result) {
        html += `<option value="${subCategory.id}">${subCategory.name}</option>`;
    }
    
    $(eInputs.categorySub).prop('disabled', false).html(html).val('');
    $(eInputs.categorySub).selectpicker('refresh');
}

/**********************************************************
Actions to take to send the create prodcut request.
**********************************************************/
function submitFormEvent() {    
    // disableSubmitButton();

    const values = getInputValues(); 
       
    let formData = new FormData();
    
    formData.append("name", values.name);
    formData.append('description', values.description);
    formData.append('product_categories_sub_id', values.categorySub);
    formData.append('location_id', values.location);
    formData.append('dropoff_distance', values.dropoffDistance);
    formData.append('price_full', values.priceFull);
    formData.append('minimum_age', values.minimumAge);

    ApiWrapper.requestPutProduct(mProductID, formData, function() {
        $(eButtons.saveImg.cover).prop('disabled', true);
    }, submitFormEventError);
}

/**********************************************************
Update the cover image file in the database.
**********************************************************/
function saveCoverImage() {
    let imageFile = filePondCover.getFile();

    if (imageFile == null) {
        return;
    }

    let formData = new FormData();
    formData.append('image', imageFile.file);

    ApiWrapper.requestPutProduct(mProductID, formData);
}


/**********************************************************
User want's to upload new product images.

1. First, send a request to delete all of the existing product images.
2. Then, upload the new ones.
**********************************************************/
function uploadNewProductImages() {
    disableProductImagesSaveButton();

    ApiWrapper.requestDeleteProductImages(mProductID, saveProductImages, enableProductImagesSaveButton);
}

/**********************************************************
Send an API request to create the new product images.
**********************************************************/
function saveProductImages() {
    const formData = new FormData();

    let files = filePondImages.getFiles();

    for (const f of files) {
        formData.append(f.file.name, f.file);
    }

    ApiWrapper.requestPostProductImages(mProductID, formData, enableProductImagesSaveButton, enableProductImagesSaveButton);
}

/**********************************************************
Disables the save button when loading the product images.
**********************************************************/
function disableProductImagesSaveButton() {
    const buttonWidth = $(eButtons.saveImg.imgs).width();
    const originalText = $(eButtons.saveImg.imgs).text();
    $(eButtons.saveImg.imgs).html(CommonHtml.spinnerSmall).width(buttonWidth).prop('disabled', true).attr('data-normal-text', originalText);
}

/**********************************************************
Enables the save button for product images.
**********************************************************/
function enableProductImagesSaveButton() {
    const originalText = $(eButtons.saveImg.imgs).attr('data-normal-text');
    $(eButtons.saveImg.imgs).text(originalText).prop('disabled', false);
}


/**********************************************************
When the cover photo input is changed, disable/enable the save button.

If no files are present, disable it.
Otherwise, allow users to save the new photo.

This was made because we want users to have cover photos.
Also, I don't want to send an empty file to the api.
**********************************************************/
function handleCoverPhotoEdit() {
    let imageFile = filePondCover.getFile();

    if (imageFile != null) {
        $(eButtons.saveImg.cover).prop('disabled', false);
    } else {
        $(eButtons.saveImg.cover).prop('disabled', true); 
    }
}


/**********************************************************
Returns an object containing all the new prodcut form input values.
**********************************************************/
function getInputValues() {
    const inputKeys = Object.keys(eInputs);
    let inputValues = {};
    
    for (let count = 0; count < inputKeys.length; count++) {
        const key = inputKeys[count];

        if (key != 'description') {
            inputValues[key] = $(eInputs[key]).val();
        } else {
            const descriptionText = $(descriptionTextEditor).find('.pell-content').html().trim();
            inputValues[key] = descriptionText;
        }
    }
    
    return inputValues;
}

/**********************************************************
Remove the .is-invalid class from an element.
**********************************************************/
function removeInvalidClass(eInputElement) {
    $(eInputElement).closest('.form-group').find('.is-invalid').removeClass('is-invalid');
} 

/**********************************************************
Actions to take if the create product request was not successful.
**********************************************************/
function submitFormEventError(xhr, status, error) {
    // Utilities.displayAlert('There was an error. Please try again.');

    console.error('submitFormEventError');
    console.error(xhr);
    console.error(status);
    console.error(error); 
    
    enableSubmitButton();
}

/**********************************************************
Enable the submit button
**********************************************************/
function enableSubmitButton() {
    $(eButtons.submit).html('Save').prop('disabled', false);
}


/**********************************************************
Set the next/prev form step button location values.

Parms:
    eActiveFormTab - the newly shown tab
**********************************************************/
function setNewStepButtonLocations(eActiveFormTab) {
    const prevLocation = $(eActiveFormTab).attr('data-step-prev');
    const nextLocation = $(eActiveFormTab).attr('data-step-next');

    $(eButtons.formSteps.prev).attr('data-page-location', prevLocation);

    // show/hide the submit button if it's the final page
    if (nextLocation != 'submit') {
        // not the submit page
        $(eButtons.formSteps.next).attr('data-page-location', nextLocation);
        $(eButtons.formSteps.next).removeClass('d-none');
        $(eButtons.submit).addClass('d-none');
        $(eButtons.formSteps.next).prop('disabled', false);
    } else {
        // submit page
        // $(eButtons.formSteps.next).addClass('d-none');
        // $(eButtons.submit).removeClass('d-none');
        $(eButtons.formSteps.next).prop('disabled', true);
    }
}


/**********************************************************
Step to another form page.

Go to the page number indicated by the argument's 
data-page-location attribute.
**********************************************************/
function stepToFormPage(a_eBtnStep) {
    const destinationPageNumber = $(a_eBtnStep).attr('data-page-location');
    $(eTabs).find(`li:nth-child(${destinationPageNumber}) a`).tab('show');

    // set the progress bar width - target page number / total number of pages (6)
    const numTabs = $(eTabs).find('.nav-link').length;
    const newProgressWidth = (destinationPageNumber / numTabs) * 100;
    $(eProgressBar).width(`${newProgressWidth}%`);
}


/**********************************************************
Clear the categories dropdowns and refresh
**********************************************************/
function resetProductCategories() {
    $(eInputs.categoryMajor).find('option').remove();
    $(eInputs.categoryMinor).find('option').remove();
    $(eInputs.categorySub).find('option').remove();

    ApiWrapper.requestGetProductCategoriesMajor(loadMajorCategoriesSuccess, loadMajorCategoriesError);

    $('.selectpicker').selectpicker('refresh');
}})();//# sourceMappingURL=products-product-overview.bundle.js.map

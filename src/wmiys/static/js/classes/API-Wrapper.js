import { API_BASE_URL } from "../pages/api-base-url";
import { Utilities } from "./Utilities";

export class ApiWrapper 
{    
    /**********************************************************
    Send a post Users request to the API
    
    Parms:
        - userInfoStruct - user object containing all the fields
    **********************************************************/
    static async requestPostUser(newUser) {
        const url = '/api/create-account';

        const apiData = Utilities.getUrlSearchParms(newUser);

        const response = await fetch(url, {
            method: ApiWrapper.REQUEST_TYPES.POST,
            body: apiData,
        });

        return response;
    }

    /**********************************************************
    Send a login request
    **********************************************************/
    static async requestLogin(loginStruct) {
        const endpoint = '/api/login';
        const url = Utilities.createUrlWithParms(endpoint, loginStruct);

        const response = await fetch(url);

        return response;
    }

    
    /**********************************************************
    Send a GET request for a user from the API
    **********************************************************/
    static async requestGetUser() {
        const url = '/api/users';
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
    **********************************************************/
    static async requestPutUser(user) {
        const url = '/api/users';
        const data = Utilities.getUrlSearchParms(user);

        const response = await fetch(url, {
            method: ApiWrapper.REQUEST_TYPES.PUT,
            body: data,
        });

        return response;
    }

    /**********************************************************
    Send a GET request to retrieve all of the product categories
    **********************************************************/
    static async requestGetProductCategories() {
        const url = `${ApiWrapper.URLS.PRODUCT_CATEGORIES}`;
        const response = await fetch(url);

        return response;
    }

    /**********************************************************
    Send a GET request to retrieve major product categories
    
    Parms:
        fnSuccess - successful request callback
        fnError - unsuccessful request callback
    **********************************************************/
    static async requestGetProductCategoriesMajor() {
        const url = `${ApiWrapper.URLS.PRODUCT_CATEGORIES}/major`;
        const response = await fetch(url);
        return response;
    }
    
    /**********************************************************
    Send a GET request to retrieve minor product categories that belong to the specifed major category
    
    Parms:
        - majorCategoryID: major category id
    **********************************************************/
    static async requestGetProductCategoriesMinor(majorCategoryID) {
        const url = `${ApiWrapper.URLS.PRODUCT_CATEGORIES}/major/${majorCategoryID}/minor`;
        const response = await fetch(url);
        return response;
    }

    /**********************************************************
    Send a GET request to retrieve sub product categories
    
    Parms:
        - majorCategoryID: major category id
        - majorCategoryID: minor category id
    **********************************************************/
    static async requestGetProductCategoriesSub(majorCategoryID, minorCategoryID) {
        const url = `${ApiWrapper.URLS.PRODUCT_CATEGORIES}/major/${majorCategoryID}/minor/${minorCategoryID}/sub`;
        const response = await fetch(url);
        return response;
    }

    /**********************************************************
    Send a PUT request to create a new product or update it
    **********************************************************/
    static async requestPutProduct(productID, productData) {
        const url = `/api/products/${productID}`;
        const productFormData = Utilities.getFormData(productData);

        const response = await fetch(url, {
            method: ApiWrapper.REQUEST_TYPES.PUT,
            body: productFormData,
        });

        return response;
    }
    
    /**********************************************************
    Send a GET request to fetch a single product availability record.
    **********************************************************/
    static async requestGetProductAvailability(productID, productAvailabilityID) {
        const url = `/api/products/${productID}/availability/${productAvailabilityID}`;
        const response = await fetch(url);

        return response;
    }

    /**********************************************************
    Send a PUT request to update a single product availability record.
    **********************************************************/
    static async requestPutProductAvailability(productID, availabilityID, data) {
        const url = `/api/products/${productID}/availability/${availabilityID}`;

        const response = await fetch(url, {
            body: Utilities.getUrlSearchParms(data),
            method: ApiWrapper.REQUEST_TYPES.PUT,
        });

        return response;
    }

    /**********************************************************
    Send a DELETE product availability request
    **********************************************************/
    static async requestDeleteProductAvailability(productID, productAvailabilityID) {
        const url = `/api/products/${productID}/availability/${productAvailabilityID}`;
        
        const response = await fetch(url, {
            method: ApiWrapper.REQUEST_TYPES.DELETE,
        });

        return response;
    }

    /**********************************************************
    Send a POST product availability request
    **********************************************************/
    static async requestPostProductAvailability(productID, productAvailabilityData) {
        const url = `/api/products/${productID}/availability`;
        const formattedData = Utilities.getUrlSearchParms(productAvailabilityData);
        
        const response = await fetch(url, {
            method: ApiWrapper.REQUEST_TYPES.POST,
            body: formattedData,
        });

        return response;
    }

    /**********************************************************
    Send a GET product images request.
    Retrieve all the product images for a single product.
    **********************************************************/
    static async requestGetProductImages(productID) {
        const url = `/api/products/${productID}/images`;
        const response = await fetch(url);
        return response;
    }

    /**********************************************************
    Send a POST product images request.
    **********************************************************/
    static async requestPostProductImages(productID, files) {
        const url = `/api/products/${productID}/images`;
        const imagesFormData = Utilities.getFormData(files);
        
        const response = await fetch(url, {
            method: ApiWrapper.REQUEST_TYPES.POST,
            body: imagesFormData,
        });

        return response;
    }

    /**********************************************************
    Send a DELETE product images request.
    Deletes all images of a product.
    **********************************************************/
    static async requestDeleteProductImages(productID) {
        const url = `/api/products/${productID}/images`;

        const response = await fetch(url, {
            method: ApiWrapper.REQUEST_TYPES.DELETE,
        });

        return response;
    }

    /**********************************************************
    Send a GET location request to the API
    **********************************************************/
    static async requestGetLocation(locationID) {
        const url = `/api/locations/${locationID}`;
        const response = await fetch(url);
        return response;
    }


    /**********************************************************
    Send a GET product availability request to the API
    **********************************************************/
    static async requestGetProductListingAvailability(productID, availabilityData) {
        const urlPrefix = `/api/listings/${productID}/availability`;
        const url = Utilities.createUrlWithParms(urlPrefix, availabilityData);
        const response = await fetch(url);

        return response;
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
}

/**********************************************************
ApiWrapper static properties
**********************************************************/
ApiWrapper.URL_BASE = API_BASE_URL;

ApiWrapper.URLS = {
    USERS             : ApiWrapper.URL_BASE + '/users',
    LOGIN             : ApiWrapper.URL_BASE + '/login',
    PRODUCT_CATEGORIES: ApiWrapper.URL_BASE + '/product-categories',
}

ApiWrapper.URLS.SEARCH = {
    LOCATIONS: ApiWrapper.URL_BASE + '/search/locations',
}

ApiWrapper.REQUEST_TYPES = {
    GET   : 'GET',
    POST  : 'POST',
    DELETE: 'DELETE',
    PUT   : 'PUT',
    PATCH : 'PATCH',
};

// required fields for each api request 
ApiWrapper.REQ_FIELDS_USER_POST = ['email', 'password', 'name_first', 'name_last', 'birth_date'];
ApiWrapper.REQ_FIELDS_LOGIN     = ['email', 'password'];

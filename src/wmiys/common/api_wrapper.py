import requests
from datetime import date
from .. import keys
from . import utilities


URL_BASE = 'https://api.wmiys.com'

custom_headers = {
    'x-client-key': keys.verification.header
}


#------------------------------------------------------
# Log a client in
#------------------------------------------------------
def login(email, password) -> requests.Response:
    url = f'{URL_BASE}/login'
    api_response = requests.get(url, params=dict(email=email, password=password), headers=custom_headers)
    return api_response


#------------------------------------------------------
# Create a new client account
#------------------------------------------------------
def createAccount(email, password, name_first, name_last, birth_date) -> requests.Response:
    url = f'{URL_BASE}/users'
    parms = dict(email=email, password=password, name_first=name_first, name_last=name_last, birth_date=birth_date)
    return requests.post(url, data=parms, headers=custom_headers)

#------------------------------------------------------
# Return all of the product categories from the api
#
# Returns the api response of the product categories as either:
#   - a table
#   - 3 seperate lists (major, minor, sub)
#------------------------------------------------------
def getProductCategories(a_bReturnAsSeperate: bool=False):
    url = f'{URL_BASE}/product-categories'

    if a_bReturnAsSeperate:
        url += '?seperate=true'

    response = requests.get(url)
    return response



#------------------------------------------------------
# Class to hold the parms for api requests
#------------------------------------------------------
class RequestParms:
    def __init__(self, url: str=None, parms: dict=None, data: dict=None, files: dict=None):
        self.url   = url
        self.parms = parms
        self.data  = data
        self.files = files


#------------------------------------------------------
# Abstract ApiWrapper class
#
# Abstract class defining ApiWrapper with required methods.
#------------------------------------------------------
class ApiWrapperAbstract:
    def get(self) -> requests.Response:
        raise NotImplementedError
    
    def post(self) -> requests.Response:
        raise NotImplementedError
    
    def put(self) -> requests.Response:
        raise NotImplementedError
    
    def delete(self) -> requests.Response:
        raise NotImplementedError


#------------------------------------------------------
# Base ApiWrapper class
#
# ALl ApiWrapperXXX classes need to inherit from this
# base class.
#------------------------------------------------------
class ApiWrapperBase(ApiWrapperAbstract):

    #------------------------------------------------------
    # Constructor
    #
    # Args:
    #   flask_g: the global flask object (g)
    #------------------------------------------------------
    def __init__(self, flask_g=None, user_id: int=None, email: str=None, password: str=None):
        self.user_id  = getattr(flask_g, 'user_id', user_id)
        self.email    = getattr(flask_g, 'email', email)
        self.password = getattr(flask_g, 'password', password)

    #------------------------------------------------------
    # Send a GET request
    #------------------------------------------------------
    def _get(self, request_parms: RequestParms) -> requests.Response:
        return self._baseRequest(requests.get, request_parms)
    
    #------------------------------------------------------
    # Send a POST request
    #------------------------------------------------------
    def _post(self, request_parms: RequestParms) -> requests.Response:
        return self._baseRequest(requests.post, request_parms)

    #------------------------------------------------------
    # Send a PUT request
    #------------------------------------------------------
    def _put(self, request_parms: RequestParms) -> requests.Response:
        return self._baseRequest(requests.put, request_parms)

    #------------------------------------------------------
    # Send a DELETE request
    #------------------------------------------------------
    def _delete(self, request_parms: RequestParms) -> requests.Response:
        return self._baseRequest(requests.delete, request_parms)
    
    #------------------------------------------------------
    # Base request method for all others to use.
    #------------------------------------------------------
    def _baseRequest(self, request_method, request_parms: RequestParms) -> requests.Response:
        api_url = f'{URL_BASE}/{request_parms.url}'

        return request_method(
            url     = api_url,
            auth    = (self.email, self.password),
            headers = custom_headers,
            data    = request_parms.data,
            params  = request_parms.parms,
            files   = request_parms.files
        )

#************************************************************************************
#************************************************************************************
#                               USER
#************************************************************************************
#************************************************************************************

class ApiWrapperUsers(ApiWrapperBase):

    URL = 'users/{}'

    #------------------------------------------------------
    # Get the client's information
    #------------------------------------------------------
    def get(self) -> requests.Response:
        parms = RequestParms(url=self.URL.format(self.user_id))
        return self._get(parms)

    #------------------------------------------------------
    # Update a user
    #------------------------------------------------------
    def put(self, user_data) -> requests.Response:
        parms = RequestParms(url=self.URL.format(self.user_id), data=user_data)
        return self._put(parms)



#************************************************************************************
#************************************************************************************
#                             PRODUCTS
#************************************************************************************
#************************************************************************************

class ApiWrapperProducts(ApiWrapperBase):
    """Api Wrapper class for Products"""

    URL = 'products'

    #------------------------------------------------------
    # Get a user's product(s).
    #
    # If the caller provides a product_id, only returns the
    # data for the given product_id. Otherwise, returns all
    # of the user's products.
    #
    # Parms:
    #   product_id: optional
    #------------------------------------------------------
    def get(self, product_id: int=None) -> requests.Response:
        parms = RequestParms(url=self.URL)

        if product_id:
            parms.url = f'{self.URL}/{product_id}'
        
        return self._get(parms)

    #------------------------------------------------------
    # Update a product
    #------------------------------------------------------
    def put(self, product_id: int, new_product_data: dict, product_cover_photo=None) -> requests.Response:
        parms = self._getCommonRequestObject(new_product_data, product_cover_photo)
        parms.url = f'{self.URL}/{product_id}'

        return self._put(parms)
    
    #------------------------------------------------------
    # Create a new product
    #------------------------------------------------------
    def post(self, new_product_data: dict, product_cover_photo=None) -> requests.Response:
        parms = self._getCommonRequestObject(new_product_data, product_cover_photo)
        return self._post(parms)

    #------------------------------------------------------
    # Private method to create a common RequestParm used 
    # for post/put methods in this class.
    #------------------------------------------------------
    def _getCommonRequestObject(self, new_product_data: dict, product_cover_photo=None) -> RequestParms:
        parms = RequestParms(url=self.URL, data=new_product_data)

        if product_cover_photo:
            parms.files = {'image': (product_cover_photo.filename, product_cover_photo)}
        
        return parms



#************************************************************************************
#************************************************************************************
#                             PRODUCT AVAILABILITY
#************************************************************************************
#************************************************************************************

class ApiWrapperProductAvailability(ApiWrapperBase):
    """Api Wrapper for Product Availability"""
    
    URL_TEMPLATE = 'products/{}/availability'

    #------------------------------------------------------
    # Get the product availability(s) for a single product
    #
    # Parms:
    #    product_id: the product's id
    #
    # Returns: a list of all the product's availabilities
    #------------------------------------------------------
    def get(self, product_id: int, product_availability_id: int=None) -> requests.Response:
        parms = RequestParms(url=self.URL_TEMPLATE.format(product_id))

        if product_availability_id:
            parms.url = f'{parms.url}/{product_availability_id}'
        
        return self._get(parms)

    #------------------------------------------------------
    # Update a single product availability record
    #
    # Parms:
    #   product_id: the product id
    #   product_availability_id: id of the desired product availability
    #   updatedProductAvailability: a dict containing the request body data
    #
    # Returns the api response
    #------------------------------------------------------
    def put(self, product_id: int, product_availability_id: int, updated_product_availability: dict) -> requests.Response:

        parms = RequestParms(
            url  = f'{self.URL_TEMPLATE.format(product_id)}/{product_availability_id}',
            data = updated_product_availability
        )

        return self._put(parms)
    
    #------------------------------------------------------
    # Delete a single product availability record
    #
    # Parms:
    #   product_id (int): the product id
    #   product_availability_id (int): id of the requested product availability
    #
    # Returns the api response
    #------------------------------------------------------
    def delete(self, product_id: int, product_availability_id: int) -> requests.Response:
        parms = RequestParms(
            url  = f'{self.URL_TEMPLATE.format(product_id)}/{product_availability_id}'
        )

        return self._delete(parms)


    #------------------------------------------------------
    # Create a new single product availability record
    #
    # Parms:
    #   product_id (int): the product id
    #   newProductAvailabilityFormData (object): the request form data
    #
    # Returns the api response
    #------------------------------------------------------
    def post(self, product_id: int, product_availability_data: dict) -> requests.Response:
        parms = RequestParms(
            url  = f'{self.URL_TEMPLATE.format(product_id)}',
            data = product_availability_data
        )

        return self._post(parms)



#************************************************************************************
#************************************************************************************
#                             PRODUCT IMAGES
#************************************************************************************
#************************************************************************************

class ApiWrapperProductImages(ApiWrapperBase):
    """Api Wrapper for Product Images"""

    URL = 'products/{}/images'

    #------------------------------------------------------
    # Create a new product image
    #------------------------------------------------------
    def post(self, product_id: int, product_image_files) -> requests.Response:
        parms = RequestParms(
            url   = self.URL.format(product_id),
            files = product_image_files
        )

        return self._post(parms)

    #------------------------------------------------------
    # Get all the product images for a single product
    #------------------------------------------------------
    def get(self, product_id: int) -> requests.Response:
        return self._allRequests(product_id, self._get)

    #------------------------------------------------------
    # Delete the images for a product
    #------------------------------------------------------
    def delete(self, product_id: int) -> requests.Response:
        return self._allRequests(product_id, self._delete)

    #------------------------------------------------------
    # Standardized function for submitting similar requests.
    #
    # Parms:
    #   product_id: the product's id
    #   request_method: the method to call
    #------------------------------------------------------
    def _allRequests(self, product_id: int, request_method) -> requests.Response:
        parms = RequestParms(url=self.URL.format(product_id))
        return request_method(parms)



#************************************************************************************        
#************************************************************************************
#                             PRODUCT SEARCH
#************************************************************************************
#************************************************************************************

class ApiWrapperSearchProducts(ApiWrapperBase):
    """Api Wrapper for Search Products"""

    URL = 'search/products'
    URL_CATEGORY_TEMPLATE = 'search/products/categories/{}/{}'
    
    #------------------------------------------------------
    # Search all products
    #------------------------------------------------------
    def get(self, location_id, starts_on, ends_on, sort, per_page, page) -> requests.Response:
        parms = RequestParms(
            url = self.URL,
            parms=self._getRequestParmsDict(location_id, starts_on, ends_on, sort, per_page, page)
        )

        return self._get(parms)

    #------------------------------------------------------
    # Search all products for major category
    #------------------------------------------------------
    def getMajor(self, location_id, starts_on, ends_on, product_category_major_id, sort, per_page, page) -> requests.Response:
        return self._getRequestForCategory(location_id, starts_on, ends_on, product_category_major_id, sort, per_page, page, 'major')
    
    #------------------------------------------------------
    # Search all products for minor category
    #------------------------------------------------------
    def getMinor(self, location_id, starts_on, ends_on, product_category_minor_id, sort, per_page, page) -> requests.Response:
        return self._getRequestForCategory(location_id, starts_on, ends_on, product_category_minor_id, sort, per_page, page, 'minor')
    
    #------------------------------------------------------
    # Search all products for sub category
    #------------------------------------------------------
    def getSub(self, location_id, starts_on, ends_on, product_category_sub_id, sort, per_page, page) -> requests.Response:
        return self._getRequestForCategory(location_id, starts_on, ends_on, product_category_sub_id, sort, per_page, page, 'sub')

    #------------------------------------------------------
    # Template for requesting a search product with a category filter
    #------------------------------------------------------
    def _getRequestForCategory(self, location_id, starts_on, ends_on, category_id, sort, per_page, page, category_type) -> requests.Response:
        parms = RequestParms(
            url = self.URL_CATEGORY_TEMPLATE.format(category_type, category_id),
            parms = self._getRequestParmsDict(location_id, starts_on, ends_on, sort, per_page, page)
        )

        return self._get(parms) 
        
    #------------------------------------------------------
    # Template for transforming all the request url parms into a dict
    #------------------------------------------------------
    def _getRequestParmsDict(self, location_id, starts_on, ends_on, sort, per_page, page) -> dict:
        return dict(
            location_id = location_id,
            starts_on   = starts_on,
            ends_on     = ends_on,
            sort        = sort,
            per_page    = per_page,
            page        = page
        )
            
    

#************************************************************************************
#************************************************************************************
#                               PRODUCT LISTING
#************************************************************************************
#************************************************************************************
class ApiWrapperListing(ApiWrapperBase):
    """Api Wrapper for Listings"""

    URL = 'listings/{}'

    #------------------------------------------------------
    # Get a product listing
    #------------------------------------------------------
    def get(self, product_id: int) -> requests.Response:
        parms = RequestParms(url=self.URL.format(product_id))
        return self._get(parms)



#************************************************************************************
#************************************************************************************
#                        PRODUCT LISTING AVAILABILITY
#************************************************************************************
#************************************************************************************

class ApiWrapperListingAvailability(ApiWrapperBase):
    """Api Wrapper for Listing Availabilities"""

    URL = 'listings/{}/availability'

    def get(self, product_id: int, starts_on, ends_on, location_id) -> requests.Response:
        parms = RequestParms(
            url = self.URL.format(product_id),
            parms = dict(location_id=location_id, starts_on=starts_on, ends_on=ends_on)
        )

        return self._get(parms)


#************************************************************************************
#************************************************************************************
#                               PAYMENTS
#************************************************************************************
#************************************************************************************
class ApiWrapperPayments(ApiWrapperBase):
    """Api Wrapper for Payments"""

    URL = 'payments'

    #------------------------------------------------------
    # Insert a new pending payment request
    #------------------------------------------------------
    def post(self, product_id: int, location_id: int, starts_on: date, ends_on: date) -> requests.Response:
        parms = RequestParms(
            url  = self.URL,
            data = dict(product_id=product_id, dropoff_location_id=location_id, starts_on=starts_on, ends_on=ends_on)
        )

        return self._post(parms)



#************************************************************************************
#************************************************************************************
#                               PRODUCT REQUESTS
#************************************************************************************
#************************************************************************************

class ApiWrapperRequests(ApiWrapperBase):
    """Api Wrapper for Product Requests"""
    
    URL = 'requests/received'
    
    #------------------------------------------------------
    # Insert a new product request to a lender
    #------------------------------------------------------
    def post(self, payment_id, session_id) -> requests.Response:
        parms = RequestParms(
            url  = self.URL,
            data = dict(payment_id=payment_id, session_id=session_id)
        )

        return self._post(parms)

    #------------------------------------------------------
    # Fetch all requests received
    #------------------------------------------------------
    def get(self, status: str='all') -> requests.Response:
        parms = RequestParms(
            url   = self.URL,
            parms = dict(status=status)
        )

        return self._get(parms)


    #------------------------------------------------------
    # Lender responds to a received product request
    #------------------------------------------------------
    def put(self, request_id, status) -> requests.Response:
        parms = RequestParms()
        parms.url = f'{self.URL}/{request_id}/{status}'

        return self._post(parms)
    

class ApiWrapperRequestsSubmitted(ApiWrapperBase):
    """Api Wrapper for Product Requests"""
    
    URL = 'requests/submitted'

    def get(self, status: str=None) -> requests.Response:


        parms = RequestParms(
            url = self.URL,
            parms = dict(status=status)
        )

        return self._get(parms)




#************************************************************************************
#************************************************************************************
#                         LOCATIONS
#************************************************************************************
#************************************************************************************
class ApiWrapperLocations(ApiWrapperBase):
    """Api Wrapper for locations"""

    URL = 'locations/{}'

    #------------------------------------------------------
    # Request to get a single location.
    #------------------------------------------------------
    def get(self, location_id: int) -> requests.Response:
        parms = RequestParms(url=self.URL.format(location_id))
        return self._get(parms)





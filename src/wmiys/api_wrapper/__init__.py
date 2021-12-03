import requests
from enum import Enum
from wmiys_common import keys, config_pairs

#------------------------------------------------------
# Prefix for the api url
#------------------------------------------------------
URL_BASE = config_pairs.ApiUrls.PRODUCTION

#------------------------------------------------------
# All the suffixes for the api urls
#------------------------------------------------------
class ApiUrls(str, Enum):
    USERS                    = 'users/{}'
    PRODUCTS                 = 'products'
    PRODUCT_AVAILABILITY     = 'products/{}/availability'
    PRODUCT_IMAGES           = 'products/{}/images'
    SEARCH_PRODUCTS          = 'search/products'
    SEARCH_PRODUCTS_CATEGORY = 'search/products/categories/{}/{}'
    LISTINGS                 = 'listings/{}'
    LISTING_AVAILABILITY     = 'listings/{}/availability'
    PAYMENTS                 = 'payments'
    REQUESTS_RECEIVED        = 'requests/received'
    REQUESTS_SUBMITTED       = 'requests/submitted'
    LOCATIONS                = 'locations/{}'
    PAYOUT_ACCOUNTS          = 'payout-accounts'
    BALANCE_TRANSFERS        = 'balance-transfers'
    PASSWORD_RESETS          = 'password-resets'



#------------------------------------------------------
# The custom header we are going to send to the api.
# 
# We do this so that the api knows this request is coming 
# from the front-end, and not a third party.
#------------------------------------------------------
CUSTOM_HEADER = {
    'x-client-key': keys.verification.header
}


#------------------------------------------------------
# Log a client in
#------------------------------------------------------
def login(email, password) -> requests.Response:
    url = f'{URL_BASE}/login'
    api_response = requests.get(url, params=dict(email=email, password=password), headers=CUSTOM_HEADER)
    return api_response


#------------------------------------------------------
# Create a new client account
#------------------------------------------------------
def createAccount(email, password, name_first, name_last, birth_date) -> requests.Response:
    url = f'{URL_BASE}/users'
    parms = dict(email=email, password=password, name_first=name_first, name_last=name_last, birth_date=birth_date)
    return requests.post(url, data=parms, headers=CUSTOM_HEADER)

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

    return requests.get(url)


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
            headers = CUSTOM_HEADER,
            data    = request_parms.data,
            params  = request_parms.parms,
            files   = request_parms.files
        )



from .users import ApiWrapperUsers as ApiWrapperUsers
from .products import ApiWrapperProducts as ApiWrapperProducts
from .product_availability import ApiWrapperProductAvailability as ApiWrapperProductAvailability
from .product_images import ApiWrapperProductImages as ApiWrapperProductImages
from .search_products import ApiWrapperSearchProducts as ApiWrapperSearchProducts
from .listings import ApiWrapperListing as ApiWrapperListing
from .listings import ApiWrapperListingAvailability as ApiWrapperListingAvailability
from .payments import ApiWrapperPayments as ApiWrapperPayments
from .requests import ApiWrapperRequests as ApiWrapperRequests
from .requests import ApiWrapperRequestsSubmitted as ApiWrapperRequestsSubmitted
from .locations import ApiWrapperLocations as ApiWrapperLocations
from .payout_accounts import ApiWrapperPayoutAccounts as ApiWrapperPayoutAccounts
from .balance_transfers import ApiWrapperBalanceTransfers as ApiWrapperBalanceTransfers
from .password_resets import ApiWrapperPasswordResets as ApiWrapperPasswordResets


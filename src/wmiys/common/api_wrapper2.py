import requests
from .. import keys
from mysql.connector.cursor import MySQLCursor


URL_BASE = 'http://10.0.0.82:5000'

custom_headers = {
    'x-client-key': keys.verification.header
}


#------------------------------------------------------
# Class to hold the parms for api requests
#------------------------------------------------------
class RequestParms:
    def __init__(self, url: str=None, parms: dict=None, data: dict=None, files: dict=None):
        self.url = url
        self.parms = parms
        self.data = data
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
    #------------------------------------------------------
    def __init__(self, userID: int=None, email: str=None, password: str=None):
        self.userID = userID
        self.email = email
        self.password = password

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
    # Create a new product
    #------------------------------------------------------
    def post(self, new_product_data: dict, product_cover_photo=None) -> requests.Response:
        parms = self._getCommonRequestObject(new_product_data, product_cover_photo)
        return self._post(parms)

    #------------------------------------------------------
    # Update a product
    #------------------------------------------------------
    def put(self, new_product_data: dict, product_cover_photo=None) -> requests.Response:
        parms = self._getCommonRequestObject(new_product_data, product_cover_photo)
        return self._put(parms)

    #------------------------------------------------------
    # Private method to create a common RequestParm used 
    # for post/put methods in this class.
    #------------------------------------------------------
    def _getCommonRequestObject(self, new_product_data: dict, product_cover_photo=None) -> RequestParms:
        parms = RequestParms(url=self.URL, data=new_product_data)

        if product_cover_photo:
            parms.files = {'image': (product_cover_photo.filename, product_cover_photo)}
        
        return parms






        
        
            
        




    
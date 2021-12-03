import requests
from . import ApiWrapperBase, RequestParms, ApiUrls

class ApiWrapperProducts(ApiWrapperBase):
    """Api Wrapper class for Products"""

    URL = ApiUrls.PRODUCTS

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
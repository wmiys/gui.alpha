import requests
from . import ApiWrapperBase, RequestParms, ApiUrls

class ApiWrapperProductImages(ApiWrapperBase):
    """Api Wrapper for Product Images"""

    URL = ApiUrls.PRODUCT_IMAGES

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
import requests
from . import ApiWrapperBase, RequestParms, ApiUrls

#************************************************************************************
#************************************************************************************
#                             PRODUCT AVAILABILITY
#************************************************************************************
#************************************************************************************

class ApiWrapperProductAvailability(ApiWrapperBase):
    """Api Wrapper for Product Availability"""
    
    URL = ApiUrls.PRODUCT_AVAILABILITY

    #------------------------------------------------------
    # Get the product availability(s) for a single product
    #
    # Parms:
    #    product_id: the product's id
    #
    # Returns: a list of all the product's availabilities
    #------------------------------------------------------
    def get(self, product_id: int, product_availability_id: int=None) -> requests.Response:
        parms = RequestParms(url=self.URL.format(product_id))

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
            url  = f'{self.URL.format(product_id)}/{product_availability_id}',
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
            url  = f'{self.URL.format(product_id)}/{product_availability_id}'
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
            url  = f'{self.URL.format(product_id)}',
            data = product_availability_data
        )

        return self._post(parms)
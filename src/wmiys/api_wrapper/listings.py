import requests
from . import ApiWrapperBase, RequestParms, ApiUrls


class ApiWrapperListing(ApiWrapperBase):
    """Api Wrapper for Listings"""

    URL = ApiUrls.LISTINGS

    #------------------------------------------------------
    # Get a product listing
    #------------------------------------------------------
    def get(self, product_id: int) -> requests.Response:

        return self._get(RequestParms(
            url = self.URL.format(product_id)
        ))


class ApiWrapperListingAvailability(ApiWrapperBase):
    """Api Wrapper for Listing Availabilities"""

    URL = ApiUrls.LISTING_AVAILABILITY
    
    def get(self, product_id: int, parms: dict) -> requests.Response:
        parms = RequestParms(
            url   = self.URL.format(product_id),
            parms = parms
        )

        return self._get(parms)
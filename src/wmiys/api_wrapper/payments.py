import requests
from datetime import date
from . import ApiWrapperBase, RequestParms, ApiUrls


class ApiWrapperPayments(ApiWrapperBase):
    """Api Wrapper for Payments"""

    URL = ApiUrls.PAYMENTS

    #------------------------------------------------------
    # Insert a new pending payment request
    #------------------------------------------------------
    def post(self, product_id: int, location_id: int, starts_on: date, ends_on: date) -> requests.Response:
        parms = RequestParms(
            url  = self.URL,
            data = dict(product_id=product_id, dropoff_location_id=location_id, starts_on=starts_on, ends_on=ends_on)
        )

        return self._post(parms)
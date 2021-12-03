import requests
from . import ApiWrapperBase, RequestParms, ApiUrls


class ApiWrapperBalanceTransfers(ApiWrapperBase):
    "Api Wrapper for lender balance transfers"

    URL = ApiUrls.BALANCE_TRANSFERS
    
    #------------------------------------------------------
    # Create a new balance transfer record
    #------------------------------------------------------
    def post(self) -> requests.Response:
        parms = RequestParms(
            url = self.URL,
        )

        return self._post(parms)
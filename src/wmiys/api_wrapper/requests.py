from uuid import UUID
import requests
from . import ApiWrapperBase, RequestParms, ApiUrls


class ApiWrapperRequests(ApiWrapperBase):
    """Api Wrapper for Product Requests"""
    
    URL = ApiUrls.REQUESTS_RECEIVED
    
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
    
    URL = ApiUrls.REQUESTS_SUBMITTED

    def get(self, status: str=None) -> requests.Response:
        parms = RequestParms(
            url = self.URL,
            parms = dict(status=status)
        )

        return self._get(parms)


class ApiWrapperRequestSubmitted(ApiWrapperBase):
    """Get a single submitted product request"""
    
    URL = f'{ApiUrls.REQUESTS_SUBMITTED}/{{}}'

    def get(self, request_id: UUID) -> requests.Response:
        parms = RequestParms(
            url = self.URL.format(str(request_id)),
        )

        return self._get(parms)


    def patch(self, request_id: UUID, data) -> requests.Response:
        parms = RequestParms(
            url = self.URL.format(str(request_id)),
            data = data,
        )

        return self._patch(parms)
        
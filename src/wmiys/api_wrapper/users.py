import requests
from . import ApiWrapperBase, RequestParms, ApiUrls

class ApiWrapperUsers(ApiWrapperBase):

    URL = ApiUrls.USERS

    #------------------------------------------------------
    # Get the client's information
    #------------------------------------------------------
    def get(self) -> requests.Response:
        parms = RequestParms(url=self.URL.format(self.user_id))
        return self._get(parms)

    #------------------------------------------------------
    # Update a user
    #------------------------------------------------------
    def put(self, user_data: dict) -> requests.Response:
        parms = RequestParms(url=self.URL.format(self.user_id), data=user_data)
        return self._get(parms)
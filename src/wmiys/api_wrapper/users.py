import requests
from . import ApiWrapperBase, RequestParms

class ApiWrapperUsers(ApiWrapperBase):

    URL = 'users/{}'

    #------------------------------------------------------
    # Get the client's information
    #------------------------------------------------------
    def get(self) -> requests.Response:
        parms = RequestParms(url=self.URL.format(self.user_id))
        return self._get(parms)

    #------------------------------------------------------
    # Update a user
    #------------------------------------------------------
    def put(self, user_data) -> requests.Response:
        parms = RequestParms(url=self.URL.format(self.user_id), data=user_data)
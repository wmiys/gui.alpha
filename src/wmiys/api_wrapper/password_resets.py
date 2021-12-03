import requests
from uuid import UUID
from . import ApiWrapperBase, RequestParms, ApiUrls


class ApiWrapperPasswordResets(ApiWrapperBase):
    "Api Wrapper for password resets"

    URL = ApiUrls.PASSWORD_RESETS
    
    #------------------------------------------------------
    # Create a new balance transfer record
    #------------------------------------------------------
    def post(self, email: str) -> requests.Response:
        parms = RequestParms(
            url = self.URL,
            data = dict(email=email),
        )

        return self._post(parms)

    #------------------------------------------------------
    # Update a password reset record
    #------------------------------------------------------
    def put(self, password_reset_id: UUID, new_password: str) -> requests.Response:
        parms = RequestParms(
            url = f'{self.URL}/{str(password_reset_id)}',
            data = dict(password=new_password)
        )

        return self._put(parms)
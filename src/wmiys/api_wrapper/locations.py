import requests
from . import ApiWrapperBase, RequestParms, ApiUrls

class ApiWrapperLocations(ApiWrapperBase):
    """Api Wrapper for locations"""

    URL = ApiUrls.LOCATIONS

    #------------------------------------------------------
    # Request to get a single location.
    #------------------------------------------------------
    def get(self, location_id: int) -> requests.Response:
        parms = RequestParms(url=self.URL.format(location_id))
        return self._get(parms)
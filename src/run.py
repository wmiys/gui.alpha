from wmiys_common import constants
from wmiys import app 
from wmiys.common import api_wrapper, security

if __name__ == "__main__":
    api_wrapper.URL_BASE = constants.DevelopmentUrls.API.value
    security.LOGIN_URL_PREFIX = constants.DevelopmentUrls.FRONT_END.value
    app.run(debug=True, host="0.0.0.0", port=8000, threaded=True)
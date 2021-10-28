from wmiys import app 

from wmiys.common import api_wrapper, constants

if __name__ == "__main__":
    api_wrapper.URL_BASE = constants.DevConstants.API_URL.value
    app.run(debug=True, host="0.0.0.0", port=8000, threaded=True)

    
    
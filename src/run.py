from wmiys_common import config_pairs
from wmiys import app 
from wmiys.common import security
from wmiys import api_wrapper
from wmiys.payments import payout_accounts
from wmiys.routes import account_settings

if __name__ == "__main__":
    # set some development variables
    api_wrapper.URL_BASE      = config_pairs.ApiUrls.DEV
    security.LOGIN_URL_PREFIX = config_pairs.FrontEndUrls.DEV
    payout_accounts.URL_BASE  = config_pairs.FrontEndUrls.DEV
    account_settings.URL_BASE = config_pairs.FrontEndUrls.DEV

    app.run(debug=True, host="0.0.0.0", port=8000, threaded=True)
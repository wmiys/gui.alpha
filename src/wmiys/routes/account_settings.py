#*******************************************************************************************
# Module:       account_settings
#
# Url Prefix:   /account-settings
#
# Description:  Routing for all account settings
#*******************************************************************************************

import flask
from wmiys_common.config import Production as ConfigProduction
from wmiys.api_wrapper import ApiWrapperUsers
from wmiys.common import security, product_requests


# module blueprint
bpAccountSettings = flask.Blueprint('account_settings', __name__)

URL_BASE = ConfigProduction.URL_GUI

#------------------------------------------------------
# Account settings page (general)
#------------------------------------------------------
@bpAccountSettings.route('')
@security.login_required
def accountSettings():
    api = ApiWrapperUsers(flask.g)
    response = api.get()
    return flask.render_template('pages/account-settings/general.html', userInfo=response.json())

#------------------------------------------------------
# Account settings page (general)
# Redirects to accountSettings
#------------------------------------------------------
@bpAccountSettings.route('general')
@security.login_required
def accountSettingsGeneral():
    url = URL_BASE + flask.url_for('.accountSettings')
    return flask.redirect(url)



#------------------------------------------------------
# Account settings page (general)
# Redirects to accountSettings
#------------------------------------------------------
@bpAccountSettings.route('requests')
@security.login_required
def submittedRequests():
    api = ApiWrapperUsers(flask.g)
    user_api_response = api.get()

    if not user_api_response.ok:
        flask.abort(400)
    
    requests = product_requests.getSubmitted()

    return flask.render_template('pages/account-settings/requests-submitted.html', userInfo = user_api_response.json(), requests=requests)
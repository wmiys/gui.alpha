#*******************************************************************************************
# Module:       account_settings
#
# Url Prefix:   /account-settings
#
# Description:  Routing for all account settings
#*******************************************************************************************
import flask
from ..common import security, ApiWrapperUsers

# module blueprint
bpAccountSettings = flask.Blueprint('account_settings', __name__)


#------------------------------------------------------
# Account settings page
#------------------------------------------------------
@bpAccountSettings.route('')
@security.login_required
def accountSettings():
    api = ApiWrapperUsers(flask.g)
    response = api.get()
    return flask.render_template('pages/account-settings/account-settings.html', userInfo=response.json())
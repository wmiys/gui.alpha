#*******************************************************************************************
# Module:       account_settings
#
# Url Prefix:   /account-settings
#
# Description:  Routing for all account settings
#*******************************************************************************************

from flask import Blueprint, render_template
from ..common import security

bpAccountSettings = Blueprint('account_settings', __name__)


@bpAccountSettings.route('')
@security.login_required
def accountSettings():
    response = security.apiWrapper.getUser()
    return render_template('pages/account-settings/account-settings.html', userInfo=response.json())
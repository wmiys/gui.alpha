"""
Package:        account_settings
Url Prefix:     /account-settings
Description:    Handles the routing for account settings
"""

import flask
from flask import Blueprint, jsonify, request
import wmiys.common.Security as Security
from wmiys.common.Security import apiWrapper

bpAccountSettings = Blueprint('account_settings', __name__)


@bpAccountSettings.route('')
@Security.login_required
def accountSettings():
    response = apiWrapper.getUser()
    return flask.render_template('pages/account-settings/account-settings.html', userInfo=response.json())
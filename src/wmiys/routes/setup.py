#*******************************************************************************************
# Module:       setup pages
#
# Url Prefix:   /setup
#
# Description:  Setup various services on the platform
#*******************************************************************************************
import flask
from flask.helpers import url_for
import stripe
import uuid
from http import HTTPStatus
from werkzeug.utils import redirect
from wmiys_common import keys, utilities, config_pairs
from ..common import security, api_wrapper
from .. import payments


URL_TEMPLATE = 'http://10.0.0.82:8000/setup/lender/{}?status={}'


# module blueprint
bpSetup = flask.Blueprint('bpSetup', __name__)

stripe.api_key = keys.payments.test

#------------------------------------------------------
# Create a new product checkout stripe page
#------------------------------------------------------
@bpSetup.get('lender')
@security.login_required
def createLenderAccount():
    
    new_account: stripe.Account = stripe.Account.create(type='express')

    utilities.printWithSpaces(new_account.stripe_id)

    account_link: stripe.AccountLink = stripe.AccountLink.create(
        account     = new_account.stripe_id,
        refresh_url = URL_TEMPLATE.format(new_account.stripe_id, 'refresh'),
        return_url  = URL_TEMPLATE.format(new_account.stripe_id, 'return'),
        type        = "account_onboarding",
    )

    return flask.redirect(account_link.url, code=303)


#------------------------------------------------------
# Create a new product checkout stripe page
#------------------------------------------------------
@bpSetup.get('lender/<stripe_account_id>')
@security.login_required
def getLenderAccount(stripe_account_id):
    account = stripe.Account.retrieve(stripe_account_id)
    return flask.jsonify(account)

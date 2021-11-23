from __future__ import annotations
import requests
from uuid import UUID
from functools import wraps
import flask
import stripe
from wmiys_common import keys, config_pairs
from ..common import api_wrapper

stripe.api_key = keys.payments.test

URL_BASE = config_pairs.FrontEndUrls.PRODUCTION

#------------------------------------------------------
# Tell the API that we want to attempt to setup a 
# payout account.
#------------------------------------------------------
def getNewPayoutAccountResponse(flask_g) -> requests.Response:
    api = api_wrapper.ApiWrapperPayoutAccounts(flask_g)
    return api.post()

#------------------------------------------------------
# Setup the success/error urls for creating the stripe
# account link object.
#------------------------------------------------------
def getAccountLinkUrls(payout_account) -> tuple(str, str):
    payout_account_id = UUID(payout_account.get('id'))

    url_success = URL_BASE + flask.url_for('bpSetup.confirm', payout_account_id=payout_account_id)
    url_error = URL_BASE + flask.url_for('bpSetup.error', payout_account_id=payout_account_id)

    return (url_success, url_error)

#------------------------------------------------------
# Create an account link to stripe.
#------------------------------------------------------
def createAccountLink(account_id, url_success, url_error) -> stripe.AccountLink:
    return stripe.AccountLink.create(
        account     = account_id,
        refresh_url = url_error,
        return_url  = url_success,
        type        = "account_onboarding",
    )

#------------------------------------------------------
# Confirm the account
#------------------------------------------------------
def confirmAccount(flask_g, payout_account_id: UUID, confirmed: bool) -> requests.Response:
    api = api_wrapper.ApiWrapperPayoutAccounts(flask_g)
    api_response = api.put(payout_account_id, confirmed)
    return api_response

#------------------------------------------------------
# Decorator that checks if the user has a payout account 
# setup already.
#
# If the lender does not have a payout account setup,
# redirect the user to the page where they begin the 
# setup process.
#------------------------------------------------------
def payout_account_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):

        # if user is not logged in, redirect to login page
        if not isUserConfirmed(flask.g):
            url = f"{URL_BASE}{flask.url_for('bpSetup.start')}"
            return flask.redirect(url, 302)

        return f(*args, **kwargs)

    return wrap



#------------------------------------------------------
# Checks if a user's account is already confirmed
#------------------------------------------------------
def isUserConfirmed(flask_g) -> bool:
    api = api_wrapper.ApiWrapperUsers(flask_g)
    api_response = api.get()

    if not api_response.ok:
        return True
    
    user = api_response.json()

    if not user.get('payout_account_id'):
        return False
    else:
        return True

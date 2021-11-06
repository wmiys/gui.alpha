#*******************************************************************************************
# Module:       setup pages
#
# Url Prefix:   /setup
#
# Description:  Setup various services on the platform
#*******************************************************************************************
import uuid
from http import HTTPStatus
import flask

from ..common import security
from ..payments import payout_accounts

# module blueprint
bpSetup = flask.Blueprint('bpSetup', __name__)



#------------------------------------------------------
# Create a new product checkout stripe page
#------------------------------------------------------
@bpSetup.get('lender')
@security.login_required
def createLenderAccount():
    # get a new payout account from the api
    api_response = payout_accounts.getNewPayoutAccountResponse(flask.g)

    if not api_response.ok:
        return (api_response.text, api_response.status_code)
    else:
        payout_account: dict = api_response.json()

    # generate the success/error urls for the account link
    url_success, url_error = payout_accounts.getAccountLinkUrls(payout_account)

    # create a stripe account link object
    account_link = payout_accounts.createAccountLink(
        account_id = payout_account.get('account_id'),
        url_success = url_success,
        url_error = url_error
    )

    # redirect the user to the stripe onboarding pages
    return flask.redirect(account_link.url, code=HTTPStatus.SEE_OTHER.value)


#------------------------------------------------------
# Successful stripe onboarding process
#------------------------------------------------------
@bpSetup.get('lender/confirm/<uuid:payout_account_id>')
@security.login_required
def confirm(payout_account_id: uuid.UUID):
    return str(payout_account_id)


#------------------------------------------------------
# Error with the stripe onboarding process
#------------------------------------------------------
@bpSetup.get('lender/error/<uuid:payout_account_id>')
@security.login_required
def error(payout_account_id: uuid.UUID):
    return str(payout_account_id)

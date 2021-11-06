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
# Information about creating a stripe account
#------------------------------------------------------
@bpSetup.get('payout-account')
@security.login_required
def start():
    # if the user already has an account setup go to their products page
    if payout_accounts.isUserConfirmed(flask.g):  
        return flask.redirect(flask.url_for('products.overviewGet'), code=HTTPStatus.SEE_OTHER.value)
    else:
        return flask.render_template('pages/setup/payout-account/info.html')

#------------------------------------------------------
# Create a new product checkout stripe page
#------------------------------------------------------
@bpSetup.get('payout-account/start')
@security.login_required
def createLenderAccount():
    # make sure the client came from only /setup/payout-account
    if not flask.request.referrer:
        return flask.redirect(flask.url_for('.start'), code=HTTPStatus.SEE_OTHER.value)

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
@bpSetup.get('payout-account/confirm/<uuid:payout_account_id>')
@security.login_required
def confirm(payout_account_id: uuid.UUID):
    api_response = payout_accounts.confirmAccount(flask.g, payout_account_id, True)

    if api_response.ok:
        return flask.redirect(flask.url_for('products.overviewGet'), code=HTTPStatus.SEE_OTHER.value)

    return flask.jsonify(api_response.json())

#------------------------------------------------------
# Error with the stripe onboarding process
#------------------------------------------------------
@bpSetup.get('payout-account/error/<uuid:payout_account_id>')
@security.login_required
def error(payout_account_id: uuid.UUID):
    return flask.redirect(flask.url_for('.start'), code=HTTPStatus.SEE_OTHER.value)

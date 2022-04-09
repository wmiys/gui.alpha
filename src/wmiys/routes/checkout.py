#*******************************************************************************************
# Module:       product_listings
#
# Url Prefix:   /checkout
#
# Description:  Handles the routing for the a product listing page (visiting a product page as a renter)
#*******************************************************************************************
import flask
import stripe
import uuid
from http import HTTPStatus
from wmiys_common import keys
from ..common import security
from ..payments import payments
from .. import api_wrapper


# module blueprint
bpCreateCheckoutSession = flask.Blueprint('bpCreateCheckoutSession', __name__)

stripe.api_key = keys.payments.test

#------------------------------------------------------
# Create a new product checkout stripe page
#------------------------------------------------------
@bpCreateCheckoutSession.post('<int:product_id>')
@security.login_required
def createCheckout(product_id: int):    
    # create new payment request to save the price data for later
    api_payment_response = payments.createPaymentApiRequest(product_id)

    if not api_payment_response.ok:
        return (api_payment_response.text, 400)

    payment = api_payment_response.json() 

    # Now generate all the data we need for the stripe checkout session
    session = payments.getStripeCheckoutSession(payment)

    # try to add allow access from anywhere
    response: flask.Response = flask.redirect(session.url, code=303)
    response.headers['Access-Control-Allow-Origin'] = '*'

    return response


#------------------------------------------------------
# Renter has successfully authorized the charge on their account.
# Now, we need to inform the lender that someone wants to use one of their products.
# We do this by creating a new product request.
#------------------------------------------------------
@bpCreateCheckoutSession.get('success/<uuid:payment_id>')
@security.login_required
def successfulRenterPayment(payment_id: uuid.UUID):
    payment_id = str(payment_id)
    session_id = flask.request.args.get('session_id') or None

    if not session_id:
        return ('Missing session_id request url parm.', HTTPStatus.BAD_REQUEST.value)

    
    # create a new product request for the lender
    api = api_wrapper.ApiWrapperRequests(flask.g)
    api_response = api.post(payment_id, session_id)

    # redirect the user to the success page
    if api_response.ok:
        return flask.redirect(flask.url_for('bpCreateCheckoutSession.successPage'))
    else:
        # error inserting the product request
        return (api_response.text, api_response.status_code)

    
#------------------------------------------------------
# Show a success page after the product request was send to the lender
#------------------------------------------------------
@bpCreateCheckoutSession.get('request-sent')
@security.login_required
def successPage():
    return flask.render_template('pages/product-listings/successful-product-request.html')
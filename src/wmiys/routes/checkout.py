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
from ..common import security
from .. import payments


# module blueprint
bpCreateCheckoutSession = flask.Blueprint('bpCreateCheckoutSession', __name__)

stripe.api_key = payments.keys.test

#------------------------------------------------------
# Create a new product checkout stripe page
#------------------------------------------------------
@bpCreateCheckoutSession.route('<int:product_id>', methods=['POST'])
@security.login_required
def createCheckout(product_id: int):    
    # create new payment request to save the price data for later
    apiPaymentResponse = payments.createPaymentApiRequest(product_id)
    if not apiPaymentResponse.ok:
        return ('', 400)

    # create a new stripe checkout session
    payment = apiPaymentResponse.json() 
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
@bpCreateCheckoutSession.route('success/<uuid:payment_id>', methods=['GET'])
@security.login_required
def successfulRenterPayment(payment_id: uuid.UUID):
    payment_id = str(payment_id)
    session_id = flask.request.args.get('session_id') or None

    if not session_id:
        return ('Missing session_id request url parm.', 400)

    
    # create a new product request for the lender

    
    return flask.jsonify(dict(payment_id=payment_id, session_id=session_id))
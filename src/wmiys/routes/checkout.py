#*******************************************************************************************
# Module:       product_listings
#
# Url Prefix:   /create-checkout-session
#
# Description:  Handles the routing for the a product listing page (visiting a product page as a renter)
#*******************************************************************************************


import flask
import stripe
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


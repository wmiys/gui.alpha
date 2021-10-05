#*******************************************************************************************
# Module:       product_listings
#
# Url Prefix:   /create-checkout-session
#
# Description:  Handles the routing for the a product listing page (visiting a product page as a renter)
#*******************************************************************************************


import flask
from ..common import security, stripe_keys
import stripe

# module blueprint
bpCreateCheckoutSession = flask.Blueprint('bpCreateCheckoutSession', __name__)

stripe.api_key = stripe_keys.test

#------------------------------------------------------
# Create a new product checkout stripe page
#------------------------------------------------------
@bpCreateCheckoutSession.route('<int:product_id>', methods=['POST'])
@security.login_required
def createCheckout(product_id: int):


    request_form = dict(flask.request.form.to_dict())
    location_id = request_form.get('location')
    starts_on = request_form.get('hidden-starts-on')
    ends_on = request_form.get('hidden-ends-on')

    product_api_response = security.apiWrapper.getProductListing(product_id)
    product = dict(product_api_response.json())
    name = product.get('meta').get('name')
    price = int(round(product.get('price').get('full') * 100))


    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': name,
                },
                'unit_amount': price,
            },
        'quantity': 1,
        }],
        mode='payment',
        success_url='https://example.com/success?session_id={CHECKOUT_SESSION_ID}',
        cancel_url='https://example.com/cancel?session_id={CHECKOUT_SESSION_ID}',
        billing_address_collection='auto',
        shipping_address_collection={
            'allowed_countries': ['US'],
        },
    )


    response: flask.Response = flask.redirect(session.url, code=303)
    response.headers['Access-Control-Allow-Origin'] = '*'

    return response


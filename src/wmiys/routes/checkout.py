#*******************************************************************************************
# Module:       product_listings
#
# Url Prefix:   /create-checkout-session
#
# Description:  Handles the routing for the a product listing page (visiting a product page as a renter)
#*******************************************************************************************


import flask
from werkzeug import utils
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

    # get all the form data
    request_form = dict(flask.request.form.to_dict())
    location_id = request_form.get('location')
    starts_on = request_form.get('hidden-starts-on')
    ends_on = request_form.get('hidden-ends-on')

    # create a new payment request record in the api
    apiPaymentResponse = security.apiWrapper.insertPayment(product_id, location_id, starts_on, ends_on)
    if not apiPaymentResponse.ok:
        return ('', 400)

    # create the url template with the payment record id for the stripe success/cancel url values
    url_template = 'https://example.com/{}/{{}}?session_id={{{{CHECKOUT_SESSION_ID}}}}'.format(apiPaymentResponse.text)

    # get all the product meta data
    product_api_response = security.apiWrapper.getProductListing(product_id)
    product = dict(product_api_response.json())
    name = product.get('meta').get('name')
    price = int(round(product.get('price').get('full') * 100))


    # redirect the user to the stripe checkout page
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
        success_url = url_template.format('success'),
        cancel_url = url_template.format('cancel'),
        billing_address_collection='auto',
        shipping_address_collection={
            'allowed_countries': ['US'],
        },
    )


    response: flask.Response = flask.redirect(session.url, code=303)
    response.headers['Access-Control-Allow-Origin'] = '*'

    return response


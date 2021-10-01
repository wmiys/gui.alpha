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


    requestForm: dict = flask.request.form.to_dict()

    data = dict(dates=requestForm.get('dates'), location_id=requestForm.get('location'), product_id=product_id)

    print("\n"*10)
    print(flask.json.dumps(data, indent=4))
    print("\n"*10)


    apiResponse = security.apiWrapper.getProductListing(product_id)

    productMeta: dict = dict(apiResponse.json()).get('meta')

    product = dict(apiResponse.json())

    name = product.get('meta').get('name')
    price = int(round(product.get('price').get('full') * 100))



    # print("\n"*10)
    # print(flask.json.dumps(productMeta, indent=4))
    # print("\n"*10)


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
        success_url='https://example.com/success',
        cancel_url='https://example.com/cancel',
        billing_address_collection='auto',
        shipping_address_collection={
            'allowed_countries': ['US', 'CA'],
        },
    )


    response: flask.Response = flask.redirect(session.url, code=303)
    response.headers['Access-Control-Allow-Origin'] = '*'

    return response


    # return flask.redirect(session.url, code=303)
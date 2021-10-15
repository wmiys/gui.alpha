import flask
import requests
import stripe
from ..common import security


#------------------------------------------------------
# Create a new payment request record in the api
#------------------------------------------------------
def createPaymentApiRequest(product_id: int) -> requests.Response:
    # get all the form data
    request_form = dict(flask.request.form.to_dict())
    location_id = request_form.get('location')
    starts_on = request_form.get('hidden-starts-on')
    ends_on = request_form.get('hidden-ends-on')

    # create a new payment request record in the api
    apiPaymentResponse = security.apiWrapper.insertPayment(product_id, location_id, starts_on, ends_on)
    
    return apiPaymentResponse


#------------------------------------------------------
# Create a new stripe checkout session
#------------------------------------------------------
def getStripeCheckoutSession(payment_api_response) -> stripe.checkout.Session:
    product_name = payment_api_response.get('product_name')
    success_url = _getStripeCheckoutSessionUrls(payment_api_response)
    cancel_url = str(flask.request.referrer)    # previous product search url
    total_price, renter_fee = _getStripeCheckoutSessionPrices(payment_api_response)

    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[
            _getStripeCheckoutSessionLineItems(product_name, total_price),
            _getStripeCheckoutSessionLineItems('Service fee', renter_fee),
        ],
        mode='payment',
        success_url = success_url,
        cancel_url = cancel_url,
        billing_address_collection='auto',
        shipping_address_collection={
            'allowed_countries': ['US'],
        },
        payment_intent_data={
            'capture_method': 'manual',
        },
    )

    return session


#------------------------------------------------------
# Generate the success/cancel urls for the stripe session
#------------------------------------------------------
def _getStripeCheckoutSessionUrls(payment_api_response: dict) -> tuple:
    url = 'http://10.0.0.82:8000/checkout/success/{}?session_id={{CHECKOUT_SESSION_ID}}'.format(payment_api_response.get('id'))
    return url

#------------------------------------------------------
# Create a new stripe checkout session
#------------------------------------------------------
def _getStripeCheckoutSessionPrices(payment_api_response: dict) -> tuple:
    total_price = round(payment_api_response.get('total_price') * 100)
    renter_fee = round(payment_api_response.get('total_renter_fee') * 100)

    return (total_price, renter_fee)


#------------------------------------------------------
# Generate a stripe line item dict to add to the request.
#------------------------------------------------------
def _getStripeCheckoutSessionLineItems(name: str, price) -> dict: 
    result = {
        'price_data': {
            'currency': 'usd',
            'product_data': dict(name=name),
            'unit_amount': price,
        },
        'quantity': 1,
    }

    return result


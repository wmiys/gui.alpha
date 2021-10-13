#*******************************************************************************************
# Module:       products
#
# Url Prefix:   /products
#
# Description:  Handles pages dealing with lender products
#*******************************************************************************************
from __future__ import annotations
import flask
from datetime import datetime
from http import HTTPStatus
from ..common import security, constants

# module blueprint
bpProducts = flask.Blueprint('products', __name__)

#------------------------------------------------------
# Inventory page
#------------------------------------------------------
@bpProducts.route('', methods=['GET'])
@security.login_required
def productsGet():
    apiResponse = security.apiWrapper.getUserProducts()

    if apiResponse.status_code != HTTPStatus.OK.value:
        pass    # error

    products: list[dict] = apiResponse.json()

    # format the product images
    for product in products:
        product.setdefault('image', '/static/img/placeholder.jpg')

    return flask.render_template('pages/products/inventory.html', products=products)


#------------------------------------------------------
# All received product requests (as a lender)
#------------------------------------------------------
@bpProducts.route('requests', methods=['GET'])
@security.login_required
def requestsGet():
    apiResponse = security.apiWrapper.getProductRequestsReceived()
    
    requests = apiResponse.json()

    print(requests)
    
    date_format_token = '%m/%d/%y'
    
    for request in requests:
        # format the dates
        for key in ['ends_on', 'starts_on', 'expires_on']:
            request[key] = datetime.fromisoformat(request[key]).strftime(date_format_token)

        # create the status badge classes
        # assume it's declined or expired
        badge = 'danger'

        if request.get('status') == 'pending':
            badge = 'light'
        elif request.get('status') == 'accepted':
            badge = 'success'
            
        request['status_badge_class'] = badge

    return flask.render_template('pages/products/requests.html', data=requests)


#------------------------------------------------------
# Create new product
#------------------------------------------------------
@bpProducts.route('new')
@security.login_required
def productsNew():
    # create an empty product
    apiResponse = security.apiWrapper.postUserProduct(None, None)

    if apiResponse.status_code != 200:
        pass    # error

    # get the id from the response
    emptyProduct = apiResponse.json()

    # load the edit product page
    return flask.redirect(flask.url_for('products.productPageEdit', product_id=emptyProduct['id']))

#------------------------------------------------------
# Single product page
#------------------------------------------------------
@bpProducts.route('<int:product_id>', methods=['GET', 'DELETE'])
@security.login_required
def productPageEdit(product_id):
    apiResponse = security.apiWrapper.getUserProduct(product_id)

    if apiResponse.status_code != 200:
        pass    # error

    product = apiResponse.json()

    return flask.render_template('pages/products/product/overview.html', product=product)


#------------------------------------------------------
# Product availability
#------------------------------------------------------
@bpProducts.route('<int:product_id>/availability')
@security.login_required
def productPageAvailability(product_id):
    apiResponse = security.apiWrapper.getProductAvailabilities(product_id)
    
    if apiResponse.status_code != 200:
        pass    # error

    availabilities = apiResponse.json()

    productResponse = security.apiWrapper.getUserProduct(product_id).json()

    if productResponse['image']:
        productResponse['image'] = '{}/{}'.format(constants.PRODUCT_IMAGES_PATH, productResponse['image'])

    # format the dates
    for row in availabilities:
        formatToken = '%m/%d/%Y'
        keys = ['created_on', 'ends_on', 'starts_on']

        for key in keys:
            row[key] = datetime.fromisoformat(row[key]).strftime(formatToken)

    return flask.render_template('pages/products/product/availability.html', product=productResponse, availabilities=availabilities)
    
#------------------------------------------------------
# Product insights
#------------------------------------------------------
@bpProducts.route('<int:product_id>/insights')
@security.login_required
def productPageInsights(product_id):
    apiResponse = security.apiWrapper.getUserProduct(product_id)

    if apiResponse.status_code != 200:
        pass    # error

    product = apiResponse.json()

    if product['image']:
        product['image'] = '{}/{}'.format(constants.PRODUCT_IMAGES_PATH, product['image'])

    return flask.render_template('pages/products/product/insights.html', product=product)

#------------------------------------------------------
# Product settings
#------------------------------------------------------
@bpProducts.route('<int:product_id>/settings')
@security.login_required
def productPageSettings(product_id):
    apiResponse = security.apiWrapper.getUserProduct(product_id)

    if apiResponse.status_code != 200:
        pass    # error

    product = apiResponse.json()

    if product['image']:
        product['image'] = '{}/{}'.format(constants.PRODUCT_IMAGES_PATH, product['image'])

    return flask.render_template('pages/products/product/settings.html', product=product)

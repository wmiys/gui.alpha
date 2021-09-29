#*******************************************************************************************
# Module:       products
#
# Url Prefix:   /products
#
# Description:  Handles pages dealing with lender products
#*******************************************************************************************

import flask
from datetime import datetime
from ..common import security, constants

bpProducts = flask.Blueprint('products', __name__)

@bpProducts.route('', methods=['GET'])
@security.login_required
def productsGet():
    apiResponse = security.apiWrapper.getUserProducts()

    if apiResponse.status_code != 200:
        pass    # error

    products = apiResponse.json()

    # format the product images
    for product in products:
        if not product['image']:
            product['image'] = '/static/img/placeholder.jpg'

    return flask.render_template('pages/products/products.html', products=products)


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

@bpProducts.route('<int:product_id>', methods=['GET', 'DELETE'])
@security.login_required
def productPageEdit(product_id):
    apiResponse = security.apiWrapper.getUserProduct(product_id)

    if apiResponse.status_code != 200:
        pass    # error

    product = apiResponse.json()

    return flask.render_template('pages/products/overview.html', product=product)


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

    return flask.render_template('pages/products/availability.html', product=productResponse, availabilities=availabilities)
    
@bpProducts.route('<int:product_id>/insights')
@security.login_required
def productPageInsights(product_id):
    apiResponse = security.apiWrapper.getUserProduct(product_id)

    if apiResponse.status_code != 200:
        pass    # error

    product = apiResponse.json()

    if product['image']:
        product['image'] = '{}/{}'.format(constants.PRODUCT_IMAGES_PATH, product['image'])

    return flask.render_template('pages/products/insights.html', product=product)

@bpProducts.route('<int:product_id>/settings')
@security.login_required
def productPageSettings(product_id):
    apiResponse = security.apiWrapper.getUserProduct(product_id)

    if apiResponse.status_code != 200:
        pass    # error

    product = apiResponse.json()

    if product['image']:
        product['image'] = '{}/{}'.format(constants.PRODUCT_IMAGES_PATH, product['image'])

    return flask.render_template('pages/products/settings.html', product=product)

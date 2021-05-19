"""
Package:        products
Url Prefix:     /products
Description:    Handles pages dealing with lender products
"""

import flask
from flask import Blueprint, jsonify, request, redirect, url_for
from wmiys.common.ApiWrapper import ApiWrapper
import wmiys.common.Security as Security
from wmiys.common.Security import apiWrapper
from wmiys.common.Constants import Constants


bpProducts = Blueprint('products', __name__)

@bpProducts.route('', methods=['GET'])
@Security.login_required
def productsGet():
    apiResponse = apiWrapper.getUserProducts()

    if apiResponse.status_code != 200:
        pass    # error

    products = apiResponse.json()

    # format the product images
    for product in products:
        if product['image'] != None:
            product['image'] = '{}/{}'.format(Constants.PRODUCT_IMAGES_PATH, product['image'])
        else:
            product['image'] = '/static/img/placeholder.jpg'

    return flask.render_template('pages/products/products.html', products=products)


@bpProducts.route('new')
@Security.login_required
def productsNew():
    # create an empty product
    apiResponse = apiWrapper.postUserProduct(None, None)

    if apiResponse.status_code != 200:
        pass    # error

    # get the id from the response
    emptyProduct = apiResponse.json()

    # load the edit product page
    return redirect(url_for('products.productPageEdit', product_id=emptyProduct['id']))

@bpProducts.route('<int:product_id>', methods=['GET', 'DELETE'])
@Security.login_required
def productPageEdit(product_id):
    apiResponse = apiWrapper.getUserProduct(product_id)

    if apiResponse.status_code != 200:
        pass    # error

    product = apiResponse.json()

    return flask.render_template('pages/products/overview.html', product=product)



@bpProducts.route('<int:product_id>/availability')
@Security.login_required
def productPageAvailability(product_id):
    apiResponse = apiWrapper.getProductAvailabilities(product_id)
    
    if apiResponse.status_code != 200:
        pass    # error

    availabilities = apiResponse.json()

    productResponse = apiWrapper.getUserProduct(product_id).json()

    if productResponse['image']:
        productResponse['image'] = '{}/{}'.format(Constants.PRODUCT_IMAGES_PATH, productResponse['image'])

    return flask.render_template('pages/products/availability.html', product=productResponse, availabilities=availabilities)
    
@bpProducts.route('<int:product_id>/insights')
@Security.login_required
def productPageInsights(product_id):
    apiResponse = apiWrapper.getUserProduct(product_id)

    if apiResponse.status_code != 200:
        pass    # error

    product = apiResponse.json()

    if product['image']:
        product['image'] = '{}/{}'.format(Constants.PRODUCT_IMAGES_PATH, product['image'])

    return flask.render_template('pages/products/insights.html', product=product)

@bpProducts.route('<int:product_id>/settings')
@Security.login_required
def productPageSettings(product_id):
    apiResponse = apiWrapper.getUserProduct(product_id)

    if apiResponse.status_code != 200:
        pass    # error

    product = apiResponse.json()

    if product['image']:
        product['image'] = '{}/{}'.format(Constants.PRODUCT_IMAGES_PATH, product['image'])

    return flask.render_template('pages/products/settings.html', product=product)

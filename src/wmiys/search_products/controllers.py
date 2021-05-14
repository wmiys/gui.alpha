"""
Package:        search_products
Url Prefix:     /search/products
Description:    Handles the routing for the product search results page
"""

import flask
from flask import Blueprint, request, redirect, url_for
import wmiys.common.Security as Security
from wmiys.common.Security import apiWrapper
from functools import wraps, update_wrapper
from wmiys.search_products.SearchProducts import SearchProducts

bpSearchProducts = Blueprint('search_products', __name__)

searchProductsHandler = None

#---------------------------------------------------------------
# Initializes the searchProductsHandler
#---------------------------------------------------------------
def load_request_parms(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        # set query parms
        global searchProductsHandler
        searchProductsHandler = SearchProducts(request, apiWrapper)

        if searchProductsHandler.areRequiredFieldsSet() == False:
            return redirect(url_for('home.pHome'))

        return f(*args, **kwargs)

    return wrap

#---------------------------------------------------------------
# Routes
#---------------------------------------------------------------
@bpSearchProducts.route('')
@Security.login_required
@load_request_parms
def pSearchResultsAll():
    productsResponse = searchProductsHandler.searchAll()
    return baseReturn(searchProductsHandler.transformSearchResults(productsResponse))

@bpSearchProducts.route('/categories/major/<int:product_categories_major_id>')
@Security.login_required
@load_request_parms
def pSearchResultsMajor(product_categories_major_id):
    productsResponse = searchProductsHandler.searchMajor(product_categories_major_id)
    return baseReturn(searchProductsHandler.transformSearchResults(productsResponse))

@bpSearchProducts.route('/categories/minor/<int:product_categories_minor_id>')
@Security.login_required
@load_request_parms
def pSearchResultsMinor(product_categories_minor_id):
    productsResponse = searchProductsHandler.searchMinor(product_categories_minor_id)
    return baseReturn(searchProductsHandler.transformSearchResults(productsResponse))


@bpSearchProducts.route('/categories/sub/<int:product_categories_sub_id>')
@Security.login_required
@load_request_parms
def pSearchResultsSub(product_categories_sub_id):
    productsResponse = searchProductsHandler.searchSub(product_categories_sub_id)
    return baseReturn(searchProductsHandler.transformSearchResults(productsResponse))


#---------------------------------------------------------------
# Utility functions
#---------------------------------------------------------------
def baseReturn(productSearchResults: dict):
    return flask.render_template('pages/search-products/results.html', data=productSearchResults)

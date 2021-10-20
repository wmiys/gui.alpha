#*******************************************************************************************
# Module:       search_products
#
# Url Prefix:   /search/products
#
# Description:  Handles the routing for the product search results page
#*******************************************************************************************

import flask
from functools import wraps
from ..common import security, SearchProducts

# module blueprint
bpSearchProducts = flask.Blueprint('search_products', __name__)

searchProductsHandler = None

###########################################
# Decorators
###########################################

#------------------------------------------------------
# Initializes the searchProductsHandler
#------------------------------------------------------
def load_request_parms(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        # set query parms
        global searchProductsHandler
        searchProductsHandler = SearchProducts(flask.request)

        if searchProductsHandler.areRequiredFieldsSet() == False:
            return flask.redirect(flask.url_for('home.pHome'))

        return f(*args, **kwargs)

    return wrap

###########################################
# Routes
###########################################

#------------------------------------------------------
# Search all products (no category filter)
#------------------------------------------------------
@bpSearchProducts.route('')
@security.login_required
@load_request_parms
def pSearchResultsAll():
    productsResponse = searchProductsHandler.searchAll()
    return baseReturn(searchProductsHandler.transformSearchResults(productsResponse))

#------------------------------------------------------
# Search all products of a major category
#------------------------------------------------------
@bpSearchProducts.route('/categories/major/<int:product_categories_major_id>')
@security.login_required
@load_request_parms
def pSearchResultsMajor(product_categories_major_id):
    productsResponse = searchProductsHandler.searchMajor(product_categories_major_id)
    return baseReturn(searchProductsHandler.transformSearchResults(productsResponse))


#------------------------------------------------------
# Search all products of a minor category
#------------------------------------------------------
@bpSearchProducts.route('/categories/minor/<int:product_categories_minor_id>')
@security.login_required
@load_request_parms
def pSearchResultsMinor(product_categories_minor_id):
    productsResponse = searchProductsHandler.searchMinor(product_categories_minor_id)
    return baseReturn(searchProductsHandler.transformSearchResults(productsResponse))


#------------------------------------------------------
# Search all products of a sub category
#------------------------------------------------------
@bpSearchProducts.route('/categories/sub/<int:product_categories_sub_id>')
@security.login_required
@load_request_parms
def pSearchResultsSub(product_categories_sub_id):
    productsResponse = searchProductsHandler.searchSub(product_categories_sub_id)
    return baseReturn(searchProductsHandler.transformSearchResults(productsResponse))


###########################################
# Utility functions
###########################################
def baseReturn(productSearchResults: dict):
    return flask.render_template('pages/search-products/results.html', data=productSearchResults)

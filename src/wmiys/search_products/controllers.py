"""
Package:        search_products
Url Prefix:     /search/products
Description:    Handles the routing for the product search results page
"""

import flask
from flask import Blueprint, jsonify, request, redirect, url_for
from werkzeug.datastructures import ImmutableMultiDict
import wmiys.common.Security as Security
from wmiys.common.Security import apiWrapper
from wmiys.common.ApiWrapper import ApiWrapper
from wmiys.common.Constants import Constants
from wmiys.common.Pagination import Pagination
from functools import wraps, update_wrapper
from collections import namedtuple

bpSearchProducts = Blueprint('search_products', __name__)

QueryParms = namedtuple('QueryParms', 'location_id starts_on ends_on sort')
queryParms = None

DEFAULT_PER_PAGE = 20

def load_request_parms(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        location_id = request.args.get('location_id') or None
        starts_on   = request.args.get('starts_on') or None
        ends_on     = request.args.get('ends_on') or None
        sort        = request.args.get('sort') or None

        # make sure all of the required request parms are present
        if None in [location_id, starts_on, ends_on]:
            return redirect(url_for('home.pHome'))

        # set query parms
        global queryParms
        queryParms = QueryParms(location_id=location_id, starts_on=starts_on, ends_on=ends_on, sort=sort)

        return f(*args, **kwargs)

    return wrap


def generateImageData(rawProductJson):
    productsData = rawProductJson
    
    # format the product images
    for product in productsData:
        if product['image'] != None:
            product['image'] = '{}/{}'.format(Constants.PRODUCT_IMAGES_PATH, product['image'])
        else:
            product['image'] = '/static/img/placeholder.jpg'
    
    return productsData


def baseReturn(productsApiResponse):
    if productsApiResponse.status_code != 200:
        pass
        
    categories = ApiWrapper.getProductCategories(True)

    # split the response into the results and pagination sections
    responseData = productsApiResponse.json()    
    productsData = generateImageData(responseData['results'])
    pagination = Pagination(request, int(responseData['pagination']['total_pages']))

    # merge all the outgoing data into 1 dict
    outData = dict(products=productsData, productCategories=categories.json(), urlParms=request.args.to_dict(), pagination=pagination.getAllPaginationLinks(), total_records=int(responseData['pagination']['total_records']))
    
    return flask.render_template('pages/search-products/results.html', data=outData)

#---------------------------------------------------------------
# Routes
#---------------------------------------------------------------
@bpSearchProducts.route('')
@Security.login_required
@load_request_parms
def pSearchResultsAll():
    page = request.args.get('page') or 1
    productsResponse = apiWrapper.searchProductsAll(queryParms.location_id, queryParms.starts_on, queryParms.ends_on, queryParms.sort, DEFAULT_PER_PAGE, page)

    # return jsonify(productsResponse.json())

    return baseReturn(productsResponse)

@bpSearchProducts.route('/categories/major/<int:product_categories_major_id>')
@Security.login_required
@load_request_parms
def pSearchResultsMajor(product_categories_major_id):
    page = request.args.get('page') or 1
    productsResponse = apiWrapper.searchProductsCategoryMajor(queryParms.location_id, queryParms.starts_on, queryParms.ends_on, product_categories_major_id, queryParms.sort, DEFAULT_PER_PAGE, page)
    return baseReturn(productsResponse)

@bpSearchProducts.route('/categories/minor/<int:product_categories_minor_id>')
@Security.login_required
@load_request_parms
def pSearchResultsMinor(product_categories_minor_id):
    page = request.args.get('page') or 1
    productsResponse = apiWrapper.searchProductsCategoryMinor(queryParms.location_id, queryParms.starts_on, queryParms.ends_on, product_categories_minor_id, queryParms.sort, DEFAULT_PER_PAGE, page)
    return baseReturn(productsResponse)


@bpSearchProducts.route('/categories/sub/<int:product_categories_sub_id>')
@Security.login_required
@load_request_parms
def pSearchResultsSub(product_categories_sub_id):
    page = request.args.get('page') or 1
    productsResponse = apiWrapper.searchProductsCategorySub(queryParms.location_id, queryParms.starts_on, queryParms.ends_on, product_categories_sub_id, queryParms.sort, DEFAULT_PER_PAGE, page)
    return baseReturn(productsResponse)

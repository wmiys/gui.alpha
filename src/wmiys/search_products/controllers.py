"""
Package:        search_products
Url Prefix:     /search/products
Description:    Handles the routing for the product search results page
"""

import flask
from flask import Blueprint, jsonify, request
import wmiys.common.Security as Security
from wmiys.common.Security import apiWrapper
from wmiys.common.ApiWrapper import ApiWrapper

bpSearchProducts = Blueprint('search_products', __name__)

@bpSearchProducts.route('', defaults={'path': ''})
@bpSearchProducts.route('/<path:path>')
@Security.login_required
def pSearchResults(path):
    categories = ApiWrapper.getProductCategories(True)

    print(request.args.to_dict())

    return flask.render_template('pages/search-products/results.html', productCategories=categories.json(), urlParms=request.args.to_dict())


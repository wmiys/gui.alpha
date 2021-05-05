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

@bpSearchProducts.route('')
@Security.login_required
def pSearchResults():
    categories = ApiWrapper.getProductCategories(True)

    return flask.render_template('pages/search-products/results.html', productCategories=categories.json())

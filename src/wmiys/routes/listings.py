"""
Package:        product_listings
Url Prefix:     /search/products
Description:    Handles the routing for the a product listing page
"""

import flask
from flask import Blueprint, request, redirect, url_for
import wmiys.common.Security as Security
from wmiys.common.Security import apiWrapper
from functools import wraps, update_wrapper
# from wmiys.search_products.SearchProducts import SearchProducts


bpProductListings = Blueprint('bpProductListings', __name__)


@bpProductListings.route('<int:product_id>')
@Security.login_required
def productListingRoute(product_id: int):
    productListingApiResponse = apiWrapper.getProductListing(product_id)
    productImagesResponse = apiWrapper.getProductImages(product_id)

    outDataDict = productListingApiResponse.json()
    outDataDict['images'] = productImagesResponse.json()


    # return flask.jsonify(outDataDict)
    return flask.render_template('pages/product-listings/product-listing.html', data=outDataDict)
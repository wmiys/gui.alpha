"""
Package:        product_listings
Url Prefix:     /search/products
Description:    Handles the routing for the a product listing page
"""

import flask
from functools import wraps, update_wrapper
from ..common import security

bpProductListings = flask.Blueprint('bpProductListings', __name__)


@bpProductListings.route('<int:product_id>')
@security.login_required
def productListingRoute(product_id: int):
    productListingApiResponse = security.apiWrapper.getProductListing(product_id)
    productImagesResponse = security.apiWrapper.getProductImages(product_id)

    outDataDict = productListingApiResponse.json()
    outDataDict['images'] = productImagesResponse.json()


    # return flask.jsonify(outDataDict)
    return flask.render_template('pages/product-listings/product-listing.html', data=outDataDict)
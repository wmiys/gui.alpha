#*******************************************************************************************
# Module:       product_listings
#
# Url Prefix:   /listings
#
# Description:  Handles the routing for the a product listing page (visiting a product page as a renter)
#*******************************************************************************************

import flask
from ..common import security, api_wrapper2

# module blueprint
bpProductListings = flask.Blueprint('bpProductListings', __name__)

#------------------------------------------------------
# Product listing page
#------------------------------------------------------
@bpProductListings.route('<int:product_id>')
@security.login_required
def productListingRoute(product_id: int):    
    # get the listing data
    api_wrapper = api_wrapper2.ApiWrapperListing(flask.g)
    listing = api_wrapper.get(product_id)
    outDataDict: dict = listing.json()
    
    # get the product images
    api_wrapper = api_wrapper2.ApiWrapperProductImages(flask.g)
    images = api_wrapper.get(product_id)

    # print(flask.json.dumps(images.json(), indent=4))
    print(images.text)

    outDataDict.setdefault('images', images.json())

    return flask.render_template('pages/product-listings/product-listing.html', data=outDataDict)
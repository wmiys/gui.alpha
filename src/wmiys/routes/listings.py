#*******************************************************************************************
# Module:       product_listings
#
# Url Prefix:   /listings
#
# Description:  Handles the routing for the a product listing page (visiting a product page as a renter)
#*******************************************************************************************

import flask
from wmiys.common import security
from wmiys.api_wrapper import ApiWrapperProductImages, ApiWrapperListing

# module blueprint
bpProductListings = flask.Blueprint('bpProductListings', __name__)

#------------------------------------------------------
# Product listing page
#------------------------------------------------------
@bpProductListings.route('<int:product_id>')
@security.login_required
def productListingRoute(product_id: int):    
    # get the listing data
    api = ApiWrapperListing(flask.g)
    listing = api.get(product_id)
    outDataDict: dict = listing.json()
    
    # get the product images
    api = ApiWrapperProductImages(flask.g)
    images = api.get(product_id)    

    outDataDict.setdefault('images', images.json())

    return flask.render_template('pages/product-listings/product-listing.html', data=outDataDict)
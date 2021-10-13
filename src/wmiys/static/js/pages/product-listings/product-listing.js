

const mProductID = UrlParser.getPathValue(1);   // the product id found in the url: /products/42
const mProductListingForm = new ProductListingForm(mProductID);


/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    mProductListingForm.init();
    // mProductListingForm.isProductAvailable();

});


function isProductAvailabile() {
    // mProductListingForm.isProductAvailable();
}




const mProductID = UrlParser.getPathValue(1);   // the product id found in the url: /products/42
const mProductListingForm = new ProductListingForm(mProductID);

const eDescriptionShowMoreBtn = $('.product-listing-description-show-more-btn');
const eDescriptionText = $('.product-listing-description-data');


/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    mProductListingForm.init();

    // mProductListingForm.showSpinnerForCheckButton();

    addListeners();
});


/**********************************************************
Register all the event listeners
**********************************************************/
function addListeners() {
    
    $(eDescriptionShowMoreBtn).on('click', function() {
        toggleFullDescription();
    });


    $(document).on('myCustomEvent', function() {
        console.log('hey');
    });
}

/**********************************************************
Show/hide the full product description
**********************************************************/
function toggleFullDescription() {
    $(eDescriptionText).toggleClass('less');
    $(eDescriptionShowMoreBtn).toggleClass('d-none');
}



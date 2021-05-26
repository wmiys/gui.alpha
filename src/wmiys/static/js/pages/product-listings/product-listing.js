


const mProductListingForm = new ProductListingForm();



/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {

    mProductListingForm.setInputValuesFromUrl();

});




function shit() {
    console.log(mProductListingForm.getDatesValues());
    console.log(mProductListingForm.getLocationValue());
}

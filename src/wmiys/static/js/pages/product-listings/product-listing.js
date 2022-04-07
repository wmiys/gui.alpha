import { AlertTop }        from "../../classes/AlertTop";
import { ALERT_TOP_TYPES } from "../../classes/AlertTop";
import { ApiWrapper }      from "../../classes/API-Wrapper";
import { CommonHtml }      from "../../classes/Common-Html";
import { CountUp }         from "../../classes/CountUp";
import { Dropdown }        from "../../classes/Dropdown";
import { FlatpickrRange }  from "../../classes/FlatpickrRange";
import { DateTime }        from "../../classes/GlobalConstants";
import { LocalStorage }    from "../../classes/LocalStorage";
import { LocationsSelect } from "../../classes/LocationsSelect";
import { ProductLender }   from "../../classes/ProductLender";
import { SpinnerButton }   from "../../classes/SpinnerButton";
import { UrlParser }       from "../../classes/UrlParser";
import { Utilities }       from "../../classes/Utilities";
import { API_BASE_URL }    from "../api-base-url";
import { API_URL_PREFIX }  from "../api-base-url";

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



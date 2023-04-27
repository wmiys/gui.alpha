

import { RequestsSubmittedModal } from "./requests-submitted-modal";
import { ApiWrapper } from "../../../classes/API-Wrapper";
import { Utilities } from "../../../classes/Utilities";
import { ProductRequestSubmittedView } from "../../../views/product-request-submitted";
import { DateTime } from "../../../classes/GlobalConstants";


export class RequestRenderer
{
    /**
     * Constructor
     * @param {string} requestID - the product request id
     */
    constructor(requestID) {
        /** @type {string} */
        this.requestID = requestID;
        
        /** @type {ProductRequestSubmittedView} */
        this.data = null;
    }


    /** 
     * Render the request info on the modal 
     */
    render = async () => {
        RequestsSubmittedModal.setDisplayToLoading();
        RequestsSubmittedModal.show();

        const fetchWasSuccessful = await this.fetchRequestData();
        if (!fetchWasSuccessful) {
            console.error('Could not successfully fetch the request data from the API!');
            return;
        }

        // now display the data on the modal
        this.displayDataItems();
        RequestsSubmittedModal.setDisplayToNormal();
    }


    /**
     * Fetch the request data from the api 
     * @returns {bool} if the fetch was successful or not
     */
    fetchRequestData = async () => {
        const apiResponse = await ApiWrapper.requestGetProductRequestSubmitted(this.requestID);
        
        if (!apiResponse.ok) {
            console.error(await apiResponse.text());
            return false;
        }

        try {
            const rawData = await apiResponse.json();
            this.data = new ProductRequestSubmittedView(rawData);
        }
        catch (exception) {
            console.error(exception);
            return false;
        }

        return true;
    }

    /**
     * Display all the metadata items
     */
    displayDataItems = () => {
        RequestsSubmittedModal.setMetaItemValue(RequestsSubmittedModal.Elements.META_ITEMS.PRODUCT, this.data.product_name);
        RequestsSubmittedModal.setMetaItemValue(RequestsSubmittedModal.Elements.META_ITEMS.STATUS, this.data.status);

        // location
        const locationDisplayText = `${this.data.location_city}, ${this.data.location_state_id}`;
        RequestsSubmittedModal.setMetaItemValue(RequestsSubmittedModal.Elements.META_ITEMS.LOCATION, locationDisplayText);

        // price
        const priceDisplayText = Utilities.toCurrencyFormat(this.data.price_total);
        RequestsSubmittedModal.setMetaItemValue(RequestsSubmittedModal.Elements.META_ITEMS.PRICE, priceDisplayText);

        // dates
        const startsOnText = Utilities.formatDatetime(this.data.starts_on, DateTime.DATE_SHORT);
        RequestsSubmittedModal.setMetaItemValue(RequestsSubmittedModal.Elements.META_ITEMS.STARTS, startsOnText);

        const endsOnText = Utilities.formatDatetime(this.data.ends_on, DateTime.DATE_SHORT);
        RequestsSubmittedModal.setMetaItemValue(RequestsSubmittedModal.Elements.META_ITEMS.ENDS, endsOnText);

        // review
        RequestsSubmittedModal.initReviewScore(this.data.review_score);
        RequestsSubmittedModal.setReviewComment(this.data.review_comment);
    }
}


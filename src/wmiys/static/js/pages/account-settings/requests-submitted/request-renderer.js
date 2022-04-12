

import { RequestsSubmittedModal } from "./requests-submitted-modal";
import { ApiWrapper } from "../../../classes/API-Wrapper";

export class RequestRenderer
{
    /**
     * Constructor
     * @param {string} requestID - the product request id
     */
    constructor(requestID) {
        this.requestID = requestID;
        this.data = null;
        
        this.registerActionListeners();
    }

    /** 
     * Register all the action listners 
     */
    registerActionListeners = () => {

    }


    /** 
     * Render the request info on the modal 
     */
    render = async () => {
        // RequestsSubmittedModal.setDisplayToLoading();
        RequestsSubmittedModal.setDisplayToNormal();
        RequestsSubmittedModal.show();

        const fetchWasSuccessful = await this.fetchRequestData();
        if (!fetchWasSuccessful) {
            console.error('Could not successfully fetch the request data from the API!');
            return;
        }

        // now display the data on the modal
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
            this.data = await apiResponse.json();
        }
        catch (exception) {
            console.error(exception);
            return false;
        }

        return true;
    }


}


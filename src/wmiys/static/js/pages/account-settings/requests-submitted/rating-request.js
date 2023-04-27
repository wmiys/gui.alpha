
import { RequestsSubmittedModal } from "./requests-submitted-modal";
import { ProductRequestSubmittedModel } from "../../../models/product-request-submitted";
import { ApiWrapper } from "../../../classes/API-Wrapper";

export class RequestRatingInterface
{

    constructor() {

        this.requestID = RequestsSubmittedModal.getCurrentRequestID();
        this.score = RequestsSubmittedModal.getReviewScoreValue();
        this.comment = RequestsSubmittedModal.getReviewCommentValue();
    }

    save = async () => {
        const model = this.getModel();

        // console.log(model);
        
        const apiResponse = await ApiWrapper.requestPatchProductRequestSubmitted(model);
        console.log(await apiResponse.text());
    }

    /**
     * Get a model to send to the api 
     * @returns {ProductRequestSubmittedModel} the domain model
     */
    getModel = () => {
        return new ProductRequestSubmittedModel(this.requestID, this.score, this.comment);
    }




}
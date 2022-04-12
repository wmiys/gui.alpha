
import { ProductRequestSubmittedView } from "../views/product-request-submitted";
import { BaseTemplate } from "./base";

export class ProductRequestSubmittedCardTemplate extends BaseTemplate
{   
    /**
     * Construcor
     * @param {ProductRequestSubmittedView} view - the product request view 
     */
    constructor(view) {
        super();

        /** @type {ProductRequestSubmittedView} */
        this.view = view;
    }

    
    getHtml = () => {
        return 'this shit';
    }



}
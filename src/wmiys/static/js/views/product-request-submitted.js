
import { BaseView } from "./base";
import { Utilities } from "../classes/Utilities";


export class ProductRequestSubmittedView extends BaseView
{
    constructor(apiData) {
        super();
        
        this.created_on          = null;
        this.ends_on             = null;
        this.fee_renter          = null;
        this.id                  = null;
        this.location_city       = null;
        this.location_id         = null;
        this.location_state_id   = null;
        this.location_state_name = null;
        this.num_days            = null;
        this.price_full          = null;
        this.price_total         = null;
        this.product_id          = null;
        this.product_image       = null;
        this.product_name        = null;
        this.renter_id           = null;
        this.starts_on           = null;
        this.status              = null;
        this.review_comment      = null;
        this.review_score        = null;


        this._initProperties(apiData);
        this._initDates();
    }

    /** Create luxon datetime objects for the date properties */
    _initDates = () => {
        this.starts_on  = Utilities.parseDatetimeStringISO(this.starts_on);
        this.ends_on    = Utilities.parseDatetimeStringISO(this.ends_on);
        this.created_on = Utilities.parseDatetimeStringISO(this.created_on);
    }
}
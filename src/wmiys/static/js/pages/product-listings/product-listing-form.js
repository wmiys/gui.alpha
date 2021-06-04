


class ProductListingForm
{

    /**********************************************************
    Constructor
    **********************************************************/
    constructor(a_iProductID) {
        // this.productID = a_iProductID;
        LocationsSelect.init(ProductListingForm.inputs.location, 'Location', 3);
        this.datesFlatpickr = new FlatpickrRange(ProductListingForm.inputs.dates, true);
        this.setInputValuesFromUrl();

        // this.shit = 'heu';
    }

    
    /**********************************************************
    Setup the object.
    **********************************************************/
    init() {
        const self = this;
        self.setInputValuesFromUrl();
        self.addEventListeners();
    }

    
    /**********************************************************
    Register all the event listeners.
    **********************************************************/
    addEventListeners() {
        const self = this;
        
        $(ProductListingForm.inputs.location).on('select2:select', function(e) {
            self.setLocationUrlQueryParmToInputValue();
        }).bind(this);

        
        $(ProductListingForm.inputs.dates).on('change', function() {
            self.setDatesUrlQueryParmsToInputValues();
        }).bind(this);
    }

    /**********************************************************
    Sets the location_id, starts_on, and ends_on url query parms to the values in their respective inputs.
    **********************************************************/
    setUrlQueryParmsToInputValues() {
        const self = this;
        this.setDatesUrlQueryParmsToInputValues();
        this.setDatesUrlQueryParmsToInputValues();
    }

    /**********************************************************
    Sets the location_id url query parm to the values in its respective input.
    **********************************************************/
    setLocationUrlQueryParmToInputValue() {
        const self = this;

        const newLocationID = this.getLocationValue();

        if (newLocationID != null) {
            UrlParser.setQueryParmsNoReload({location_id: newLocationID});
        }
    }

    /**********************************************************
    Sets the starts_on and ends_on url query parms to the values in their respective inputs.
    **********************************************************/
    setDatesUrlQueryParmsToInputValues() {
        const self = this;
        
        // default the new values to their existing value
        const newUrlParms = {
            starts_on: UrlParser.getQueryParm(ProductListingForm.urlQueryParms.startsOn),
            ends_on: UrlParser.getQueryParm(ProductListingForm.urlQueryParms.endsOn),
        }


        const dates = this.getDatesValues();

        if (dates.endsOn != null) {
            newUrlParms.ends_on = dates.endsOn;
        }
        if (dates.startsOn != null) {
            newUrlParms.starts_on = dates.startsOn;
        }

        UrlParser.setQueryParmsNoReload(newUrlParms);
    }

    /**********************************************************
    Retrieves the values of the current URL query parms, and sets the input element values to them.

    The URL query parms are:
        - starts_on
        - ends_on
        - location_id
    **********************************************************/
    setInputValuesFromUrl() {
        const self = this;

        const startsOn = UrlParser.getQueryParm(ProductListingForm.urlQueryParms.startsOn);
        const endsOn = UrlParser.getQueryParm(ProductListingForm.urlQueryParms.endsOn);
        const locationID = UrlParser.getQueryParm(ProductListingForm.urlQueryParms.locationID);

        this.setDatesValues(startsOn, endsOn);
        ApiWrapper.requestGetLocation(locationID, self.setLocationValue);
    }

    /**********************************************************
    Sets the dates input element starts on and ends on values.
    **********************************************************/
    setDatesValues(startsOn, endsOn) {
        this.datesFlatpickr.flatpickrInstance.setDate([startsOn, endsOn], true);
    }

    /**********************************************************
    Takes in a location object and sets the location input value to City, State combo recieved.
    **********************************************************/
    setLocationValue(locationObject) {
        const self = this;

        const displayText = `${locationObject.city}, ${locationObject.state_name}`;
        const html = `<option value="${locationObject.id}" selected>${displayText}</option>`;

        $(ProductListingForm.inputs.location).html(html);
    }

    /**********************************************************
    Returns the current value of the location input.
    **********************************************************/
    getLocationValue() {
        return $(ProductListingForm.inputs.location).val();
    }


    getStartsOnValue() {
        const dates = this.getDatesValues();
        return dates.startsOn;
    }

    getEndsOnValue() {
        const dates = this.getDatesValues();
        return dates.endsOn;
    }

    /**********************************************************
    Returns the current values of the dates input as an object: startsOn and endsOn.
    **********************************************************/
    getDatesValues() {
        const dates = this.datesFlatpickr.getDateValues();
        return dates;
    }


    isProductAvailable() {
        const self = this;

        ApiWrapper.requestGetProductListingAvailability(UrlParser.getPathValue(1), this.getLocationValue(), this.getStartsOnValue(), this.getEndsOnValue(), function(response) {
            console.log(response.available);
        });
    }




}


/**********************************************************
Static constants for ProductListingForm
**********************************************************/
ProductListingForm.form = '#product-listing-form';
ProductListingForm.inputClass = '.product-listing-form-input';


ProductListingForm.inputs = {
    location: '#product-listing-form-input-location',
    dates: '#product-listing-form-input-dates',
}

ProductListingForm.urlQueryParms = {
    startsOn: 'starts_on',
    endsOn: 'ends_on',
    locationID: 'location_id',
}





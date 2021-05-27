


class ProductListingForm
{

    /**********************************************************
    Constructor
    **********************************************************/
    constructor() {
        LocationsSelect.init(ProductListingForm.inputs.location, 'Location', 3);
        this.datesFlatpickr = new FlatpickrRange(ProductListingForm.inputs.dates, true);
    }

    /**********************************************************
    Returns the current value of the location input.
    **********************************************************/
    getLocationValue() {
        return $(ProductListingForm.inputs.location).val();
    }

    /**********************************************************
    Returns the current values of the dates input as an object: startsOn and endsOn.
    **********************************************************/
    getDatesValues() {
        const dates = this.datesFlatpickr.getDateValues();
        return dates;
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





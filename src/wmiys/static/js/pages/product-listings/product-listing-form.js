


class ProductListingForm
{

    /**********************************************************
    Constructor
    **********************************************************/
    constructor() {
        LocationsSelect.init(ProductListingForm.inputs.location, 'Location', 3);
        this.datesFlatpickr = new FlatpickrRange(ProductListingForm.inputs.dates, true);
    }

    getLocationValue() {
        return $(ProductListingForm.inputs.location).val();
    }

    getDatesValues() {
        const dates = this.datesFlatpickr.getDateValues();
        return dates;
    }


    setInputValuesFromUrl() {
        const startsOn = UrlParser.getQueryParm('starts_on');
        const endsOn = UrlParser.getQueryParm('ends_on');
        const locationID = UrlParser.getQueryParm('location_id');

        this.setDatesValues(startsOn, endsOn);
    }



    setDatesValues(startsOn, endsOn) {
        this.datesFlatpickr.flatpickrInstance.setDate([startsOn, endsOn], true);
    }


}



ProductListingForm.form = '#product-listing-form';
ProductListingForm.inputClass = '.product-listing-form-input';


ProductListingForm.inputs = {
    location: '#product-listing-form-input-location',
    dates: '#product-listing-form-input-dates',
}




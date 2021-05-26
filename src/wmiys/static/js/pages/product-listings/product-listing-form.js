


class ProductListingForm
{

    /**********************************************************
    Constructor
    **********************************************************/
    constructor() {
        LocationsSelect.init(ProductListingForm.inputs.location, 'Location', 3);
        this.datesFlatpickr = new FlatpickrRange(ProductListingForm.inputs.dates, true);
    }

    run() {

    }
}



ProductListingForm.form = '#product-listing-form';
ProductListingForm.inputClass = '.product-listing-form-input';


ProductListingForm.inputs = {
    location: '#product-listing-form-input-location',
    dates: '#product-listing-form-input-dates',
}




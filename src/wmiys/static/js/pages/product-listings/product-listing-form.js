


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
    }

    /**********************************************************
    Setup the object.
    **********************************************************/
    init() {
        const self = this;
        self.setInputValuesFromUrl();
        self.addEventListeners();
        self.checkAvailability();
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


        $(ProductListingForm.inputClass).on('change', function() {
            self.checkAvailability();
        }).bind(this);

        $(ProductListingForm.buttons.check).on('click', function() {
            self.checkAvailability();
        }).bind(this);

        $(ProductListingForm.buttons.book).on('click', function() {
            self.sendProductRequest();
        }).bind(this);
    }

    /**********************************************************
    Send a new product request.
    **********************************************************/
    async sendProductRequest() {
        // disable the button
        this.showSpinnerForBookButton();

        // retrieve all the data
        const productID = UrlParser.getPathValue(1);
        const locationID = this.getLocationValue();
        const startsOn = this.getStartsOnValue();
        const endsOn = this.getEndsOnValue();

        $(ProductListingForm.form).submit();


        const formData = new FormData();

        formData.append('product_id',  UrlParser.getPathValue(1));
        formData.append('location_id', this.getLocationValue());
        formData.append('starts_on', this.getStartsOnValue());
        formData.append('ends_on', this.getEndsOnValue());
    }

    /**********************************************************
    Checks the availability of the product listing based on the 
    inputs in the form.
    **********************************************************/
    checkAvailability() {
        const self = this;

        this.toggleErrorMessage(false);

        const productID = UrlParser.getPathValue(1);
        const locationID = this.getLocationValue();
        const startsOn = this.getStartsOnValue();
        const endsOn = this.getEndsOnValue();

        if (Array(productID, locationID, startsOn, endsOn).includes(null)) {
            return;
        }

        this.showSpinnerForCheckButton();
        this.toggleCheckButtons(false);

        ApiWrapper.requestGetProductListingAvailability(productID, locationID, startsOn, endsOn, function(response) {
            const isAvailabile = response.available;

            self.showNormalCheckButton();

            if (isAvailabile) {
                self.toggleCheckButtons(true);
            } 
            else {
                self.toggleCheckButtons(false);
                self.toggleErrorMessage(true);
            }

        }, function(response) {                 // error actions
            self.toggleCheckButtons(false);
            self.showNormalCheckButton();
        });
    }

    /**********************************************************
    Sets the location_id, starts_on, and ends_on url query parms 
    to the values in their respective inputs.
    **********************************************************/
    setUrlQueryParmsToInputValues() {
        const self = this;
        this.setDatesUrlQueryParmsToInputValues();
        this.setDatesUrlQueryParmsToInputValues();
    }

    /**********************************************************
    Sets the location_id url query parm to the values in its 
    respective input.
    **********************************************************/
    setLocationUrlQueryParmToInputValue() {
        const self = this;

        const newLocationID = this.getLocationValue();

        if (newLocationID != null) {
            UrlParser.setQueryParmsNoReload({location_id: newLocationID});
        }
    }

    /**********************************************************
    Sets the starts_on and ends_on url query parms to the values 
    in their respective inputs.
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
            $(ProductListingForm.inputs.hidden.endsOn).val(dates.endsOn);
        }
        if (dates.startsOn != null) {
            newUrlParms.starts_on = dates.startsOn;
            $(ProductListingForm.inputs.hidden.startsOn).val(dates.startsOn);
        }

        UrlParser.setQueryParmsNoReload(newUrlParms);
    }

    /**********************************************************
    Retrieves the values of the current URL query parms, and 
    sets the input element values to them.

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

        // set the hidden inputs
        $(ProductListingForm.inputs.hidden.endsOn).val(endsOn);
        $(ProductListingForm.inputs.hidden.startsOn).val(startsOn);
    }

    /**********************************************************
    Takes in a location object and sets the location input value 
    to City, State combo recieved.
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

    /**********************************************************
    Returns the current value of the startsOn input.
    **********************************************************/
    getStartsOnValue() {
        const dates = this.getDatesValues();
        return dates.startsOn;
    }

    /**********************************************************
    Returns the current value of the endsOn input.
    **********************************************************/
    getEndsOnValue() {
        const dates = this.getDatesValues();
        return dates.endsOn;
    }

    /**********************************************************
    Returns the current values of the dates input as an 
    object: startsOn and endsOn.
    **********************************************************/
    getDatesValues() {
        const dates = this.datesFlatpickr.getDateValues();
        return dates;
    }

    /**********************************************************
    Show the error message section:
        True - show the section
        False - hide the message
    **********************************************************/
    toggleErrorMessage(a_bShowMessage) {
        if (a_bShowMessage) {
            $(ProductListingForm.errorMessage).removeClass('d-none');
        } else {
            $(ProductListingForm.errorMessage).addClass('d-none');
        }
    }

    /**********************************************************
    Show/hide the book/check buttons:
        true = show the book button, hide the check button
        false = hide the book button, show the check button
    **********************************************************/
    toggleCheckButtons(a_bShowBookButton) {
        if (a_bShowBookButton) {
            $(ProductListingForm.buttons.book).removeClass('d-none');
            $(ProductListingForm.buttons.check).addClass('d-none');
        } else {
            $(ProductListingForm.buttons.book).addClass('d-none');
            $(ProductListingForm.buttons.check).removeClass('d-none');
        }
    }

    /**********************************************************
    Display the spinner element in the check availability button
    **********************************************************/
    showSpinnerForCheckButton() {
        const checkBtn = ProductListingForm.buttons.check;
        const width = $(checkBtn).width();

        $(checkBtn).html(CommonHtml.spinnerSmall).width(width).prop('disabled', true);
    }
    
    /**********************************************************
    Remove the spinner, and show the normal text for the check 
    availability button.
    **********************************************************/
    showNormalCheckButton() {
        const checkBtn = ProductListingForm.buttons.check;
        const width = $(checkBtn).width();
        const originalText = 'Check availability';

        $(checkBtn).text(originalText).width(width).prop('disabled', false);
    }

    /**********************************************************
    Display the spinner element in the book button
    **********************************************************/
    showSpinnerForBookButton() {
        const checkBtn = ProductListingForm.buttons.book;
        const width = $(checkBtn).width();

        $(checkBtn).html(CommonHtml.spinnerSmall).width(width).prop('disabled', true);
    }
    
    /**********************************************************
    Remove the spinner, and show the normal text for the book button.
    **********************************************************/
    showNormalBookButton() {
        const checkBtn = ProductListingForm.buttons.book;
        const width = $(checkBtn).width();
        const originalText = 'Book your stay';

        $(checkBtn).text(originalText).width(width).prop('disabled', false);
    }

}


/**********************************************************
Static constants for ProductListingForm
**********************************************************/
ProductListingForm.form = '#product-listing-form';
ProductListingForm.inputClass = '.product-listing-form-input';
ProductListingForm.errorMessage = '#product-listing-form-error-message';


ProductListingForm.inputs = {
    location: '#product-listing-form-input-location',
    dates: '#product-listing-form-input-dates',
    hidden: {
        startsOn: 'input[name="hidden-starts-on"]',
        endsOn: 'input[name="hidden-ends-on"]',
    }
}


ProductListingForm.buttons = {
    book: '#product-listing-form-button-book',
    check: '#product-listing-form-button-check',
}

ProductListingForm.urlQueryParms = {
    startsOn: 'starts_on',
    endsOn: 'ends_on',
    locationID: 'location_id',
}





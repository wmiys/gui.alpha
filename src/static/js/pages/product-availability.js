

/************************************************
edit product availability form element
*************************************************/
const eFormAvailabilityNew = {
    form     : '#product-availability-new-form',
    container: '#product-availability-new-container',

    inputs: {
        datesRange: '#product-availability-new-input-dates',
        note    : '#product-availability-new-input-note',
    },

    buttons: {
        create: '#product-availability-new-btn-create',
        cancel: '#product-availability-new-btn-cancel',
    },

    classNames: {
        inputs : '.product-availability-new-input',
        buttons: '.product-availability-new-btn',
    },

    getValues: function() {
        return getFormValues(eFormAvailabilityNew.inputs);
    }
}

/************************************************
Product availability table element
*************************************************/
const eTableAvailability = {
    table: '#product-availability-table',

    classNames: {
        th  : '.product-availability-th',
        row : '.product-availability-row',
        cell: '.product-availability-cell',
    },
}

/************************************************
Edit modal
*************************************************/
const eModalEdit = {
    modal: '#product-availability-edit-modal',
    productAvailabilityID: 'data-product-availability-id',

    getActiveProductAvailabilityID: function() {
        return $(eModalEdit.modal).attr(eModalEdit.productAvailabilityID);
    },

    setActiveProductAvailabilityID: function(newID) {
        $(eModalEdit.modal).attr(eModalEdit.productAvailabilityID, newID);
    },

    open: function(newID) {
        eModalEdit.setActiveProductAvailabilityID(newID);
        $(eModalEdit.modal).modal('show');
    }
}

/************************************************
Edit product availability record form
*************************************************/
const eFormAvailabilityEdit = {
    form     : '#product-availability-edit-form',

    inputs: {
        datesRange: '#product-availability-edit-input-dates',
        note    : '#product-availability-edit-input-note',
    },

    buttons: {
        save: '#product-availability-edit-btn-save',
        delete: '#product-availability-edit-btn-delete',
    },

    classNames: {
        inputs : '.product-availability-edit-input',
        buttons: '.product-availability-edit-btn',
    },

    getValues: function() {
        return getFormValues(eFormAvailabilityEdit.inputs);
    }
}

const mProductID = UrlParser.getPathValue(1);   // the product id found in the url: /products/42


let dateRangeEdit = null;
let dateRangeNew = null;

// if a flatpickr element has this class - it is not disabled
// if a flatpickr element does not have this class - it is disabled
const disableFlatpickrClass = 'flatpick-enabled';

/************************************************
Main logic
*************************************************/
$(document).ready(function() {
    addEventListeners();
    initFlatpickrs();
});

/************************************************
Registers all the event listeners
*************************************************/
function addEventListeners() {
    // open the edit modal
    $(eTableAvailability.classNames.row).on('click', function() {
        openEditModal(this);
    });

    // the edit product availability form SUBMIT button was clicked
    $(eFormAvailabilityEdit.buttons.save).on('click', function() {
        updateProductAvailability();
    });

    // the edit product availability form DELETE button was clicked
    $(eFormAvailabilityEdit.buttons.delete).on('click', function() {
        deleteProductAvailability();
    });

    // create a new product availability
    $(eFormAvailabilityNew.buttons.create).on('click', function() {
        createProductAvailability();
    });

}


/**********************************************************
Initialize the flat pickr inputs
**********************************************************/
function initFlatpickrs() {
    dateRangeEdit = $(eFormAvailabilityEdit.inputs.datesRange).flatpickr({
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        mode: "range",
    });

    dateRangeNew = $(eFormAvailabilityNew.inputs.datesRange).flatpickr({
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        mode: "range",
        minDate: "today",
        defaultDate: ["today", "today"],
    });
}

/************************************************
Returns an object containing a form's input values.

Parms:
    a_formInputElementObject: an object with the form inputs.
*************************************************/
function getFormValues(a_formInputElementObject) {
    const values = {};

    for (inputKey of Object.keys(a_formInputElementObject)) {
        values[inputKey] = $(a_formInputElementObject[inputKey]).val();
    }

    return values;
}

/************************************************
Open the edit product availability modal

Parms:
    a_eTableRow: the table row clicked/selected that the user wishes to view
*************************************************/
function openEditModal(a_eTableRow) {
    const newProductAvailabilityID = $(a_eTableRow).attr(eModalEdit.productAvailabilityID);
    ApiWrapper.requestGetProductAvailability(mProductID, newProductAvailabilityID, openEditModalSuccess, openEditModalError);
    eModalEdit.open(newProductAvailabilityID);
}

/************************************************
Callback for a successful product availability GET request to the API
*************************************************/
function openEditModalSuccess(response, status, xhr) {
    setEditModalFormValues(response);
}

/************************************************
Callback for an unsuccessful product availability GET request to the API
*************************************************/
function openEditModalError(xhr, status, error) {
    Utilities.displayAlert('API error. Check log');
    console.error('submitFormEventError');
    console.error(xhr);
    console.error(status);
    console.error(error); 
}


/************************************************
Sets the edit modal form inputs

Parms:
     oProductAvailability: an object containing the fields:
        - starts_on
        - ends_on
        - note
*************************************************/
function setEditModalFormValues(oProductAvailability) {
    $(eFormAvailabilityEdit.inputs.note).val(oProductAvailability.note);
    dateRangeEdit.setDate([oProductAvailability.starts_on, oProductAvailability.ends_on], true);
}

/************************************************
Update the product availability. Send request.
*************************************************/
function updateProductAvailability() {    
    disableFormEdit(eFormAvailabilityEdit.buttons.save);
    const dates = getFlatPickrRangeDates(dateRangeEdit);

    let requestBody = {
        starts_on: dates.startsOn,
        ends_on: dates.endsOn,
        note: $(eFormAvailabilityEdit.inputs.note).val(),
    }
    
    const availabilityID = eModalEdit.getActiveProductAvailabilityID();
    ApiWrapper.requestPutProductAvailability(mProductID, availabilityID, requestBody, updateProductAvailabilitySuccess, updateProductAvailabilityError);
}

/************************************************
Returns the starts on and ends on values in a flatpickr date range.
*************************************************/
function getFlatPickrRangeDates(a_flatPickrInstance) {   
    if (a_flatPickrInstance.selectedDates.length == 0) {
        return null;
    }

    let out1 = DateTime.fromJSDate(a_flatPickrInstance.selectedDates[0]); // starts on
    let out2 = DateTime.fromJSDate(a_flatPickrInstance.selectedDates[1]); // ends on

    const result = {
        startsOn: out1.toISODate(),
        endsOn: out2.toISODate(),
    }

    return result;
}


/**********************************************************
Successful product availability PUT request callback.
Refreshes the page.
**********************************************************/
function updateProductAvailabilitySuccess(response, status, xhr) {
    window.location.href = window.location.href;
}

/**********************************************************
Unsuccessful product availability PUT request callback
**********************************************************/
function updateProductAvailabilityError(xhr, status, error) {
    enableFormEdit();

    Utilities.displayAlert('API error.');

    console.error('updateProductAvailabilityError');
    console.error(xhr);
    console.error(status);
    console.error(error); 
}

/**********************************************************
Delete a product availabiulity record.
**********************************************************/
function deleteProductAvailability() {
    // this can't be undone
    if (!confirm('Are you sure you want to delete this? It can\'t be undone.')) {
        return;
    }

    disableFormEdit(eFormAvailabilityEdit.buttons.delete);

    const availabilityID = eModalEdit.getActiveProductAvailabilityID();
    ApiWrapper.requestDeleteProductAvailability(mProductID, availabilityID, updateProductAvailabilitySuccess, updateProductAvailabilityError);
}

/**********************************************************
Successful product availability DELETE request callback.
Refreshes the page.
**********************************************************/
function deleteProductAvailabilitySuccess(response, status, xhr) {
    window.location.href = window.location.href;
}

/**********************************************************
Unsuccessful product availability DELETE request callback
**********************************************************/
function deleteProductAvailabilityError(xhr, status, error) {
    enableFormEdit(eFormAvailabilityEdit.buttons.delete);
    
    Utilities.displayAlert('API error.');

    console.error('updateProductAvailabilityError');
    console.error(xhr);
    console.error(status);
    console.error(error); 
}


/************************************************
Update a new product availability. 
Send request to the api
*************************************************/
function createProductAvailability() {
    disableFormNew();

    const dates = getFlatPickrRangeDates(dateRangeNew);

    let requestBody = {
        starts_on: dates.startsOn,
        ends_on: dates.endsOn,
        note: $(eFormAvailabilityNew.inputs.note).val(),
    }
    
    ApiWrapper.requestPostProductAvailability(mProductID, requestBody, createProductAvailabilitySuccess, createProductAvailabilityError);
}

/************************************************
Callback for a successful product availability POST request to the API
*************************************************/
function createProductAvailabilitySuccess(response, status, xhr) {
    window.location.href = window.location.href;
    // enableFormNew();
}

/************************************************
Callback for an unsuccessful product availability POST request to the API
*************************************************/
function createProductAvailabilityError(xhr, status, error) {
    enableFormNew();
    
    Utilities.displayAlert('API error. Check log');
    console.error('submitFormEventError');
    console.error(xhr);
    console.error(status);
    console.error(error); 
}


/************************************************
Disable the new form elements
*************************************************/
function disableFormNew() {
    $(eFormAvailabilityNew.buttons.create).find('.spinner-border').removeClass('d-none');   // show the spinner in the button
    $(eFormAvailabilityNew.classNames.buttons).prop('disabled', true);                      // disable the buttons
    $(eFormAvailabilityNew.classNames.inputs).prop('disabled', true);                       // disabled the inputs
}

/************************************************
Enable the new form elements
*************************************************/
function enableFormNew() {
    $(eFormAvailabilityNew.buttons.create).find('.spinner-border').addClass('d-none');   // show the spinner in the button
    $(eFormAvailabilityNew.classNames.buttons).prop('disabled', false);                      // disable the buttons
    $(eFormAvailabilityNew.classNames.inputs).prop('disabled', false);                       // disabled the inputs
}

/************************************************
Disable the edit form elements
*************************************************/
function disableFormEdit(eSpinnerButton) {
    $(eSpinnerButton).find('.spinner-border').removeClass('d-none');   // show the spinner in the button
    $(eFormAvailabilityEdit.classNames.buttons).prop('disabled', true);                      // disable the buttons
    $(eFormAvailabilityEdit.classNames.inputs).prop('disabled', true);                       // disabled the inputs
}

/************************************************
Enable the edit form elements
*************************************************/
function enableFormEdit(eSpinnerButton) {
    $(eSpinnerButton).find('.spinner-border').addClass('d-none');   // show the spinner in the button
    $(eFormAvailabilityEdit.classNames.buttons).prop('disabled', false);                      // disable the buttons
    $(eFormAvailabilityEdit.classNames.inputs).prop('disabled', false);                       // disabled the inputs
}


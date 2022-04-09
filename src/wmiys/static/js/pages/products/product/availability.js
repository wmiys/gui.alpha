import { ApiWrapper }      from "../../../classes/API-Wrapper";
import { FlatpickrRange }  from "../../../classes/FlatpickrRange";
import { UrlParser }       from "../../../classes/UrlParser";
import { Utilities }       from "../../../classes/Utilities";

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
    },

    toggleLoadingDisplay: function(a_showLoading = true) {
        let formHeight = $(eModalEdit.modal).find('.modal-body').height();

        if (a_showLoading) {
            $(eModalEdit.modal).addClass('loading').find('.loading-spinner').height(formHeight);
        } else {
            $(eModalEdit.modal).removeClass('loading').find('.loading-spinner').height(formHeight);
        }
    },
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
Possible page alerts to set before reloading the page.
*************************************************/
const PageAlerts = {
    key: 'product-availability-alert',

    values: {
        successfulPost: 1,
        successfulPut: 2,
        successfulDelete: 3,
    }
}

const eAlertPageTop = {
    alert: '#alert-page-top',

    displayMessage: function(message, alertType = 'success') {
        const elementClass = `alert alert-${alertType} alert-dismissible`;
        $(eAlertPageTop.alert).removeClass().addClass(elementClass).prop('hidden', false).find('.message').text(message);

    },
}

/************************************************
Main logic
*************************************************/
$(document).ready(function() {
    $('#product-edit-navbar-tab-availability').addClass('active');
    checkForAlerts();
    addEventListeners();
    initFlatpickrs();
});

/************************************************
Check for and display any alerts set by the page before it was reloaded.
*************************************************/
function checkForAlerts() {
    let alertValue = window.sessionStorage.getItem(PageAlerts.key);
    window.sessionStorage.removeItem(PageAlerts.key);

    if (alertValue == null) {   // no alerts set from previous page
        return;
    }

    if (alertValue == PageAlerts.values.successfulPost) {
        eAlertPageTop.displayMessage("Item created.");
    } else if (alertValue == PageAlerts.values.successfulDelete) {
        eAlertPageTop.displayMessage("Item deleted.");
    } else if (alertValue == PageAlerts.values.successfulPut)  {
        eAlertPageTop.displayMessage("Item updated.");
    } else {
        eAlertPageTop.displayMessage("Success.");
    }
}

/************************************************
Registers all the event listeners
*************************************************/
function addEventListeners() {
    // open the edit modal
    $(eTableAvailability.classNames.row).on('click', function() {
        openEditModal(this);
    });

    $(eModalEdit.modal).on('shown.bs.modal', function (e) {
        eModalEdit.toggleLoadingDisplay(true);
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

    dateRangeEdit = new FlatpickrRange(eFormAvailabilityEdit.inputs.datesRange, false);
    dateRangeNew = new FlatpickrRange(eFormAvailabilityNew.inputs.datesRange, true);
}

/************************************************
Returns an object containing a form's input values.

Parms:
    a_formInputElementObject: an object with the form inputs.
*************************************************/
function getFormValues(formInputElement) {
    const values = {};
    
    for (inputKey of Object.keys(formInputElement)) {
        values[inputKey] = $(formInputElement[inputKey]).val();
    }

    return values;
}

/************************************************
Open the edit product availability modal

Parms:
    eSelectedTableRow: the table row clicked/selected that the user wishes to view
*************************************************/
async function openEditModal(eSelectedTableRow) {
    const productAvailabilityID = $(eSelectedTableRow).attr(eModalEdit.productAvailabilityID);
    
    eModalEdit.open(productAvailabilityID);

    const record = await fetchProductAvailabilityRecord(productAvailabilityID);

    if (record != null) {
        openEditModalSuccess(record);
    }
}

/**
 * Fetch the specified product availability from the api
 * Returns null if not found or there was an error
 * 
 * @param {number} productAvailabilityID - the product availability id
 * 
 * @returns {Object} the product availability record
 */
async function fetchProductAvailabilityRecord(productAvailabilityID) {
    let record = null;

    const apiResponse = await ApiWrapper.requestGetProductAvailability(mProductID, productAvailabilityID);

    if (!apiResponse.ok) {
        console.error(await apiResponse.text());
        return record;
    }

    try {
        record = await apiResponse.json();
        // console.table(record);
    }
    catch (exception) {
        console.error(exception);
        record = null;
    }

    return record;
}

/************************************************
Callback for a successful product availability GET request to the API
*************************************************/
function openEditModalSuccess(productAvailability) {
    setEditModalFormValues(productAvailability);
    eModalEdit.toggleLoadingDisplay(false);
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
     productAvailabilityRecord: an object containing the fields:
        - starts_on
        - ends_on
        - note
*************************************************/
function setEditModalFormValues(productAvailabilityRecord) {
    $(eFormAvailabilityEdit.inputs.note).val(productAvailabilityRecord.note);

    dateRangeEdit.flatpickrInstance.setDate([productAvailabilityRecord.starts_on, productAvailabilityRecord.ends_on], true);
}

/************************************************
Update the product availability. 
Send request.
*************************************************/
async function updateProductAvailability() {    
    disableFormEdit(eFormAvailabilityEdit.buttons.save);
    
    const data = getUpdateFormData();
    const availabilityID = eModalEdit.getActiveProductAvailabilityID();
    const apiResponse = await ApiWrapper.requestPutProductAvailability(mProductID, availabilityID, data);

    if (apiResponse.ok) {
        updateProductAvailabilitySuccess();
    }
    else {
        updateProductAvailabilityError(await apiResponse.text());
    }
}

/************************************************
Get the current form input values
*************************************************/
function getUpdateFormData() {
    const dates = dateRangeEdit.getDateValues();

    let data = {
        starts_on: dates.startsOn,
        ends_on: dates.endsOn,
        note: $(eFormAvailabilityEdit.inputs.note).val(),
    }

    return data;
}

/**********************************************************
Successful product availability PUT request callback.
Refreshes the page.
**********************************************************/
function updateProductAvailabilitySuccess() {
    window.sessionStorage.setItem(PageAlerts.key, PageAlerts.values.successfulPut);
    window.location.href = window.location.href;
}

/**********************************************************
Unsuccessful product availability PUT request callback
**********************************************************/
function updateProductAvailabilityError(error) {
    enableFormEdit();
    Utilities.displayAlert('API error.');
    console.error(error); 
}

/**********************************************************
Delete a product availabiulity record.
**********************************************************/
async function deleteProductAvailability() {
    // this can't be undone
    if (!confirm('Are you sure you want to delete this? It can\'t be undone.')) {
        return;
    }

    disableFormEdit(eFormAvailabilityEdit.buttons.delete);

    const availabilityID = eModalEdit.getActiveProductAvailabilityID();
    const apiResponse = await ApiWrapper.requestDeleteProductAvailability(mProductID, availabilityID);

    if (apiResponse.ok) {
        deleteProductAvailabilitySuccess();
    } 
    else {
        deleteProductAvailabilityError(await apiResponse.text());
    }
}



/**********************************************************
Successful product availability DELETE request callback.
Refreshes the page.
**********************************************************/
function deleteProductAvailabilitySuccess() {
    window.sessionStorage.setItem(PageAlerts.key, PageAlerts.values.successfulDelete);
    window.location.href = window.location.href;
}

/**********************************************************
Unsuccessful product availability DELETE request callback
**********************************************************/
function deleteProductAvailabilityError(errMessage) {
    enableFormEdit(eFormAvailabilityEdit.buttons.delete);
    Utilities.displayAlert('API error.');
    console.error(errMessage); 
}


/************************************************
Update a new product availability. 
Send request to the api
*************************************************/
async function createProductAvailability() {
    disableFormNew();

    const dates = dateRangeNew.getDateValues();
    const requestBody = {
        starts_on: dates.startsOn,
        ends_on: dates.endsOn,
        note: $(eFormAvailabilityNew.inputs.note).val(),
    }

    const apiResponse = await ApiWrapper.requestPostProductAvailability(mProductID, requestBody);
    if (apiResponse.ok) {
        createProductAvailabilitySuccess();
    } 
    else {
        createProductAvailabilityError(await apiResponse.text());
    }
}


/************************************************
Callback for a successful product availability POST request to the API
*************************************************/
function createProductAvailabilitySuccess(response, status, xhr) {
    window.sessionStorage.setItem(PageAlerts.key, PageAlerts.values.successfulPost);
    window.location.href = window.location.href;
    // enableFormNew();
}

/************************************************
Callback for an unsuccessful product availability POST request to the API
*************************************************/
function createProductAvailabilityError(error) {
    enableFormNew();
    
    Utilities.displayAlert('API error. Check log');
    console.error('submitFormEventError');
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





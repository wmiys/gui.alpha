

/************************************************
edit product availability form element
*************************************************/
const eFormAvailabilityNew = {
    form     : '#product-availability-edit-form',
    container: '#product-availability-edit-container',

    inputs: {
        startsOn: '#product-availability-edit-input-starts-on',
        endsOn  : '#product-availability-edit-input-ends-on',
        note    : '#product-availability-edit-input-note',
    },

    buttons: {
        create: '#product-availability-edit-btn-create',
        cancel: '#product-availability-edit-btn-cancel',
    },

    classNames: {
        inputs : '.product-availability-edit-input',
        buttons: '.product-availability-edit-btn',
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
        startsOn: '#product-availability-edit-input-starts-on',
        endsOn  : '#product-availability-edit-input-ends-on',
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

let flatpickEditStartsOn = null;
let flatpickEditEndsOn = null;
let flatpickNewStartsOn = null;
let flatpickNewEndsOn = null;


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
}

/**********************************************************
Initialize the flat pickr inputs
**********************************************************/
function initFlatpickrs() {
    flatpickNewStartsOn = $(eFormAvailabilityNew.inputs.startsOn).flatpickr({
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        minDate: "today",
    });

    flatpickNewEndsOn = $(eFormAvailabilityNew.inputs.endsOn).flatpickr({
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        minDate: "today",
    });

    flatpickEditStartsOn = $(eFormAvailabilityEdit.inputs.startsOn).flatpickr({
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
    });

    flatpickEditEndsOn = $(eFormAvailabilityEdit.inputs.endsOn).flatpickr({
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
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
    flatpickEditStartsOn.setDate(oProductAvailability.starts_on, true);
    flatpickEditEndsOn.setDate(oProductAvailability.ends_on, true);
}

/************************************************
Update the product availability. Send request.
*************************************************/
function updateProductAvailability() {    
    let requestBody = {
        starts_on: $(eFormAvailabilityEdit.inputs.startsOn).val(),
        ends_on: $(eFormAvailabilityEdit.inputs.endsOn).val(),
        note: $(eFormAvailabilityEdit.inputs.note).val(),
    }
    
    const availabilityID = eModalEdit.getActiveProductAvailabilityID();
    ApiWrapper.requestPutProductAvailability(mProductID, availabilityID, requestBody, updateProductAvailabilitySuccess, updateProductAvailabilityError);
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
    Utilities.displayAlert('API error.');

    console.error('updateProductAvailabilityError');
    console.error(xhr);
    console.error(status);
    console.error(error); 
}



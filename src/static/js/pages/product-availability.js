

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



/************************************************
Main logic
*************************************************/
$(document).ready(function() {
    addEventListeners();
});


/************************************************
Registers all the event listeners
*************************************************/
function addEventListeners() {

    // open the edit modal
    $(eTableAvailability.classNames.row).on('click', function() {
        openEditModal(this);
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
        values[inputKey] = a_formInputElementObject[inputKey];
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
    $(eFormAvailabilityEdit.inputs.startsOn).val(oProductAvailability.starts_on);
    $(eFormAvailabilityEdit.inputs.endsOn).val(oProductAvailability.ends_on);
    $(eFormAvailabilityEdit.inputs.note).val(oProductAvailability.note);
}





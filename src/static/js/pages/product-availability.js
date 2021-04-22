

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

const eModalEdit = '#product-availability-edit-modal';  // edit modal

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
    $(eModalEdit).modal('show');
}
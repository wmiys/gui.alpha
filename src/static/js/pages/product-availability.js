

/************************************************
New product availability form element
*************************************************/
const eFormAvailabilityNew = {
    form     : '#product-availability-new-form',
    container: '#product-availability-new-container',

    inputs: {
        startsOn: '#product-availability-new-input-starts-on',
        endsOn  : '#product-availability-new-input-ends-on',
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
Main logic
*************************************************/
$(document).ready(function() {
    console.log('availability');
});


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
/************************************************
This object represents the General Information form.
It includes all of its inputs and buttons.
*************************************************/
const eFormBasic = {
    form: $('.form-account-settings-basic'),

    inputs: {
        nameFirst: $('#form-account-settings-basic-name-first'),
        nameLast : $('#form-account-settings-basic-name-last'),
        email    : $('#form-account-settings-basic-email'),
        dob : $('#form-account-settings-basic-dob'),
    },

    buttons: {
        submit: $('#form-account-settings-basic-submit'),
    },

    inputClassIdentifier: '.form-account-settings-basic-input',

    getValues: function() {
        const values = {};

        for (inputKey of Object.keys(eFormBasic.inputs)) {
            values[inputKey] = eFormBasic.inputs[inputKey];
        }

        return values;
    },
}

const eSideNav = {
    container: $('.card-account-settings-sidenav'),

    profileSection: {
        picture: $('.img-profile-pic'),
        nameFirst: $('.profile-info-name-first'),
        nameLast: $('.profile-info-name-last'),
    }
}


/************************************************
Main logic
*************************************************/
$(document).ready(function() {
    // ApiWrapper.requestGetUser(LocalStorage.getUserID(), displayBasicFormData, console.error);

});


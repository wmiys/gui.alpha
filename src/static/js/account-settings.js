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
    ApiWrapper.requestGetUser(LocalStorage.getUserID(), displayBasicFormData, console.error);

});


/************************************************
Load the user's basic information into the form inputs
*************************************************/
function displayBasicFormData(basicUserInfo={name_first, name_last, email, dob}) {

    // set the profile name
    $(eSideNav.profileSection.nameFirst).text(basicUserInfo.name_first);
    $(eSideNav.profileSection.nameLast).text(basicUserInfo.name_last);


    // set the input values
    $(eFormBasic.inputs.nameFirst).val(basicUserInfo.name_first);
    $(eFormBasic.inputs.nameLast).val(basicUserInfo.name_last);
    $(eFormBasic.inputs.email).val(basicUserInfo.email);

    /**
     * The date value passed in is in a MySQL timestamp format, 
     * so we need to convert it to one that html understands
     */
    const dateValue = DateTime.fromRFC2822(basicUserInfo.birth_date).toISODate();
    $(eFormBasic.inputs.dob).val(dateValue);


    // now the user can modify their info
    $(eFormBasic.inputClassIdentifier).prop('disabled', false);
    $(eFormBasic.buttons.submit).prop('disabled', false);
}

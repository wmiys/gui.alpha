// Page elements
const e_formCreateAccount = $('#form-create-account');
const e_inputFirstName    = $('#form-create-account-name-first');
const e_inputLastName     = $('#form-create-account-name-last');
const e_inputDob          = $('#form-create-account-dob');
const e_inputEmail        = $('#form-create-account-email');
const e_inputPassword     = $('#form-create-account-password');
const e_btnSubmit         = $('#form-create-account-submit');


$(document).ready(function() {
    addListeners();
    // loadFlatpickr();
});


function addListeners() {
    $(e_btnSubmit).on('click', createAccount);
    
    $(e_formCreateAccount).find('input').on('keypress', function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            createAccount();
        }
    });
}

function loadFlatpickr() {
    $(e_inputDob).flatpickr({
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
    });
}


function createAccount() {
    disableSubmitButton();

    // ensure all the input fields are valid 
    if (!Utilities.validateForm(e_formCreateAccount)) {
        enableSubmitButton();
        return;
    }

    let inputValues = getInputValues();
    ApiWrapper.requestPostUser(inputValues, createAccountSuccess, createAccountError);
}

function createAccountSuccess(result,status,xhr) {
    console.log(result);
    console.log(status);
    console.log(xhr);

    enableSubmitButton();

    Utilities.displayAlert('Success.');
    LocalStorage.setUserID(result.id);
    window.location.href = 'home.php';
}

function createAccountError(xhr, status, error) {
    console.log(result);
    console.log(status);
    console.log(error);

    enableSubmitButton();
    Utilities.displayAlert('Error.');
}


function disableSubmitButton() {
    $(e_btnSubmit).html(CommonHtml.spinnerSmall);
    $(e_btnSubmit).prop('disabled', true);
}

function enableSubmitButton() {
    $(e_btnSubmit).html('Create account').prop('disabled', false);
}

function getInputValues() {
    const values = {};
    values.name_first = $(e_inputFirstName).val();
    values.name_last  = $(e_inputLastName).val();
    values.birth_date = $(e_inputDob).val();
    values.email      = $(e_inputEmail).val();
    values.password   = $(e_inputPassword).val();

    return values;
}





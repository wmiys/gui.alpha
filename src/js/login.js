// Page elements
const e_formLogin = $('#form-login');
const e_inputEmail        = $('#form-login-email');
const e_inputPassword     = $('#form-login-password');
const e_btnSubmit         = $('#form-login-submit');


$(document).ready(function() {

    addListeners();
});


function addListeners() {
    $(e_btnSubmit).on('click', attemptLogin);
    
    $(e_formLogin).find('.form-control').on('keypress', clearInvalidInputClass);
}


function attemptLogin() {
    disableSubmitButton();

    // ensure all the input fields are valid 
    if (!Utilities.validateForm(e_formLogin)) {
        enableSubmitButton();
        return;
    }

    let inputValues = getInputValues();
    ApiWrapper.requestLogin(inputValues, loginSuccess, loginError);
    // enableSubmitButton();

}


function disableSubmitButton() {
    $(e_btnSubmit).html(CommonHtml.spinnerSmall);
    $(e_btnSubmit).prop('disabled', true);
}

function enableSubmitButton() {
    $(e_btnSubmit).html('Log in').prop('disabled', false);
}

function getInputValues() {
    const values = {};
    values.email      = $(e_inputEmail).val();
    values.password   = $(e_inputPassword).val();

    return values;
}

function loginSuccess(result,status,xhr) {
    console.log(result);
    console.log(status);
    console.log(xhr);

    enableSubmitButton();

    Utilities.displayAlert('Success.');
    LocalStorage.setUserID(result.id);
    window.location.href = 'home.php';
}

function loginError(xhr, status, error) {
    console.log(xhr);
    console.log(status);
    console.log(error);

    enableSubmitButton();
    Utilities.displayAlert('Invalid login credentials.');

    $(e_inputPassword).val('');
    $(e_formLogin).find('.form-control').addClass('is-invalid');
}


function clearInvalidInputClass() {
    $(e_formLogin).find('.form-control').removeClass('is-invalid');
}
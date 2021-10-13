
const eRequestButtons = '.product-request-btn'

const eProductRequestClass = '.product-request';




/************************************************
Main logic.
*************************************************/
$(document).ready(function() {
    $('#products-sidenav-link-requests').addClass('active');

    addEventListeners();
});


/************************************************
Registers all the event listeners to the html 
elements on the page.
*************************************************/
function addEventListeners() {
    $(eRequestButtons).on('click', function() {
        sendRequestResponse(this);
    });
}


/************************************************
Action event listener for hitting the accept button.
*************************************************/
async function sendRequestResponse(responseButtonClicked) {

    // disable the clicked button
    const originalText = $(responseButtonClicked).text();
    const spinningBtn = new SpinnerButton(responseButtonClicked, originalText);
    spinningBtn.showSpinner();

    // send the request to the api
    const requestID = $(responseButtonClicked).closest(eProductRequestClass).attr('data-request-id');
    const status = $(responseButtonClicked).attr('data-status-value');
    let apiResponse = ApiWrapper.requestPostProductRequestResponse(requestID, status);
    apiResponse = await Promise.resolve(apiResponse);

    
    if (apiResponse.ok) {
        // refresh the page
        window.location.href = window.location.href;    
    } else {
        // reset the button
        spinningBtn.reset();

        Utilities.displayAlert('Error. Response not saved.');
    }
}

const eRequestButtons = '.product-request-btn'
const eProductRequestClass = '.product-request';
const eStatusDropdown = '.dropdown-status';

const STATUS_FILTERS = {
    All: 'all',
    Accepted: 'accepted',
    Denied: 'denied',
    Expired: 'expired',
    Pending: 'pending',
}



/************************************************
Main logic.
*************************************************/
$(document).ready(function() {
    $('#products-sidenav-link-requests').addClass('active');
    setActiveStatusDropdownOption();
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


/************************************************
Set the active status filter dropdown.
*************************************************/
function setActiveStatusDropdownOption() {
    const urlStatusParmValue = UrlParser.getQueryParm('status');

    // use pending if no status filter is set in the url
    const statusFilter = urlStatusParmValue != null ? urlStatusParmValue : STATUS_FILTERS.Pending;

    // select the active dropdown item
    const eActiveDropdownItem = $(eStatusDropdown).find(`.dropdown-item[data-status='${statusFilter}']`);
    $(eActiveDropdownItem).addClass('active');    
}

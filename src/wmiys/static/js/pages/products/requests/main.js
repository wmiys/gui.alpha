import { ApiWrapper }           from "../../../classes/API-Wrapper";
import { SpinnerButton }        from "../../../classes/SpinnerButton";
import { UrlParser }            from "../../../classes/UrlParser";
import { Utilities }            from "../../../classes/Utilities";
import { AlertTop }             from "../../../classes/AlertTop";
import { ALERT_TOP_TYPES }      from "../../../classes/AlertTop";
import { eTopNavs       }       from "./elements";
import { eProductRequestClass } from "./elements";
import { eRequestButtons }      from "./elements";
import { eSidenavLink }         from "./elements";

/************************************************
Main logic.
*************************************************/
$(document).ready(function() {
    $(eSidenavLink).addClass('active');
    addEventListeners();
    activateTopNav();
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
async function sendRequestResponse(eResponseActionButton) {
    // disable the clicked button
    const spinningBtn = disableActionButton(eResponseActionButton);

    // send the request to the api
    const requestID = getRequestID(eResponseActionButton);
    const status = getRequestActionButtonDataValue(eResponseActionButton);
    const apiResponse = await ApiWrapper.requestPostProductRequestResponse(requestID, status);

    spinningBtn.reset();
    
    if (apiResponse.ok) {
        new AlertTop(ALERT_TOP_TYPES.SUCCESS, 'Saved').show();
        $(eResponseActionButton).closest(eProductRequestClass).remove();
    } 
    else {
        console.error(await apiResponse.text());
        Utilities.displayAlert('Error. Response not saved.');
    }
}

/**
 * Create a new SpinnerButton and disable it
 * 
 * @param {HTMLElement } eButton - the button element to disable
 * 
 * @returns {SpinnerButton}
 */
function disableActionButton(eButton) {
    // disable the clicked button
    const originalText = $(eButton).text();
    const spinner = new SpinnerButton(eButton, originalText);
    spinner.showSpinner();

    return spinner;
}


/**
 * Get the request id of the container request element of the specified request response button element
 * 
 * @param {HTMLButtonElement} eButton - the clicked request response button
 * 
 * @returns {string} The request id
 */
function getRequestID(eButton) {
    return $(eButton).closest(eProductRequestClass).attr('data-request-id');
}

/**
 * Get the request action data attribute value from the given response action button
 * 
 * @param {HTMLButtonElement} eButton - the response action button
 * 
 * @returns {string} the response value (either accept or decline)
 */
function getRequestActionButtonDataValue(eButton) {
    return $(eButton).attr('data-status-value');
}

/**
 * Activate the topnav element
 */
function activateTopNav() {

    let isResolvedActive = false;
    
    try {
        isResolvedActive = UrlParser.getPathValue(2).toLowerCase() == "resolved";    
    } 
    catch(error) {
        isResolvedActive = false;
    }

    const eNav = isResolvedActive ? eTopNavs.RESOLVED : eTopNavs.PENDING;
    $(eNav).addClass('active');
}

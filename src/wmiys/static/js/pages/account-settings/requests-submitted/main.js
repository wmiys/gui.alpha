
import { RequestsSubmittedModal } from "./requests-submitted-modal";
import { RequestRatingInterface } from "./rating-request";
import { m_ePillsTab } from "./page-elements";
import { m_eClasses } from "./page-elements";
import { RequestRenderer } from "./request-renderer";


/************************************************
Main logic
*************************************************/
$(document).ready(function() {
    activateSidelink();
    addEventListeners();
});

/************************************************
Activate the sidebar link
*************************************************/
function activateSidelink() {
    $(m_ePillsTab).addClass('active');
}

/**
 * Add the event listeners to the page
 */
function addEventListeners() {
    // open a request 
    $(`.${m_eClasses.CARD}`).on('click', function() {
        openRequest(this);
    });
    

    $(RequestsSubmittedModal.Elements.REVIEW_INPUTS.SUBMIT).on('click', saveRating);
}

/**
 * Open the request modal using the specifed request element
 * @param {HTMLElement} eRequest - the request element to open
 */
function openRequest(eRequest) {
    const requestID = getRequestContainerElementID(eRequest);
    
    RequestsSubmittedModal.setCurrentRequestID(requestID);

    const renderer = new RequestRenderer(requestID);
    renderer.render();
}

/**
 * Get the request id of the specified request container
 * @param {HTMLDivElement} eRequest - the request container element
 * @returns {string} the request id
 */
function getRequestContainerElementID(eRequest) {
    return $(eRequest).attr('data-request-id');
}

async function saveRating() {
    const ratingInterface = new RequestRatingInterface();

    console.log(ratingInterface);

    ratingInterface.save();

}




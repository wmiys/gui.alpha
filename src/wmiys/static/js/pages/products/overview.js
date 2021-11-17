const eCardOverviewStat = '.card-products-overview-stat';
const eBtnTransferBalance = '#btn-transfer-balance';
const eBalanceCard = '.card-products-overview-stat-balance';

let mBtnTransferSpinner = null;



/************************************************
Main logic.
*************************************************/
$(document).ready(function() {
    activateSidebarItem();
    initCountUps();
    addListeners();

    mBtnTransferSpinner = new SpinnerButton(eBtnTransferBalance, 'Transfer your balance');
});



/************************************************
Activate the side navnbar item.
*************************************************/
function activateSidebarItem() {
    $('#products-sidenav-link-overview').addClass('active');
}


/************************************************
Initialize all the countup items.
*************************************************/
function initCountUps() {
    for (const statElement of document.querySelectorAll(eCardOverviewStat)) {
        const countUp = new CountUp(statElement);
        countUp.start();
    }
}

/************************************************
Add all the event listeners to the html elements.
*************************************************/
function addListeners() {
    $(eBtnTransferBalance).on('click', function() {
        transferAccountBalance();
    });
}

/************************************************
Transfer the account balance
*************************************************/
async function transferAccountBalance() {
    // disable the "transfer balance" button
    mBtnTransferSpinner.showSpinner();

    // send the request to the api
    let apiResponse = ApiWrapper.requestPostBalanceTransfer();
    apiResponse = await Promise.resolve(apiResponse);


    // determine the alert message/type
    const alertType = apiResponse.ok ? ALERT_TOP_TYPES.SUCCESS : ALERT_TOP_TYPES.DANGER;
    const message = apiResponse.ok ? 'Success!' : 'Error. Could not transfer your balance';
    
    // display the alert
    const alertTop = new AlertTop(alertType, message);
    alertTop.show();

    // reset the transfer balance button
    mBtnTransferSpinner.reset();

    // if the request was successful, disable the button and set the balance to 0
    if (apiResponse.ok) {
        $(eBtnTransferBalance).prop('disabled', true);
        $(eBalanceCard).text('$0.00');
    }
    
}
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




function activateSidebarItem() {
    $('#products-sidenav-link-overview').addClass('active');
}



function initCountUps() {
    for (const statElement of document.querySelectorAll(eCardOverviewStat)) {
        const countUp = new CountUp(statElement);
        countUp.start();
    }
}

function addListeners() {
    $(eBtnTransferBalance).on('click', function() {
        transferAccountBalance();
    });
}


async function transferAccountBalance() {
    // disable the "transfer balance" button
    mBtnTransferSpinner.showSpinner();

    let apiResponse = ApiWrapper.requestPostBalanceTransfer();
    apiResponse = await Promise.resolve(apiResponse);

    console.log(apiResponse);

    mBtnTransferSpinner.reset();

    const alertType = apiResponse.ok ? ALERT_TOP_TYPES.SUCCESS : ALERT_TOP_TYPES.DANGER;
    const message = apiResponse.ok ? 'Success!' : 'Error. Could not transfer your balance';
    
    const alertTop = new AlertTop(alertType, message);
    alertTop.show();

    if (apiResponse.ok) {
        $(eBtnTransferBalance).prop('disabled', true);
        $(eBalanceCard).text('$0.00');
    }
    
}
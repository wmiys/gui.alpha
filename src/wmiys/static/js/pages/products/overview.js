const eCardOverviewStat = '.card-products-overview-stat';
const eBtnTransferBalance = '#btn-transfer-balance';

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


function transferAccountBalance() {
    mBtnTransferSpinner.showSpinner();
}
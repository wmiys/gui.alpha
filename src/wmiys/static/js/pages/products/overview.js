const eCardOverviewStat = '.card-products-overview-stat';



/************************************************
Main logic.
*************************************************/
$(document).ready(function() {
    activateSidebarItem();
    initCountUps();
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
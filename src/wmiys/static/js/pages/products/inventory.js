
/**********************************************************
Module variables
**********************************************************/
const eListings = $('#lender-product-listings');

/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    $('#products-sidenav-link-inventory').addClass('active');
});


/**********************************************************
Displays a specified number of product card skeletons
**********************************************************/
function displayInitialProductSkeletons(numSkeletons = 5) {
    let html = '';

    for (let count = 0; count < numSkeletons; count++) {
        html += ProductLender.getHtmlSkeleton();
    }

    $(eListings).html(html);
}


/**********************************************************
Displays the user's products
**********************************************************/
function getUserProductsSuccess(response, status, xhr) {

    console.log(response);

    let html = '';
    for (product of response) {
        const productLender = new ProductLender(product);
        html += productLender.getHtml();
    }

    $(eListings).html(html);
}




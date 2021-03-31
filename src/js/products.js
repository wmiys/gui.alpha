
const eListings = $('#lender-product-listings');


$(document).ready(function() {
    displayInitialProductSkeletons(3);
    ApiWrapper.requestGetUserProducts(getUserProductsSuccess, console.error);
});


function displayInitialProductSkeletons(numSkeletons = 5) {
    let html = '';

    for (let count = 0; count < numSkeletons; count++) {
        html += ProductLender.getHtmlSkeleton();
    }

    $(eListings).html(html);
}


function getUserProductsSuccess(response, status, xhr) {
    let html = '';
    for (product of response) {
        const productLender = new ProductLender(product);
        html += productLender.getHtml();
    }

    $(eListings).html(html);


}




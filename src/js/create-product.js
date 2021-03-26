/**********************************************************
Module variables
**********************************************************/
const eForm = $('.form-new-product');

// tab pages
const ePages = {
    category   : $('#form-new-product-page-category'),
    location   : $('#form-new-product-page-location'),
    renterInfo : $('#form-new-product-page-renter-info'),
    photos     : $('#form-new-product-page-photos'),
    nameDesc   : $('#form-new-product-page-name-desc'),
    price      : $('#form-new-product-page-price'),
}


// form inputs
const eInputs = {
    categoryMajor : $('#form-new-product-input-category-major'),
    categoryMinor : $('#form-new-product-input-category-minor'),
    categorySub   : $('#form-new-product-input-category-sub'),
    location      : $('#form-new-product-input-location'),
    photos        : $('#form-new-product-input-photos'),
    name          : $('#form-new-product-input-name'),
    description   : $('#form-new-product-input-description'),
    priceFull     : $('#form-new-product-input-price-full'),
    priceHalf     : $('#form-new-product-input-price-half'),
}

const eTabs    = $('.form-new-product-tabs');
const cInputs  = '.form-new-product-input';
const cBtnStep = '.form-new-product-btn-step';

/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    addEventListeners();
    loadSelect2();
});


/**********************************************************
Adds event listeners to the page elements
**********************************************************/
function addEventListeners() {
    $(eInputs.categoryMajor).on('change', function() {
        updateMinorCategory(this);
    });
    
    $(eInputs.categoryMinor).on('change', function() {
        updateSubCategory(this);
    });
    
    $(cBtnStep).on('click', function() {
        stepToFormPage(this);
    });
}


/**********************************************************
Update the minor categories to show the ones that belong 
to the selected major category.
**********************************************************/
function updateMinorCategory() {
    const majorCategoryID = $(eInputs.categoryMajor).find('option:selected').attr('data-id');
    
    alert(majorCategoryID);
    
    // hide all the minor and sub categories initially
    $(eInputs.categoryMinor).prop('disabled', false);
    $(eInputs.categorySub).prop('disabled', true);
    $(eInputs.categorySub).find('option').hide();
    $(eInputs.categoryMinor).find('option').hide();
    
    // show only the minor categories that belong to the major category
    $(eInputs.categoryMinor).find(`option[data-parent-category="${majorCategoryID}"]`).removeClass('d-none');
}

/**********************************************************
Update the sub categories to show the ones that belong 
to the selected minor category.
**********************************************************/
function updateSubCategory() {
    const minorCategoryID = $(eInputs.categoryMinor).find('option:selected').attr('data-id');
    
    // hide all the minor categories initially
    $(eInputs.categorySub).prop('disabled', false);
    $(eInputs.categorySub).find('option').addClass('d-none');
    
    // show only the minor categories that belong to the major category
    $(eInputs.categorySub).find(`option[data-parent-category="${minorCategoryID}"]`).removeClass('d-none');
}

/**********************************************************
Prepends a hidden option that says "Choose..." to the 
category element arguement.
**********************************************************/
function addInitialOptionToCategorySelectElement(a_eCategory) {
    const html = '<option selected disabled class="d-none">Choose...</option>';
    $(a_eCategory).prepend(html).val('Choose...');
}


/**********************************************************
Step to another form page.

Go to the page number indicated by the argument's 
data-page-location attribute.
**********************************************************/
function stepToFormPage(a_eBtnStep) {
    const destinationPageNumber = $(a_eBtnStep).attr('data-page-location');
    $(eTabs).find(`li:nth-child(${destinationPageNumber}) a`).tab('show');
}

/**********************************************************
Loads the select2 library on the location input
**********************************************************/
function loadSelect2() {
    $(eInputs.location).select2({
        minimumInputLength: 3,
        ajax: {
            delay: 100,
            url: ApiWrapper.URLS.SEARCH.LOCATIONS,
            data: function (params) {
                const urlParms = {      // set the request url ?parms
                    q: params.term,
                }                
                return urlParms;
            },
            processResults: function (data) {
                const processedResults = processLocationSearchApiResponse(data);
                return processedResults;
            }
        },
        
    });
}

/**********************************************************
Process the api response data for the location search request.

It is transformed into the recognized format for select2.
**********************************************************/
function processLocationSearchApiResponse(apiResponse) {
    let processedData = [];
    for (let count = 0; count < apiResponse.length; count++) {
        const location = apiResponse[count];
        const text = `${location.city}, ${location.state_name}`;
        processedData.push({id: location.id, text: text});
    }

    return ({results: processedData});
}





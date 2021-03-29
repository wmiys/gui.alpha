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

const eButtons = {
    submit: $('.form-new-product-btn-submit'),
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

    ApiWrapper.requestGetProductCategoriesMajor(loadMajorCategoriesSuccess, loadMajorCategoriesError);
});


/**********************************************************
Adds event listeners to the page elements
**********************************************************/
function addEventListeners() {
    $(eInputs.categoryMajor).on('change', function() {
        const majorCategoryID = $(eInputs.categoryMajor).find('option:selected').val();
        ApiWrapper.requestGetProductCategoriesMinor(majorCategoryID, loadMinorCategoriesSuccess, console.error);
    });
    
    $(eInputs.categoryMinor).on('change', function() {
        const majorCategoryID = $(eInputs.categoryMajor).find('option:selected').val();
        const minorCategoryID = $(eInputs.categoryMinor).find('option:selected').val();
        ApiWrapper.requestGetProductCategoriesSub(majorCategoryID, minorCategoryID, loadSubCategoriesSuccess, console.error);
    });
    
    $(cBtnStep).on('click', function() {
        stepToFormPage(this);
    });
    
    $(eButtons.submit).on('click', function() {
        submitFormEvent();
    });
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
        theme: 'bootstrap4',
        ajax: {
            delay: 250,
            url: ApiWrapper.URLS.SEARCH.LOCATIONS,
            placeholder: "Select a state",
            allowClear: true,
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


/**********************************************************
Load the major categories into the select element
**********************************************************/
function loadMajorCategoriesSuccess(result,status,xhr) {
    let html = '';
    for (majorCategory of result) {
        html += `<option value="${majorCategory.id}">${majorCategory.name}</option>`;
    }

    $(eInputs.categoryMajor).prop('disabled', false).html(html);
}


/**********************************************************
Error fetching the major categories
**********************************************************/
function loadMajorCategoriesError(xhr, status, error) {
    console.log(result);
    console.log(status);
    console.log(error);

    enableSubmitButton();
    Utilities.displayAlert('Error loading major categories');
}


/**********************************************************
Update the minor categories to show the ones that belong 
to the selected major category.
**********************************************************/
function loadMinorCategoriesSuccess(result,status,xhr) {
    let html = '';
    for (minorCategory of result) {
        html += `<option value="${minorCategory.id}">${minorCategory.name}</option>`;
    }

    $(eInputs.categoryMinor).prop('disabled', false).html(html).val('');
}

/**********************************************************
Load the sub categories based on the minor category
**********************************************************/
function loadSubCategoriesSuccess(result, status, xhr) {
    let html = '';
    for (subCategory of result) {
        html += `<option value="${subCategory.id}">${subCategory.name}</option>`;
    }

    $(eInputs.categorySub).prop('disabled', false).html(html).val('');
}

/**********************************************************
Actions to take to send the create prodcut request.
**********************************************************/
function submitFormEvent() {
    const values = getInputValues();
    let formData = new FormData();

    formData.append("name", values.name);
    formData.append('name', values.name);
    formData.append('description', values.description);
    formData.append('product_categories_sub_id', values.categorySub);
    formData.append('location_id', values.location);
    formData.append('price_full', values.priceFull);
    formData.append('price_half', values.priceHalf);
    formData.append('image', $(eInputs.photos).prop('files')[0]);

    ApiWrapper.requestPostProduct(formData, console.log, console.error);
}

/**********************************************************
Returns an object containing all the new prodcut form
input values.
**********************************************************/
function getInputValues() {
    const inputKeys = Object.keys(eInputs);
    let inputValues = {};
    
    for (let count = 0; count < inputKeys.length; count++) {
        const key = inputKeys[count];
        inputValues[key] = $(eInputs[key]).val();
    }
    
    return inputValues;
}
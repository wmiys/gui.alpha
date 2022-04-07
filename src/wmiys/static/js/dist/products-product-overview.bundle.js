(function(){'use strict';// LocalStorage.validateStatus();  // be sure user is loggen in

/**********************************************************
Module variables
**********************************************************/
$('.form-new-product');

// tab pages
({
    category   : $('#form-new-product-page-category'),
    location   : $('#form-new-product-page-location'),
    renterInfo : $('#form-new-product-page-renter-info'),
    photos     : $('#form-new-product-page-photos'),
    nameDesc   : $('#form-new-product-page-name-desc'),
    price      : $('#form-new-product-page-price'),
});

// form inputs
const eInputs = {
    categoryMajor    : $('#form-new-product-input-category-major'),
    categoryMinor    : $('#form-new-product-input-category-minor'),
    categorySub      : $('#form-new-product-input-category-sub'),
    location         : $('#form-new-product-input-location'),
    dropoffDistance  : $('#form-new-product-input-dropoff-distance'),
    coverPhoto       : $('#form-new-product-input-cover-photo'),
    productImages    : $('#form-new-product-input-photos'),
    name             : $('#form-new-product-input-name'),
    description      : $('#form-new-product-input-description'),
    priceFull        : $('#form-new-product-input-price-full'),
    minimumAge       : $('#form-new-product-input-minimum-age'),
};

// buttons
const eButtons = {
    submit: $('.form-new-product-btn-submit'),
    resetCategories: $('#form-new-product-btn-category-reset'),
    removeImage: $('#form-new-product-btn-image-change'),
    formSteps: {
        prev: $('#form-new-product-btn-step-prev'),
        next: $('#form-new-product-btn-step-next'),
    },
    saveImg: {
        cover: '#form-new-product-btn-save-img-cover',
        imgs: '#form-new-product-btn-save-img-imgs',
    },
    
};

// form tabs
const eTabs    = $('.form-new-product-tabs');

const eProgressBar = $('.progress .progress-bar');

// classes
const cInputs  = '.form-new-product-input';
const cBtnStep = '.form-new-product-btn-step';


let filePondCover = null;
let filePondImages = null;

const mProductID = UrlParser.getPathValue(1);   // the product id found in the url: /products/42



let descriptionTextEditor = null;


/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    $('#product-edit-navbar-tab-edit').addClass('active');
    loadSelect2();
    registerFilePondExtensions();
    initProductCoverImagePlugin();
    loadProductImagesPlugin();
    checkIfCategoriesAreSet();
    addEventListeners();
    initPell();
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
    
    $(cInputs).on('keydown change', function() {
        removeInvalidClass(this);
    });

    $(eButtons.submit).on('click', function() {
        submitFormEvent();
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        setNewStepButtonLocations(e.target);
        submitFormEvent();
    });

    $(eButtons.resetCategories).on('click', function() {
        resetProductCategories();
    });

    $(eButtons.saveImg.cover).on('click', function() {
        saveCoverImage();
    });

    $(eButtons.saveImg.imgs).on('click', function() {
        // saveProductImages();
        uploadNewProductImages();
    });

    filePondCover.on('updatefiles', function(error, file) {
        handleCoverPhotoEdit();
    });
}

/**********************************************************
Registers all of the FilePond extensions.
Need to do this for the FilePond instantiations to work.
**********************************************************/
function registerFilePondExtensions() {
    FilePond.registerPlugin(FilePondPluginFileValidateType);
    FilePond.registerPlugin(FilePondPluginImagePreview);
    FilePond.registerPlugin(FilePondPluginImageValidateSize);
}

/**********************************************************
Load the file selector plugin for the cover photo
**********************************************************/
function initProductCoverImagePlugin() {
    const inputElement = document.querySelector(Utilities.getJqueryElementID(eInputs.coverPhoto));
    
    filePondCover = FilePond.create(inputElement, {
        allowImagePreview: true,
        allowFileTypeValidation: true,
        acceptedFileTypes: ['image/*'],
        // imageValidateSizeMinWidth: 1200,
        // imageValidateSizeMinHeight: 800,
        credits: false,
    });

    displayInitialCoverPhoto();
}


function displayInitialCoverPhoto() {
    const currentImgUrl = $(Utilities.getJqueryElementID(eInputs.coverPhoto)).closest('.form-group-image').attr('data-img-src');

    if (currentImgUrl == "-1") {
        return;
    }

    const pondImage = {
        source: currentImgUrl,
        options: {type: 'remote'},
    };

    filePondCover.addFiles([pondImage]);   
}

/**********************************************************
Load the file selector plugin for the product images.
Then, try to fetch the product images.
**********************************************************/
function loadProductImagesPlugin() {    
    const inputElement = document.querySelector(Utilities.getJqueryElementID(eInputs.productImages));

    filePondImages = FilePond.create(inputElement, {
        // files: files,
        allowMultiple: true,
        allowImagePreview: true,
        allowReorder: true,
        maxFiles: 5,
        allowFileTypeValidation: true,
        acceptedFileTypes: ['image/*'],
        credits: false,
    });

    ApiWrapper.requestGetProductImages(mProductID, getProductImagesSuccess, getProductImagesError); 
}

/**********************************************************
Callback for a successful GET for loadProductImagesPlugin.
Transforms the response data into FilePond 'readable' objects.
Then insert them into the filepond input so the user can see them.
**********************************************************/
function getProductImagesSuccess(response, status, xhr) {
    const files = [];


    for (const img of response) {
        files.push({
            source: img.file_name,
            options: {type: 'remote'},
        });
    }

    filePondImages.addFiles(files);
}

/**********************************************************
Callback for an error encountered in the GET for loadProductImagesPlugin.
**********************************************************/
function getProductImagesError(xhr, status, error) {
    console.error('getProductImagesError');
    console.error(xhr);
    console.error(status);
    console.error(error); 
}


/**********************************************************
Loads the select2 library on the location input
**********************************************************/
function loadSelect2() {
    $(eInputs.location).select2({
        minimumInputLength: 3,
        theme: 'bootstrap4',
        ajax: {
            delay: 150,
            url: ApiWrapper.URLS.SEARCH.LOCATIONS,
            placeholder: "Select a state",
            allowClear: true,
            data: function (params) {
                const urlParms = {      // set the request url ?parms
                    q: params.term,
                };                
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
Setup the description textarea editor
**********************************************************/
function initPell() {
    // save the description text and clear it from the screen
    const initialText = $(eInputs.description).text();
    $(eInputs.description).text('');


    // init the pell library
    const editor = document.getElementById($(eInputs.description)[0].id);
    
    descriptionTextEditor = window.pell.init({
        element: editor,
        onChange: (html) => {
            console.log(html);
        },
        actions: [
            'bold',
            'italic',
            'underline',
            'strikethrough',
            // 'heading1',
            // 'heading2',
            'olist',
            'ulist',
        ],
    });

    editor.content.innerHTML = initialText;
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
Load the major category options if the category fields
are not set.
**********************************************************/
function checkIfCategoriesAreSet() {
    const subVal = $(eInputs.categorySub).val();

    if (subVal.length == 0) {
        ApiWrapper.requestGetProductCategoriesMajor(loadMajorCategoriesSuccess, loadMajorCategoriesError);
    }
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
    $(eInputs.categoryMajor).selectpicker('refresh');
}


/**********************************************************
Error fetching the major categories
**********************************************************/
function loadMajorCategoriesError(xhr, status, error) {
    console.error(xhr);
    console.error(status);
    console.error(error);
    
    enableSubmitButton();
    // Utilities.displayAlert('Error loading major categories');
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
    $(eInputs.categoryMinor).selectpicker('refresh');
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
    $(eInputs.categorySub).selectpicker('refresh');
}

/**********************************************************
Actions to take to send the create prodcut request.
**********************************************************/
function submitFormEvent() {    
    // disableSubmitButton();

    const values = getInputValues(); 
       
    let formData = new FormData();
    
    formData.append("name", values.name);
    formData.append('description', values.description);
    formData.append('product_categories_sub_id', values.categorySub);
    formData.append('location_id', values.location);
    formData.append('dropoff_distance', values.dropoffDistance);
    formData.append('price_full', values.priceFull);
    formData.append('minimum_age', values.minimumAge);

    ApiWrapper.requestPutProduct(mProductID, formData, function() {
        $(eButtons.saveImg.cover).prop('disabled', true);
    }, submitFormEventError);
}

/**********************************************************
Update the cover image file in the database.
**********************************************************/
function saveCoverImage() {
    let imageFile = filePondCover.getFile();

    if (imageFile == null) {
        return;
    }

    let formData = new FormData();
    formData.append('image', imageFile.file);

    ApiWrapper.requestPutProduct(mProductID, formData);
}


/**********************************************************
User want's to upload new product images.

1. First, send a request to delete all of the existing product images.
2. Then, upload the new ones.
**********************************************************/
function uploadNewProductImages() {
    disableProductImagesSaveButton();

    ApiWrapper.requestDeleteProductImages(mProductID, saveProductImages, enableProductImagesSaveButton);
}

/**********************************************************
Send an API request to create the new product images.
**********************************************************/
function saveProductImages() {
    const formData = new FormData();

    let files = filePondImages.getFiles();

    for (const f of files) {
        formData.append(f.file.name, f.file);
    }

    ApiWrapper.requestPostProductImages(mProductID, formData, enableProductImagesSaveButton, enableProductImagesSaveButton);
}

/**********************************************************
Disables the save button when loading the product images.
**********************************************************/
function disableProductImagesSaveButton() {
    const buttonWidth = $(eButtons.saveImg.imgs).width();
    const originalText = $(eButtons.saveImg.imgs).text();
    $(eButtons.saveImg.imgs).html(CommonHtml.spinnerSmall).width(buttonWidth).prop('disabled', true).attr('data-normal-text', originalText);
}

/**********************************************************
Enables the save button for product images.
**********************************************************/
function enableProductImagesSaveButton() {
    const originalText = $(eButtons.saveImg.imgs).attr('data-normal-text');
    $(eButtons.saveImg.imgs).text(originalText).prop('disabled', false);
}


/**********************************************************
When the cover photo input is changed, disable/enable the save button.

If no files are present, disable it.
Otherwise, allow users to save the new photo.

This was made because we want users to have cover photos.
Also, I don't want to send an empty file to the api.
**********************************************************/
function handleCoverPhotoEdit() {
    let imageFile = filePondCover.getFile();

    if (imageFile != null) {
        $(eButtons.saveImg.cover).prop('disabled', false);
    } else {
        $(eButtons.saveImg.cover).prop('disabled', true); 
    }
}


/**********************************************************
Returns an object containing all the new prodcut form input values.
**********************************************************/
function getInputValues() {
    const inputKeys = Object.keys(eInputs);
    let inputValues = {};
    
    for (let count = 0; count < inputKeys.length; count++) {
        const key = inputKeys[count];

        if (key != 'description') {
            inputValues[key] = $(eInputs[key]).val();
        } else {
            const descriptionText = $(descriptionTextEditor).find('.pell-content').html().trim();
            inputValues[key] = descriptionText;
        }
    }
    
    return inputValues;
}

/**********************************************************
Remove the .is-invalid class from an element.
**********************************************************/
function removeInvalidClass(eInputElement) {
    $(eInputElement).closest('.form-group').find('.is-invalid').removeClass('is-invalid');
} 

/**********************************************************
Actions to take if the create product request was not successful.
**********************************************************/
function submitFormEventError(xhr, status, error) {
    // Utilities.displayAlert('There was an error. Please try again.');

    console.error('submitFormEventError');
    console.error(xhr);
    console.error(status);
    console.error(error); 
    
    enableSubmitButton();
}

/**********************************************************
Enable the submit button
**********************************************************/
function enableSubmitButton() {
    $(eButtons.submit).html('Save').prop('disabled', false);
}


/**********************************************************
Set the next/prev form step button location values.

Parms:
    eActiveFormTab - the newly shown tab
**********************************************************/
function setNewStepButtonLocations(eActiveFormTab) {
    const prevLocation = $(eActiveFormTab).attr('data-step-prev');
    const nextLocation = $(eActiveFormTab).attr('data-step-next');

    $(eButtons.formSteps.prev).attr('data-page-location', prevLocation);

    // show/hide the submit button if it's the final page
    if (nextLocation != 'submit') {
        // not the submit page
        $(eButtons.formSteps.next).attr('data-page-location', nextLocation);
        $(eButtons.formSteps.next).removeClass('d-none');
        $(eButtons.submit).addClass('d-none');
        $(eButtons.formSteps.next).prop('disabled', false);
    } else {
        // submit page
        // $(eButtons.formSteps.next).addClass('d-none');
        // $(eButtons.submit).removeClass('d-none');
        $(eButtons.formSteps.next).prop('disabled', true);
    }
}


/**********************************************************
Step to another form page.

Go to the page number indicated by the argument's 
data-page-location attribute.
**********************************************************/
function stepToFormPage(a_eBtnStep) {
    const destinationPageNumber = $(a_eBtnStep).attr('data-page-location');
    $(eTabs).find(`li:nth-child(${destinationPageNumber}) a`).tab('show');

    // set the progress bar width - target page number / total number of pages (6)
    const numTabs = $(eTabs).find('.nav-link').length;
    const newProgressWidth = (destinationPageNumber / numTabs) * 100;
    $(eProgressBar).width(`${newProgressWidth}%`);
}


/**********************************************************
Clear the categories dropdowns and refresh
**********************************************************/
function resetProductCategories() {
    $(eInputs.categoryMajor).find('option').remove();
    $(eInputs.categoryMinor).find('option').remove();
    $(eInputs.categorySub).find('option').remove();

    ApiWrapper.requestGetProductCategoriesMajor(loadMajorCategoriesSuccess, loadMajorCategoriesError);

    $('.selectpicker').selectpicker('refresh');
}})();//# sourceMappingURL=products-product-overview.bundle.js.map

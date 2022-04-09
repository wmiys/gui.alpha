import { ApiWrapper }      from "../../../classes/API-Wrapper";
import { CommonHtml }      from "../../../classes/Common-Html";
import { UrlParser }       from "../../../classes/UrlParser";
import { Utilities }       from "../../../classes/Utilities";
import { BaseReturn } from "../../../classes/return-structures";

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
}

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
    
}

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
    $(eInputs.categoryMajor).on('change', renderMinorCategoriesForCurrentMajor);
    $(eInputs.categoryMinor).on('change', renderSubCategoriesForCurrentMinor);
    
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
    }

    filePondCover.addFiles([pondImage]);   
}

/**********************************************************
Load the file selector plugin for the product images.
Then, try to fetch the product images.
**********************************************************/
async function loadProductImagesPlugin() {    
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


    const fetchResult = await fetchProductImages();
    if (!fetchResult.successful) {
        getProductImagesError(fetchResult.error);
    }
    else {
        getProductImagesSuccess(fetchResult.data);
    }

}

/**
 * Fetch the product images from the api
 * 
 * @returns {BaseReturn} the base return
 */
async function fetchProductImages() {
    const result = new BaseReturn(true);

    // fetch the image urls from the api
    const apiResponse = await ApiWrapper.requestGetProductImages(mProductID);

    if (!apiResponse.ok) {
        result.successful = false;
        result.error = await apiResponse.text();
        return result;
    }

    let images = null;
    try {
        images = await apiResponse.json();
    }
    catch (exception) {
        result.successful = false;
        result.error = exception;
    }
    finally {
        result.data = images;
    }


    return result;
}



/**********************************************************
Callback for a successful GET for loadProductImagesPlugin.
Transforms the response data into FilePond 'readable' objects.
Then insert them into the filepond input so the user can see them.
**********************************************************/
function getProductImagesSuccess(images) {
    const files = [];

    for (const img of images) {
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
function getProductImagesError(error) {
    console.error('getProductImagesError');
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
async function checkIfCategoriesAreSet() {
    const subVal = $(eInputs.categorySub).val();

    if (subVal.length != 0) {
        return;
    }

    loadMajorCatetories();
}

/**********************************************************
Clear the categories dropdowns and refresh
**********************************************************/
async function resetProductCategories() {
    $(eInputs.categoryMajor).find('option').remove();
    $(eInputs.categoryMinor).find('option').remove();
    $(eInputs.categorySub).find('option').remove();

    await loadMajorCatetories();

    $('.selectpicker').selectpicker('refresh');
}

/**********************************************************
Load the major category html option elements
**********************************************************/
async function loadMajorCatetories() {
    const apiResponse = await ApiWrapper.requestGetProductCategoriesMajor();

    if (apiResponse.ok) {
        const categories = await apiResponse.json();
        loadMajorCategoriesSuccess(categories);
    }
    else {
        loadMajorCategoriesError(await apiResponse.text());
    }
}

/**********************************************************
Load the major categories into the select element
**********************************************************/
function loadMajorCategoriesSuccess(majorCategories) {
    let html = '';
    for (const majorCategory of majorCategories) {
        const value = `value="${majorCategory.id}"`;
        html += `<option ${value}>${majorCategory.name}</option>`;
    }
    
    $(eInputs.categoryMajor).prop('disabled', false).html(html);
    $(eInputs.categoryMajor).selectpicker('refresh');
}


/**********************************************************
Error fetching the major categories
**********************************************************/
function loadMajorCategoriesError(error) {
    console.error(error);
    enableSubmitButton();
}

/**********************************************************
Fetch the minor categories of the currently selected major category
**********************************************************/
async function renderMinorCategoriesForCurrentMajor() {
    // fetch the categories from the api
    const majorCategoryID = getCurrentMajorCategoryValue();
    const categories = await fetchMajorCategoryChildren(majorCategoryID);

    // display them
    loadMinorCategoriesSuccess(categories);
}

/**********************************************************
Fetch all the minor categories that belong to the speicifed major category
**********************************************************/
async function fetchMajorCategoryChildren(majorCategoryID) {
    let minorCategories = [];

    const apiResponse = await ApiWrapper.requestGetProductCategoriesMinor(majorCategoryID);
    if (!apiResponse.ok) {
        console.error(await apiResponse.text());
        return minorCategories;
    }

    try {
        minorCategories = await apiResponse.json();
    }
    catch (exception) {
        console.error(exception);
        minorCategories = [];
    }

    return minorCategories;
}

/**********************************************************
Update the minor categories to show the ones that belong to the selected major category.
**********************************************************/
function loadMinorCategoriesSuccess(minorCategories) {
    let html = '';
    for (const minorCategory of minorCategories) {
        const value = `value="${minorCategory.id}"`;
        html += `<option ${value}>${minorCategory.name}</option>`;
    }
    
    $(eInputs.categoryMinor).prop('disabled', false).html(html).val('');
    $(eInputs.categoryMinor).selectpicker('refresh');
}



/**********************************************************
Fetch the sub categories that belong to the currently selected minor category
**********************************************************/
async function renderSubCategoriesForCurrentMinor() {
    // get the values of the currently selected major and minor category elements
    const majorCategoryID = getCurrentMajorCategoryValue();
    const minorCategoryID = getCurrentMinorCategoryValue();

    // fetch the sub categories from the api
    const subCategories = await fetchSubCategories(majorCategoryID, minorCategoryID);

    // render them
    loadSubCategoriesSuccess(subCategories);
}

/**********************************************************
Fetch all the minor categories that belong to the speicifed major category
**********************************************************/
async function fetchSubCategories(parentMajorCategoryID, parentMinorCategoryID) {
    let subCategories = [];

    const apiResponse = await ApiWrapper.requestGetProductCategoriesSub(parentMajorCategoryID, parentMinorCategoryID);
    if (!apiResponse.ok) {
        console.error(await apiResponse.text());
        return subCategories;
    }

    try {
        subCategories = await apiResponse.json();
    }
    catch (exception) {
        console.error(exception);
        subCategories = [];
    }

    return subCategories;
}

/**********************************************************
Load the sub categories based on the minor category
**********************************************************/
function loadSubCategoriesSuccess(result, status, xhr) {
    let html = '';
    for (const subCategory of result) {
        html += `<option value="${subCategory.id}">${subCategory.name}</option>`;
    }
    
    $(eInputs.categorySub).prop('disabled', false).html(html).val('');
    $(eInputs.categorySub).selectpicker('refresh');
}


/**********************************************************
Get the value of the currently selected major category element
**********************************************************/
function getCurrentMajorCategoryValue() {
    return $(eInputs.categoryMajor).find('option:selected').val();
}

/**********************************************************
Get the value of the currently selected minor category element
**********************************************************/
function getCurrentMinorCategoryValue() {
    return $(eInputs.categoryMinor).find('option:selected').val();
}

/**********************************************************
Actions to take to send the create prodcut request.
**********************************************************/
async function submitFormEvent() {    
    disableSubmitButton();

    const values = getInputValuesWithApiKeys();
    const apiResponse = await ApiWrapper.requestPutProduct(mProductID, values);

    if (apiResponse.ok) {
        $(eButtons.saveImg.cover).prop('disabled', true);
    }
    else {
        submitFormEventError(await apiResponse.text());
    }
}

/**********************************************************
Update the cover image file in the database.
**********************************************************/
async function saveCoverImage() {
    const imageFile = filePondCover.getFile();

    if (imageFile == null) {
        return;
    }

    const productImageData = {image: imageFile.file};
    const apiResponse = await ApiWrapper.requestPutProduct(mProductID, productImageData);

    if (!apiResponse.ok) {
        console.error(await apiResponse.text());
    }
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
Returns an object containing all the new product form input values with the correct api keys
**********************************************************/
function getInputValuesWithApiKeys() {
    const values = getInputValues(); 

    const correctedApiKeys = {
        name                     : values.name,
        description              : values.description,
        product_categories_sub_id: values.categorySub,
        location_id              : values.location,
        dropoff_distance         : values.dropoffDistance,
        price_full               : values.priceFull,
        minimum_age              : values.minimumAge,
    }

    return correctedApiKeys;
}


/**********************************************************
Returns an object containing all the new product form input values.
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
Validate all the form inputs:

    - Sub category needs a value
    - location needs a value
    - name needs a value
    - full day price needs a value
    - full day price needs to be > 0
    - half day price needs a value
    - half day price needs to be > 0

Returns a bool:
    true - all inputs are valid
    false - an input is not valid
**********************************************************/
function validateForm() {

    let areInputsValid = true;

    if (!validateInputCategorySub()) {
        areInputsValid = false;
    }
    
    if (!validateInputLocation()) {
        areInputsValid = false;
    }
    
    if (!validateInputName()) {
        areInputsValid = false;
    }
    
    if (!validateInputPriceFull()) {
        areInputsValid = false;
    }
    
    if (!validateInputPriceHalf()) {
        areInputsValid = false;
    }
    
    return areInputsValid;
}

/**********************************************************
Check if the sub category input has a value
**********************************************************/
function validateInputCategorySub() {
    const value = $(eInputs.categorySub).val();

    let result = true;
    
    if (isValueNullOrEmpty(value)) {        
        $(eInputs.categorySub).closest('.form-group').find('.invalid-feedback').text('Required');
        $(eInputs.categorySub).closest('.bootstrap-select').addClass('is-invalid');
        result = false;
    }
    
    return result;
}

/**********************************************************
Check if the location input has a value
**********************************************************/
function validateInputLocation() {
    const value = $(eInputs.location).val();
    
    if (isValueNullOrEmpty(value)) {
        setInputToInvalid($(eInputs.location), 'Required');
        $(eInputs.location).closest('.input-group').addClass('is-invalid');
        return false;
    }
    
    return true;
}

/**********************************************************
Check if the name input has a value
**********************************************************/
function validateInputName() {
    const value = $(eInputs.name).val();
    
    if (isValueNullOrEmpty(value)) {
        setInputToInvalid($(eInputs.name), 'Required');
        return false;
    }
    
    return true;
}

/**********************************************************
Check if the full day price input has a value
**********************************************************/
function validateInputPriceFull() {
    const value = $(eInputs.priceFull).val();

    let result = true;
    
    // has value
    if (isValueNullOrEmpty(value)) {
        setInputToInvalid($(eInputs.priceFull), 'Required');
        $(eInputs.priceFull).closest('.input-group').addClass('is-invalid');
        return false;
    }
    
    // is valid double > 0
    if (!isValueValidPrice(value)) {
        setInputToInvalid($(eInputs.priceFull), 'Must be greater than 0');
        $(eInputs.priceFull).closest('.input-group').addClass('is-invalid');
        result = false;
    }
    
    return result;
}

/**********************************************************
Check if the argument is a valid double and is > 0
**********************************************************/
function isValueValidPrice(value) {
    const valueAsDouble = parseFloat(value);

    let result = true;
    
    if (isNaN(valueAsDouble)) {         // is a valid float
        result = false;
    } else if (valueAsDouble <= 0) {    // is > 0
        result = false;
    }
    
    return result;
}


/**********************************************************
Checks if the argument is either null or an empty string
**********************************************************/
function isValueNullOrEmpty(value) {
    let result = false;
    
    if (value == "" || value == null) {
        result = true;
    }
    
    return result;
}


/**********************************************************
Sets the eInput to invalid and displays the text as the message.
**********************************************************/
function setInputToInvalid(eInput, text = 'Required') {
    $(eInput).closest('.form-group').find('.invalid-feedback').text(text);
    $(eInput).addClass('is-invalid');
}

/**********************************************************
Remove the .is-invalid class from an element.
**********************************************************/
function removeInvalidClass(eInputElement) {
    $(eInputElement).closest('.form-group').find('.is-invalid').removeClass('is-invalid');
} 

/**********************************************************
Actions to take if the create product request was successful.
**********************************************************/
function submitFormEventSuccess(response, status, xhr) {
    enableSubmitButton();
}

/**********************************************************
Actions to take if the create product request was not successful.
**********************************************************/
function submitFormEventError(error) {
    console.error('submitFormEventError');
    console.error(error); 

    enableSubmitButton();
}

/**********************************************************
Disable the submit button and add a spinner.
**********************************************************/
function disableSubmitButton() {
    $(eButtons.submit).prepend(CommonHtml.spinnerSmall + '&nbsp;&nbsp;').prop('disabled', true);
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
Remove the existing image display
Show the image file input
**********************************************************/
function removeImage() {
    // hide the existing image elements
    $('#existing-product-image').addClass('d-none');
    $(eButtons.removeImage).addClass('d-none');

    // show the file input
    $('.form-group-image').removeClass('d-none');
}


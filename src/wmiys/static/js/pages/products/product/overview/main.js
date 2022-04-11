import { ApiWrapper } from "../../../../classes/API-Wrapper";
import { UrlParser }  from "../../../../classes/UrlParser";
import { Utilities }  from "../../../../classes/Utilities";
import { BaseReturn } from "../../../../classes/return-structures";
import { OverviewForm } from "./product-overview-form";


/**********************************************************
Constants
**********************************************************/

/**
 * Filepond configurations
 */
const DEFAULT_FILEPOND_CONFIG = {
    COVER: {
        allowImagePreview: true,
        allowFileTypeValidation: true,
        acceptedFileTypes: ['image/*'],
        // imageValidateSizeMinWidth: 1200,
        // imageValidateSizeMinHeight: 800,
        credits: false,
    },

    IMAGES: {
        // files: files,
        allowMultiple: true,
        allowImagePreview: true,
        allowReorder: true,
        maxFiles: 5,
        allowFileTypeValidation: true,
        acceptedFileTypes: ['image/*'],
        credits: false,
    }
}

/**********************************************************
Module variables
**********************************************************/
const eTabs           = $('.form-new-product-tabs');
const eProgressBar    = $('.progress .progress-bar');
let   mFilePondCover  = null;
let   mFilePondImages = null;
const mProductID      = UrlParser.getPathValue(1);     // the product id found in the url: /products/42


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
    OverviewForm.initPellTextEditor();
});


/**********************************************************
Adds event listeners to the page elements
**********************************************************/
function addEventListeners() {
    $(OverviewForm.Inputs.CATEGORY_MAJOR).on('change', renderMinorCategoriesForCurrentMajor);
    $(OverviewForm.Inputs.CATEGORY_MINOR).on('change', renderSubCategoriesForCurrentMinor);
    $(OverviewForm.Buttons.RESET_CATEGORIES).on('click', resetProductCategories);
    $(OverviewForm.Buttons.SAVE_IMAGE.COVER).on('click', saveCoverImage);
    $(OverviewForm.Buttons.SAVE_IMAGE.IMAGES).on('click', uploadNewProductImages);
    mFilePondCover.on('updatefiles', handleCoverPhotoEdit);
    $(OverviewForm.Buttons.SUBMIT).on('click', submitFormEvent);
    
    $(OverviewForm.Classes.BTN_STEP).on('click', function() {
        stepToFormPage(this);
    });
    
    $(OverviewForm.Classes.INPUTS).on('keydown change', function() {
        removeInvalidClass(this);
    });

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        setNewStepButtonLocations(e.target);
        submitFormEvent();
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
    const inputElement = document.querySelector(Utilities.getJqueryElementID(OverviewForm.Inputs.COVER_PHOTO));
    mFilePondCover = FilePond.create(inputElement, DEFAULT_FILEPOND_CONFIG.COVER);
    displayInitialCoverPhoto();
}

/**********************************************************
Display the initial cover photo
**********************************************************/
function displayInitialCoverPhoto() {
    const currentImgUrl = getCurrentCoverPhotoUrl();

    if (currentImgUrl == "-1") {
        return;
    }

    const pondImage = {
        source: currentImgUrl,
        options: {type: 'remote'},
    }

    mFilePondCover.addFiles([pondImage]);   
}

/**********************************************************
Get the current cover photo url
**********************************************************/
function getCurrentCoverPhotoUrl() {
    const eCoverPhoto = $(Utilities.getJqueryElementID(OverviewForm.Inputs.COVER_PHOTO));
    const currentImgUrl = $(eCoverPhoto).closest('.form-group-image').attr('data-img-src');
    return currentImgUrl;
}

/**********************************************************
Load the file selector plugin for the product images.
Then, try to fetch the product images.
**********************************************************/
async function loadProductImagesPlugin() {    
    const inputElement = document.querySelector(Utilities.getJqueryElementID(OverviewForm.Inputs.PRODUCT_IMAGES));
    mFilePondImages = FilePond.create(inputElement, DEFAULT_FILEPOND_CONFIG.IMAGES);

    const fetchResult = await fetchProductImages();
    
    if (fetchResult.successful) {
        getProductImagesSuccess(fetchResult.data);
    }
    else {
        getProductImagesError(fetchResult.error);
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

    mFilePondImages.addFiles(files);
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
    $(OverviewForm.Inputs.LOCATION).select2({
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
    const subcategoryValue = $(OverviewForm.Inputs.CATEGORY_SUB).val();

    if (subcategoryValue.length != 0) {
        return;
    }

    loadMajorCatetories();
}

/**********************************************************
Clear the categories dropdowns and refresh
**********************************************************/
async function resetProductCategories() {
    $(OverviewForm.Inputs.CATEGORY_MAJOR).find('option').remove();
    $(OverviewForm.Inputs.CATEGORY_MINOR).find('option').remove();
    $(OverviewForm.Inputs.CATEGORY_SUB).find('option').remove();

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
    
    $(OverviewForm.Inputs.CATEGORY_MAJOR).prop('disabled', false).html(html);
    $(OverviewForm.Inputs.CATEGORY_MAJOR).selectpicker('refresh');
}


/**********************************************************
Error fetching the major categories
**********************************************************/
function loadMajorCategoriesError(error) {
    console.error(error);
    OverviewForm.enableSubmitButton();
}

/**********************************************************
Fetch the minor categories of the currently selected major category
**********************************************************/
async function renderMinorCategoriesForCurrentMajor() {
    // fetch the categories from the api
    const majorCategoryID = OverviewForm.getCurrentMajorCategoryValue();
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
    
    $(OverviewForm.Inputs.CATEGORY_MINOR).prop('disabled', false).html(html).val('');
    $(OverviewForm.Inputs.CATEGORY_MINOR).selectpicker('refresh');
}



/**********************************************************
Fetch the sub categories that belong to the currently selected minor category
**********************************************************/
async function renderSubCategoriesForCurrentMinor() {
    // get the values of the currently selected major and minor category elements
    const majorCategoryID = OverviewForm.getCurrentMajorCategoryValue();
    const minorCategoryID = OverviewForm.getCurrentMinorCategoryValue();

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
function loadSubCategoriesSuccess(result) {
    let html = '';
    for (const subCategory of result) {
        html += `<option value="${subCategory.id}">${subCategory.name}</option>`;
    }
    
    $(OverviewForm.Inputs.CATEGORY_SUB).prop('disabled', false).html(html).val('');
    $(OverviewForm.Inputs.CATEGORY_SUB).selectpicker('refresh');
}


/**********************************************************
Actions to take to send the create prodcut request.
**********************************************************/
async function submitFormEvent() {    
    OverviewForm.disableSubmitButton();

    const formValues = OverviewForm.getInputValuesWithApiKeys();
    const apiResponse = await ApiWrapper.requestPutProduct(mProductID, formValues);

    if (apiResponse.ok) {
        $(OverviewForm.Buttons.SAVE_IMAGE.COVER).prop('disabled', true);
    }
    else {
        submitFormEventError(await apiResponse.text());
    }
}

/**********************************************************
Update the cover image file in the database.
**********************************************************/
async function saveCoverImage() {
    const imageFile = mFilePondCover.getFile();

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
async function uploadNewProductImages() {
    OverviewForm.disableProductImagesSaveButton();

    // delete the existing ones
    await ApiWrapper.requestDeleteProductImages(mProductID);

    saveProductImages();
}

/**********************************************************
Send an API request to create the new product images.
**********************************************************/
async function saveProductImages() {
    const images = getProductImageFiles();
    const apiResponse = await ApiWrapper.requestPostProductImages(mProductID, images);

    if (!apiResponse.ok) {
        console.error(await apiResponse.text());
    }

    OverviewForm.enableProductImagesSaveButton();
}

/**
 * Get the list of files in the additional product images
 */
function getProductImageFiles() {
    // create a native object for all the images
    const images = {};
    for (const fileObject of mFilePondImages.getFiles()) {
        images[fileObject.file.name] = fileObject.file;
    }

    return images;
}


/**********************************************************
When the cover photo input is changed, disable/enable the save button.

If no files are present, disable it.
Otherwise, allow users to save the new photo.

This was made because we want users to have cover photos.
Also, I don't want to send an empty file to the api.
**********************************************************/
function handleCoverPhotoEdit() {
    let imageFile = mFilePondCover.getFile();

    if (imageFile != null) {
        $(OverviewForm.Buttons.SAVE_IMAGE.COVER).prop('disabled', false);
    } else {
        $(OverviewForm.Buttons.SAVE_IMAGE.COVER).prop('disabled', true); 
    }
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
function submitFormEventError(error) {
    console.error('submitFormEventError');
    console.error(error); 
    OverviewForm.enableSubmitButton();
}

/**********************************************************
Set the next/prev form step button location values.

Parms:
    eActiveFormTab - the newly shown tab
**********************************************************/
function setNewStepButtonLocations(eActiveFormTab) {
    const prevLocation = $(eActiveFormTab).attr('data-step-prev');
    const nextLocation = $(eActiveFormTab).attr('data-step-next');

    $(OverviewForm.Buttons.FORM_STEPS.PREVIOUS).attr('data-page-location', prevLocation);

    // show/hide the submit button if it's the final page
    if (nextLocation != 'submit') {
        // not the submit page
        $(OverviewForm.Buttons.FORM_STEPS.NEXT).attr('data-page-location', nextLocation);
        $(OverviewForm.Buttons.FORM_STEPS.NEXT).removeClass('d-none');
        $(OverviewForm.Buttons.SUBMIT).addClass('d-none');
        $(OverviewForm.Buttons.FORM_STEPS.NEXT).prop('disabled', false);
    } 
    else {
        $(OverviewForm.Buttons.FORM_STEPS.NEXT).prop('disabled', true);
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


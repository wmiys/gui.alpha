import { CommonHtml } from "../../../../classes/Common-Html";


/**
 * This has all the js selectors for the overview form
 */
export class OverviewForm 
{
    
    /**********************************************************
    Setup the description textarea editor
    **********************************************************/
    static initPellTextEditor() {
        // save the description text and clear it from the screen
        const initialText = $(OverviewForm.Inputs.DESCRIPTION).text();
        $(OverviewForm.Inputs.DESCRIPTION).text('');

        // init the pell library
        const eEditor = document.getElementById($(OverviewForm.Inputs.DESCRIPTION)[0].id);
        
        OverviewForm.eDescriptionTextArea = window.pell.init({
            element: eEditor,
            onChange: (html) => { console.log(html); },
            actions: OverviewForm.PellActionsList,
        });

        eEditor.content.innerHTML = initialText;
    }

    /**********************************************************
    Returns an object containing all the new product form input values with the correct api keys
    **********************************************************/
    static getInputValuesWithApiKeys() {
        const values = OverviewForm.getInputValues(); 

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
    static getInputValues() {
        const values = {
            name           : $(OverviewForm.Inputs.NAME).val(),
            description    : $(OverviewForm.eDescriptionTextArea).find('.pell-content').html().trim(),
            categorySub    : $(OverviewForm.Inputs.CATEGORY_SUB).val(),
            location       : $(OverviewForm.Inputs.LOCATION).val(),
            dropoffDistance: $(OverviewForm.Inputs.DROPOFF_DISTANCE).val(),
            priceFull      : $(OverviewForm.Inputs.PRICE_FULL).val(),
            minimumAge     : $(OverviewForm.Inputs.MINIMUM_AGE).val(),
        }

        return values;
    }

    /**********************************************************
    Get the value of the currently selected major category element
    **********************************************************/
    static getCurrentMajorCategoryValue() {
        return $(OverviewForm.Inputs.CATEGORY_MAJOR).find('option:selected').val();
    }

    /**********************************************************
    Get the value of the currently selected minor category element
    **********************************************************/
    static getCurrentMinorCategoryValue() {
        return $(OverviewForm.Inputs.CATEGORY_MINOR).find('option:selected').val();
    }

    /**********************************************************
    Disables the save button when loading the product images.
    **********************************************************/
    static disableProductImagesSaveButton() {
        const buttonWidth = $(OverviewForm.Buttons.SAVE_IMAGE.IMAGES).width();
        const originalText = $(OverviewForm.Buttons.SAVE_IMAGE.IMAGES).text();
        $(OverviewForm.Buttons.SAVE_IMAGE.IMAGES).html(CommonHtml.spinnerSmall).width(buttonWidth).prop('disabled', true).attr('data-normal-text', originalText);
    }

    /**********************************************************
    Enables the save button for product images.
    **********************************************************/
    static enableProductImagesSaveButton() {
        const originalText = $(OverviewForm.Buttons.SAVE_IMAGE.IMAGES).attr('data-normal-text');
        $(OverviewForm.Buttons.SAVE_IMAGE.IMAGES).text(originalText).prop('disabled', false);
    }

    /**********************************************************
    Disable the submit button and add a spinner.
    **********************************************************/
    static disableSubmitButton() {
        $(OverviewForm.Buttons.SUBMIT).prepend(CommonHtml.spinnerSmall + '&nbsp;&nbsp;').prop('disabled', true);
    }

    /**********************************************************
    Enable the submit button
    **********************************************************/
    static enableSubmitButton() {
        $(OverviewForm.Buttons.SUBMIT).html('Save').prop('disabled', false);
    }


}

/**
 * All the overview form input elements
 */
OverviewForm.Inputs = {
    CATEGORY_MAJOR  : $('#form-new-product-input-category-major'),
    CATEGORY_MINOR  : $('#form-new-product-input-category-minor'),
    CATEGORY_SUB    : $('#form-new-product-input-category-sub'),
    LOCATION        : $('#form-new-product-input-location'),
    DROPOFF_DISTANCE: $('#form-new-product-input-dropoff-distance'),
    COVER_PHOTO     : $('#form-new-product-input-cover-photo'),
    PRODUCT_IMAGES  : $('#form-new-product-input-photos'),
    NAME            : $('#form-new-product-input-name'),
    DESCRIPTION     : $('#form-new-product-input-description'),
    PRICE_FULL      : $('#form-new-product-input-price-full'),
    MINIMUM_AGE     : $('#form-new-product-input-minimum-age'),
}

/**
 * All the button elements
 */
OverviewForm.Buttons = {
    SUBMIT: $('.form-new-product-btn-submit'),
    RESET_CATEGORIES: $('#form-new-product-btn-category-reset'),
    REMOVE_IMAGE: $('#form-new-product-btn-image-change'),
    FORM_STEPS: {
        PREVIOUS: $('#form-new-product-btn-step-prev'),
        NEXT: $('#form-new-product-btn-step-next'),
    },
    SAVE_IMAGE: {
        COVER: '#form-new-product-btn-save-img-cover',
        IMAGES: '#form-new-product-btn-save-img-imgs',
    },
}

/**
 * Some css selectors
 */
OverviewForm.Classes = {
    INPUTS: '.form-new-product-input',
    BTN_STEP: '.form-new-product-btn-step',
    TEXTAREA: '.pell-content',
}


OverviewForm.eDescriptionTextArea = null;

OverviewForm.PellActionsList = [
    'bold',
    'italic',
    'underline',
    'strikethrough',
    'olist',
    'ulist'
];

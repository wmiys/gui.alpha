


export class RequestsSubmittedModal
{
    /**
     * Show the modal
     */
    static show() {
        $(RequestsSubmittedModal.Elements.MODAL).modal('show');
    }

    /**
     * Set the modal to loading state (show the spinner)
     */
    static setDisplayToLoading() {
        $(RequestsSubmittedModal.Elements.MODAL).addClass(RequestsSubmittedModal.Classes.DISPLAY_STATE_LOADING);
    }

    /**
     * Set the modal to display state
     */
    static setDisplayToNormal() {
        $(RequestsSubmittedModal.Elements.MODAL).removeClass(RequestsSubmittedModal.Classes.DISPLAY_STATE_LOADING);
    }

    /** 
     * Set the meta item text 
     */
    static setMetaItemValue(metaItem, value) {
        $(metaItem).find('dd').text(value);
    }

    /** Set the review score value */
    static initReviewScore(reviewScore) {
        $(RequestsSubmittedModal.Elements.REVIEW_INPUTS.SCORE).html('');

        const validScore = RequestsSubmittedModal._getValidReviewScore(reviewScore);

        $(RequestsSubmittedModal.Elements.REVIEW_INPUTS.SCORE).raty({
            path: RequestsSubmittedModal.REVIEW_SCORE_IMAGES_PATH,
            score: validScore,
        });
    }

    /** 
     * Validate the review score 
     */
    static _getValidReviewScore(reviewScore) {
        let validScore = 0;

        try {
            if (reviewScore >= 0 && reviewScore <=5 ) {
                validScore = reviewScore;
            }
        }
        catch (exception) {
            validScore = 0;
        }

        return validScore;
    }

    /** 
     * Set the review comment input value 
     */
    static setReviewComment(text) {
        if (text == null) {
            text = '';
        }

        $(RequestsSubmittedModal.Elements.REVIEW_INPUTS.COMMENT).val(text);
    }
}


RequestsSubmittedModal.Elements = {
    MODAL             : '#modal-requests-submitted',

    REVIEW_INPUTS: {
        SCORE  : '#modal-body-display-review-score-input',
        COMMENT: '#modal-body-display-review-comment-input',
        SUBMIT: '#modal-body-display-review-comment-save',
    },

    META_ITEMS: {
        PRODUCT : '#meta-item-product',
        PRICE   : '#meta-item-price',
        LOCATION: '#meta-item-location',
        STARTS  : '#meta-item-starts-on',
        ENDS    : '#meta-item-ends-on',
        STATUS  : '#meta-item-status',
    }
}

RequestsSubmittedModal.Classes = {
    DISPLAY_STATE_LOADING: 'loading',
    META_CONTAINER       : 'modal-body-display-meta',
    META_ITEM            : 'meta-item',
}

RequestsSubmittedModal.REVIEW_SCORE_IMAGES_PATH = '/static/js/external/raty/images';







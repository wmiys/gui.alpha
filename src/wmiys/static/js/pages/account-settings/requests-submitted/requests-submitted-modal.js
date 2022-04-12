


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

    /** Set the meta item text */
    static setMetaItemValue(metaItem, value) {
        $(metaItem).find('dd').text(value);
    }
}


RequestsSubmittedModal.Elements = {
    MODAL: '#modal-requests-submitted',
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
    META_CONTAINER: 'modal-body-display-meta',
    META_ITEM: 'meta-item',

}





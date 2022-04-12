


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
}


RequestsSubmittedModal.Elements = {
    MODAL: '#modal-requests-submitted',
}

RequestsSubmittedModal.Classes = {
    DISPLAY_STATE_LOADING: 'loading',
}





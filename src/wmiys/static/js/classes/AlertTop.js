
/************************************************
Types of alerts
*************************************************/
const ALERT_TOP_TYPES = {
    PRIMARY  : 'alert-primary',
    SECONDARY: 'alert-secondary',
    SUCCESS  : 'alert-success',
    DANGER   : 'alert-danger',
    WARNING  : 'alert-warning',
    INFO     : 'alert-info',
    LIGHT    : 'alert-light',
    DARK     : 'alert-dark',
}


class AlertTop
{
    constructor(alertType, message) {
        const self = this;
        this.alertType = alertType;
        this.message = message;

        $(AlertTop.SELECTOR).addClass(alertType);
        $(AlertTop.SELECTOR_MESSAGE).text(message);


        $(AlertTop.SELECTOR_CLOSE).on('click', function() {
            self.hide();
        });
    }

    show() {
        $(AlertTop.SELECTOR).removeClass('d-none');
    }

    hide() {
        $(AlertTop.SELECTOR).addClass('d-none');
    }




}


/************************************************
Constants
*************************************************/
AlertTop.SELECTOR = '#alert-top';
AlertTop.SELECTOR_MESSAGE = '#alert-top .message';
AlertTop.SELECTOR_CLOSE = '#alert-top .btn-close-alert';
/************************************************
This class contains logic for disabling and then
re-enabling html buttons.

When the button is disabled, a spinner is shown
and it is set to disabled.
*************************************************/


export class SpinnerButton
{
    /************************************************
    Constructor

    Parms:
        a_strSelector - the html selector
        a_strDisplayText - the original text to display
    *************************************************/
    constructor(a_strSelector, a_strDisplayText) {
        this.selector = a_strSelector;
        this.displayText = a_strDisplayText;
    }

    /************************************************
    Disable the button and show the spinner.
    *************************************************/
    showSpinner() {
        const self = this;
        const width = $(self.selector).width();
        $(self.selector).html(CommonHtml.spinnerSmall).width(width).prop('disabled', true);
    }

    /************************************************
    Reset the button back to its normal state
    *************************************************/
    reset() {
        const self = this;
        const width = $(self.selector).width();
        $(self.selector).text(self.displayText).width(width).prop('disabled', false);
    }

    
}
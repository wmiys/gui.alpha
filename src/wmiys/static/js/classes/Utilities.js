
import { DateTime } from "./GlobalConstants";

export class Utilities {    
    
    /************************************************
    displays an alert on the screen
    *************************************************/
    static displayAlert(text) {
        $.toast({
            text: text,
            position: 'bottom-center',
            loader: false,
            bgColor: '#3D3D3D',
            textColor: 'white'
        });
    }

    /************************************************
    Validates the form attributes.
    *************************************************/
    static validateForm(formElement) {
        const isValid = $(formElement)[0].reportValidity();
        return isValid;
    }

    /************************************************
    Transform a float to a currency with commas
    *************************************************/
    static toCurrencyFormat(numberToFormat) {
        let result = '$' + numberToFormat.toLocaleString();

        return result;
    }

    static getJqueryElementID(eJqueryElement) {
        return `#${$(eJqueryElement).attr('id')}`;
    }

    /**************************************************
     * Create a URL with search params appended to
     * 
     * example.com?name=Ryan&age=26
     * 
     * @param {string} endpoint - the base url to use
     * @param {Object} nativeObject - the JS object to turn into a URLSearchParams object
     * 
     * @returns string
     *************************************************/
    static createUrlWithParms(endpoint, nativeObject) {
        const data = Utilities.getUrlSearchParms(nativeObject);
        const url = `${endpoint}?${data.toString()}`;
        return url;
    }

    /**
     * Serialize an object into a URLSearchParams object
     * 
     * @param {object} nativeObject - the object to convert
     * 
     * @returns URLSearchParams
     */
    static getUrlSearchParms(nativeObject) {
        const urlSearchParms = new URLSearchParams();
        this._nativeToRequestType(nativeObject, urlSearchParms);

        return urlSearchParms;
    }

    /**
     * Transform a native JS object into a FormData object
     * 
     * @param {Object} nativeObject - the native JS object
     * 
     * @returns the generated form data objected
     */
    static getFormData(nativeObject) {
        const formData = new FormData();
        this._nativeToRequestType(nativeObject, formData);

        return formData;
    }

    /**
     * Serialize the given native object into either a FormData or URLSearchParams object
     * 
     * @param {object} nativeObject - the native JavaScript object
     * @param {URLSearchParams | FormData} requestObject - the web Request object to place the values into
     */
    static _nativeToRequestType(nativeObject, requestObject) {
        for (const key in nativeObject) {
            const value = nativeObject[key];
            requestObject.append(key, value);
        }
    }

    /**
     * Tries to parse the given ISO datetime string into a luxon DateTime object
     * @param {string} datetimeString - the raw iso datetime string
     * @returns {DateTime | string | null}
     */
    static parseDatetimeStringISO(datetimeString) {
        let luxonDate = datetimeString;

        try {
            luxonDate = DateTime.fromISO(datetimeString);
        } 
        catch(exception) {
            luxonDate = datetimeString;
        }
        
        return luxonDate;
    }


    /**
     * Format the given datetime object into a string
     * 
     * @see https://moment.github.io/luxon/#/formatting?id=presets
     * 
     * @param {DateTime} datetime - the luxon datetime object
     * @param formatToken - the luxon datetime format token 
     * @returns {string} the formatted datetime string
     */
    static formatDatetime(datetime, formatToken) {
        return datetime.toLocaleString(formatToken);
    }


}
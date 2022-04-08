
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

    static getJqueryElementID(a_oJqueryElement) {
        return `#${$(a_oJqueryElement).attr('id')}`;
    }

    /**
     * Serialize an object into a URLSearchParams object
     * 
     * @param {object} nativeObject - the object to convert
     * 
     * @returns URLSearchParams
     */
    static GetUrlSearchParms(nativeObject) {
        const parms = new URLSearchParams();

        for (const key in nativeObject) {
            const value = nativeObject[key];
            parms.append(key, value);
        }

        return parms;
    }
}
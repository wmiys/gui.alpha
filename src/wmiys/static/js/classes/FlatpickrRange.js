import { DateTime } from "./GlobalConstants";


export class FlatpickrRange
{
    /**********************************************************
    Constructor

    Parms:
        a_eInputElement - the html input element that you want to transform into a flatpickr date instance
        a_bMinDateToday - a boolean to indicate that you want the minimum date to be today.
    **********************************************************/
    constructor(a_eInputElement, a_bMinDateToday = false) {
        const self = this;
        this.inputElement = a_eInputElement;
        this.setMinDateToToday = a_bMinDateToday;

        let flatpickrConfig = {
            altInput: true,
            altFormat: "F j, Y",
            dateFormat: "Y-m-d",
            mode: "range",
        }

        if (a_bMinDateToday) {
            flatpickrConfig.minDate = "today";
        }


        this.flatpickrInstance = $(this.inputElement).flatpickr(flatpickrConfig);
    }

    /**********************************************************
    Returns the product search date range input values.

    Return value is an object containing the fields:
        - startsOn
        - endsOn
    **********************************************************/
    getDateValues() {
        const selectedDates = this.flatpickrInstance.selectedDates;

        if (selectedDates.length == 0) {
            const nullReturn = {
                startsOn: null,
                endsOn: null,
            }
            
            return nullReturn;    // no dates are set
        }
        
        // transform the js dates into ISO format: YYYY-MM-DD
        let startsOnVal = DateTime.fromJSDate(selectedDates[0]);
        let endsOnVal = DateTime.fromJSDate(selectedDates[1]);
    
        const dateValues = {
            startsOn: startsOnVal.toISODate(),
            endsOn: endsOnVal.toISODate(),
        }
    
        return dateValues;
    }
}




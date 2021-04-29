

const eFormProductSearch = {
    form: '#product-search-form',

    inputs: {
        location: '#product-search-form-input-location',
        dates: '#product-search-form-input-dates',
        category: '#product-search-form-input-category',
    },

    dropdownDataAttr:'data-product-category-sub-id',

    classes: {
        input: '.product-search-form-input',
    },

    dateRangesFlatpick: null,

    getInputValues: function() {
        let values = {};
        
        values.location_id = $(eFormProductSearch.inputs.location).val();

        const dates = eFormProductSearch.getFlatPickrRangeDates();
        values.starts_on = dates.startsOn;
        values.ends_on = dates.endsOn;
        
        
        values.product_categories_sub_id = eFormProductSearch.getProductCategorySubId();

        return values;
    },


    getProductCategorySubId: function() {
        const result = $(eFormProductSearch.inputs.category).attr(eFormProductSearch.dropdownDataAttr);
        return result;
    },

    /************************************************
    Returns the starts on and ends on values in a flatpickr date range.
    *************************************************/
    getFlatPickrRangeDates: function() {
        if (eFormProductSearch.dateRangesFlatpick.selectedDates.length == 0) {
            return null;
        }

        let out1 = DateTime.fromJSDate(eFormProductSearch.dateRangesFlatpick.selectedDates[0]); // starts on
        let out2 = DateTime.fromJSDate(eFormProductSearch.dateRangesFlatpick.selectedDates[1]); // ends on

        const result = {
            startsOn: out1.toISODate(),
            endsOn: out2.toISODate(),
        }

        return result;
    }

}





/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    loadPlugins();
});


/**********************************************************
Loads all of the js plugins
**********************************************************/
function loadPlugins() {
    loadSelect2();
    initFlatpickrs();
}


/**********************************************************
Loads the select2 library on the location input
**********************************************************/
function loadSelect2() {
    $(eFormProductSearch.inputs.location).select2({
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
Initialize the flat pickr inputs
**********************************************************/
function initFlatpickrs() {
    eFormProductSearch.dateRangesFlatpick = $(eFormProductSearch.inputs.dates).flatpickr({
        altInput: true,
        altFormat: "F j, Y",
        dateFormat: "Y-m-d",
        mode: "range",
        minDate: "today",
    });
}



function getFlatPickrRangeDates() {   
    if (eFormProductSearch.dateRangesFlatpick.selectedDates.length == 0) {
        return null;
    }

    let out1 = DateTime.fromJSDate(eFormProductSearch.dateRangesFlatpick.selectedDates[0]); // starts on
    let out2 = DateTime.fromJSDate(eFormProductSearch.dateRangesFlatpick.selectedDates[1]); // ends on

    const result = {
        startsOn: out1.toISODate(),
        endsOn: out2.toISODate(),
    }

    return result;
}



function getTheValues() {

    let result = eFormProductSearch.getInputValues();
    console.log(result);
}












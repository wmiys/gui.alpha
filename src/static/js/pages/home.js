

const eFormProductSearch = {

    form: '#product-search-form',

    inputs: {
        location: '#product-search-form-input-location',
        dates: '#product-search-form-input-dates',
        category: '#product-search-form-input-catgory',
    },

    dropdownDataAttr = 'data-product-category-sub-id',

    classes: {
        input: '.product-search-form-input',
    },



    getInputValues: function() {
        let values = {};
        values.location_id = $(eFormProductSearch.inputs.location).val();
        values.dates = $(eFormProductSearch.inputs.location).val();
        values.product_categories_sub_id = $(eFormProductSearch.inputs.location).val();

        return values;
    },


    getProductCategorySubId: function() {
        const result = $(eFormProductSearch.category).attr(eFormProductSearch.dropdownDataAttr);
        return result;
    },
}





/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {

    loadSelect2();
});



/**********************************************************
Loads the select2 library on the location input
**********************************************************/
function loadSelect2() {
    $(eInputs.location).select2({
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















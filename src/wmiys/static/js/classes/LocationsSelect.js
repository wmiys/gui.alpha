



export class LocationsSelect 
{
    /**********************************************************
    Initialize a select2 location search plugin.
    **********************************************************/
    static init(a_eInput, a_strPlaceholder = '', a_iMinimumInputLength = 3) {
        return $(a_eInput).select2({
            minimumInputLength: a_iMinimumInputLength,
            theme: 'bootstrap4',
            placeholder: a_strPlaceholder,
            ajax: {
                delay: 50,
                url: ApiWrapper.URLS.SEARCH.LOCATIONS,
                allowClear: true,
                data: function (params) {
                    const urlParms = {      // set the request url ?parms
                        q: params.term,
                    }                
                    return urlParms;
                },
                processResults: function (apiResponse) {
                    let processedData = [];
                    for (let count = 0; count < apiResponse.length; count++) {
                        const location = apiResponse[count];
                        const text = `${location.city}, ${location.state_name}`;
                        processedData.push({id: location.id, text: text});
                    }
                    
                    return ({results: processedData});
                }
            },
        });
    }
}





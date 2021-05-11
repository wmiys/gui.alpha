

class UrlParser
{   
    /**********************************************************
    Get the path value of the current url/
    **********************************************************/
    static getPathValue(index) {
        const urlPath = window.location.pathname;
        const pathValues = urlPath.split("/");

        const adjustedIndex = index + 1;    // empty string in the first index of pathValues

        if (adjustedIndex < pathValues.length && adjustedIndex >= 1) {
            return pathValues[adjustedIndex];
        }

        return null;
    }

    /**********************************************************
    Returns the value of a URL query parm

        example.com?name=shit
    
    getQueryParm('name') would return 'shit'
    **********************************************************/
    static getQueryParm(a_strParmName) {
        const urlParams = UrlParser.getSearchParms();
        const value = urlParams.get(a_strParmName);
        return value;
    }

    /**********************************************************
    Set's the query paramters of the url.
    Then refreses the page.
    **********************************************************/
    static setQueryParm(a_strKey, a_strValue, a_bRefresh=true) {
        const urlParams = UrlParser.getSearchParms();
        urlParams.set(a_strKey, a_strValue);

        if (a_bRefresh) {
            window.location.search = urlParams;
        } else {
            return urlParams;
        }

    }

    /**********************************************************
    Returns the current URLSearchParams
    **********************************************************/
    static getSearchParms() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams;
    }
}
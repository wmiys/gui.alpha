import { ApiWrapper }      from "../classes/API-Wrapper";
import { FlatpickrRange }  from "../classes/FlatpickrRange";
import { LocationsSelect } from "../classes/LocationsSelect";


/**********************************************************
Product search form
**********************************************************/
const eFormProductSearch = {
    form: '#product-search-form',

    inputs: {
        location: '#product-search-form-input-location',
        dates: '#product-search-form-input-dates',
        category: '#product-search-form-input-category',
    },

    dropdownDataAttr:'data-product-category-sub-id',
    subCategoryDataAttr: 'data-category-sub-id',

    classes: {
        input: '.product-search-form-input',
    },

    dateRangesFlatpick: null,

    buttons: {
        search: '#product-search-form-button-search',
    },

    dropdownText: '#product-search-form-input-category-text',

    getInputValues: function() {
        let values = {};
        
        // location
        values.location_id = $(eFormProductSearch.inputs.location).val();

        // date range
        const dates = eFormProductSearch.dateRangesFlatpick.getDateValues();
        values.starts_on = dates.startsOn;
        values.ends_on = dates.endsOn;
        
        
        values.product_categories_sub_id = eFormProductSearch.getProductCategorySubId();

        return values;
    },

    getProductCategorySubId: function() {
        const result = $(eFormProductSearch.inputs.category).attr(eFormProductSearch.dropdownDataAttr);
        return parseInt(result);
    },
}

let eLocationInput = null;


/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    loadPlugins();
    setEventListeners();
});


/**********************************************************
Loads all of the js plugins
**********************************************************/
function loadPlugins() {
    eLocationInput = LocationsSelect.init(eFormProductSearch.inputs.location, 'Location', 3);
    eFormProductSearch.dateRangesFlatpick = new FlatpickrRange(eFormProductSearch.inputs.dates, true);
    loadCategories();
}

/**********************************************************
Registers all of the event handlers
**********************************************************/
function setEventListeners() {
    // product search category input change
    $(eFormProductSearch.inputs.category).on('click', '.dropdown-item', function() {
        handleProductSearchCategoryChange(this);
    });

    $(eFormProductSearch.buttons.search).on('click', function() {
        gotoSearchProductsPage();
    });

    $(eFormProductSearch.classes.input).on('change', function() {
        inputValueChange(this);
    });
}



/**********************************************************
Handler for when the product search category input is changed.
**********************************************************/
function handleProductSearchCategoryChange(eDropdownItem) {
    // set it to active in the dropdown menu
    $(eFormProductSearch.inputs.category).find('.dropdown-item').removeClass('active');
    $(eDropdownItem).addClass('active');

    // set the dropdown data attribute to the id of the sub category selected
    const subCategoryID = $(eDropdownItem).attr(eFormProductSearch.subCategoryDataAttr);
    $(eFormProductSearch.inputs.category).attr(eFormProductSearch.dropdownDataAttr, subCategoryID);

    // show the name
    const subCategoryName = $(eDropdownItem).text();
    $(eFormProductSearch.dropdownText).text(subCategoryName);
}


/**********************************************************
Fetch the product category data from the API.
**********************************************************/
async function loadCategories() {
    const apiResponse = await ApiWrapper.requestGetProductCategories();

    if (apiResponse.ok) {
        const categories = await apiResponse.json();
        loadCategoriesSuccess(categories);
    } 
    else {
        loadCategoriesError(await apiResponse.text());
    }
}

/**********************************************************
Callback for an unsuccessful fetch of the product categories (loadCategories)
**********************************************************/
function loadCategoriesError(error) {
    console.error('Error: loadCategoriesError')
    console.error(error);
}

/**********************************************************
Callback for a successful fetch of the product categories (loadCategories)
**********************************************************/
function loadCategoriesSuccess(result) {
    const categories = genertateMinorCategoryMap(result);
    let minors = sortCategories(categories);
    let html = generateCategorieshDropdownHtml(minors);

    $(eFormProductSearch.inputs.category).find('.dropdown-menu').html(html);
}

/**********************************************************
Transforms a list of product category objects into a map:
    key = minor category id
    value = object(name, subs: [])
**********************************************************/
function genertateMinorCategoryMap(categoriesTableList) {
    let minors = {};

    // break down the categories into a map of minor categories with an empty list for the sub categories
    for (const cat of categoriesTableList) {
        minors[cat.minor_id] = {
            name: cat.minor_name,
            subs: [],
        }
    }

    // insert all the sub categories into the sub category list
    for (const cat of categoriesTableList) {
        const sub = {
            id: cat.sub_id,
            name: cat.sub_name,
        }
        minors[cat.minor_id].subs.push(sub);
    }

    return minors;
}

/**********************************************************
Sorts the list of product categories by Minor, Sub category.

This doesn't really do anything right now...
**********************************************************/
function sortCategories(unsortedCategories) {
    return unsortedCategories;
}



/**********************************************************
Generates the dropdown menu html for the #product-search-form-input-category.
The input is a "minor product category" map generated by genertateMinorCategoryMap.
**********************************************************/
function generateCategorieshDropdownHtml(minorCategoriesMap) {
    let html = '';

    for (const minorID of Object.keys(minorCategoriesMap)) {
        const minorName = minorCategoriesMap[minorID].name;

        html += `<div class="header-section">`;
        html += `<h6 class="dropdown-header">${minorName}</h6>`;
        
        // generate the html of the sub categories
        for (const sub of minorCategoriesMap[minorID].subs) {
            html += getSubCategoryDropdownHtml(sub.id, sub.name);
        }

        html += `<div class="dropdown-divider"></div>`;
        html += `</div">`;
    }

    return html;
}

/**********************************************************
Generates the dropdown menu item html for a single sub category.
**********************************************************/
function getSubCategoryDropdownHtml(id, name) {
    let html = `<button class="dropdown-item" type="button" data-category-sub-id="${id}">${name}</button>`;
    return html;
}


/**********************************************************
Creates the search page url and then loads the page
**********************************************************/
function gotoSearchProductsPage() {
    const searchInputValues = eFormProductSearch.getInputValues();

    if (searchInputValues.ends_on == null) {
        return;
    } else if (searchInputValues.starts_on == null) {
        return;
    } else if (searchInputValues.location_id == "" || searchInputValues.location_id == null) {
        return;
    }

    let urlQueryParms = `location_id=${searchInputValues.location_id}&starts_on=${searchInputValues.starts_on}&ends_on=${searchInputValues.ends_on}`;

    let newUrl = `/search/products`;
    if (searchInputValues.product_categories_sub_id > 0) {
        // append the sub product category if they selected one
        newUrl += `/categories/minor/${searchInputValues.product_categories_sub_id}`;
    }

    window.location.href = `${newUrl}?${urlQueryParms}`;
}


/**********************************************************
When an input value is changed, check if the search button
can be enabled. 

The dates and location inputs all need a value in order to
search for a product.
**********************************************************/
function inputValueChange(eChangedInput) {
    const searchInputValues = eFormProductSearch.getInputValues();

    if (Object.values(searchInputValues).includes(null)) {
        $(eFormProductSearch.buttons.search).prop('disabled', true);
    } else {
        $(eFormProductSearch.buttons.search).prop('disabled', false);
    }
}






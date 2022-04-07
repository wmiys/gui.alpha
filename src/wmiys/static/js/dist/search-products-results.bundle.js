(function(){'use strict';class UrlParser
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

    /**********************************************************
    Set's the url query parms of the current url to the key, values contained in the object.
    AND DOES NOT REFRESH THE PAGE!!!!... MAGIC BITCH.
    **********************************************************/
    static setQueryParmsNoReload(newQueryParmsObject) {
        const url = new URL(window.location);

        for (const key in newQueryParmsObject) {
            url.searchParams.set(key, newQueryParmsObject[key]);
        }

        window.history.pushState({}, '', url);
    }
}class Pagination
{

    /**********************************************************
    Constructor.

    Parms:
        a_eList (str) - string for jquery to select the element.
    **********************************************************/
    constructor(a_eList) {
        if (a_eList == undefined || a_eList == null) {
            a_eList = Pagination.list;
        }

        this.eList = a_eList;

        this.togglePaginationStates = this.init.bind(this);
        this.togglePaginationStateFirstPage = this.togglePaginationStateFirstPage.bind(this);
        this.toggleFirstAndOnlyPage = this.toggleFirstAndOnlyPage.bind(this);
        this.togglePaginationStateLastPage = this.togglePaginationStateLastPage.bind(this);
        this.togglePaginationStateNormal = this.togglePaginationStateNormal.bind(this);
    }

    /**********************************************************
    Toggle the appropriate pagination state.
    **********************************************************/
    init() {
        let presentPage = UrlParser.getQueryParm('page');
        const lastPage = $(Pagination.list).attr('data-page-last');

        if (presentPage == 1 || presentPage == null) {
            // protection against null value
            presentPage = 1;
            
            this.togglePaginationStateFirstPage();
    
            if (presentPage == lastPage) {
                this.toggleFirstAndOnlyPage();
            }
    
            return;
        } 
        else if (presentPage == lastPage) {
            this.togglePaginationStateLastPage();
            return;
        } 
        else {
            this.togglePaginationStateNormal();
        }
    }

    /**********************************************************
    First page action
    **********************************************************/
    togglePaginationStateFirstPage() {
        let ul = $(this.eList);
        const items = Pagination.items;
    
        // disable the first and previous buttons
        $(ul).find(items.first).addClass('disabled');
        $(ul).find(items.previous).addClass('disabled');
    
        // set the left button to active
        $(ul).find(items.left).addClass('active');
    
        // put href value of the right into the middle one
        const nextLink = $(ul).find(items.next).find('a').attr('href');
        $(ul).find(items.center).find('a').attr('href', nextLink).text('2');
    
        // disable the right button
        $(ul).find(items.right).find('a').text('...').closest('li').addClass('disabled');
    }

    /**********************************************************
    First page and the only page action
    **********************************************************/
    toggleFirstAndOnlyPage() {
        let ul = $(this.eList);
        const items = Pagination.items;
    
        // disable the first and previous buttons
        $(ul).find(items.center).addClass('disabled');
        $(ul).find(items.next).addClass('disabled');
        $(ul).find(items.last).addClass('disabled');
    }

    /**********************************************************
    Last page action
    **********************************************************/
    togglePaginationStateLastPage() {
        let ul = $(this.eList);
        const items = Pagination.items;
    
        // disable the first and previous buttons
        $(ul).find(items.last).addClass('disabled');
        $(ul).find(items.next).addClass('disabled');
        $(ul).find(items.right).addClass('disabled').find('a').text('...');
    
        // set the right button to active
        $(ul).find(items.center).addClass('active');
    }

    /**********************************************************
    Normal page.
    **********************************************************/
    togglePaginationStateNormal() {
        $(this.eList).find(Pagination.items.center).addClass('active');
    }


}


/**********************************************************
Static properties
**********************************************************/

Pagination.list = '.pagination-search-products';

Pagination.items = {};
Pagination.items.first    = '.page-item-first';
Pagination.items.previous = '.page-item-previous';
Pagination.items.left     = '.page-item-left';
Pagination.items.center   = '.page-item-center';
Pagination.items.right    = '.page-item-right';
Pagination.items.next     = '.page-item-next';
Pagination.items.last     = '.page-item-last';class SidenavFilterCategories
{
    /**********************************************************
    Constructor
    **********************************************************/
    constructor() {
        this.addEventListeners();
        this.classes = SidenavFilterCategories.classes;
        this.dataAttrs = SidenavFilterCategories.dataAttrs;

        // bind all the functions... fuck javascript
        this.addEventListeners = this.addEventListeners.bind(this);
        this.collapseSidenavFilterCategoryList = this.collapseSidenavFilterCategoryList.bind(this);
        this.revealActiveCategory = this.revealActiveCategory.bind(this);
        this.revealActiveCategoryMajor = this.revealActiveCategoryMajor.bind(this);
        this.revealActiveCategoryMinor = this.revealActiveCategoryMinor.bind(this);
        this.revealActiveCategorySub = this.revealActiveCategorySub.bind(this);
    }

    /**********************************************************
    Regsites all of the event listeners for this class
    **********************************************************/
    addEventListeners() {
        $(SidenavFilterCategories.classes.collapseListBtn).on('click', (e) => {
            this.collapseSidenavFilterCategoryList(e.currentTarget);
        });
    }

    /**********************************************************
    Toggle a collapseable list
    **********************************************************/
    collapseSidenavFilterCategoryList(a_eBtnClicked) {
        let listItem = $(a_eBtnClicked).closest(this.classes.listItem);     // the list item containing the button that was clicked
        let listItemID = $(listItem).attr(this.dataAttrs.id);               // it's id

        let jqString = `> ${this.classes.list}[${this.dataAttrs.parentID}="${listItemID}"]`;

        // toggle the sub list within the current listItem list whose parent id is the one of the listItem
        $(listItem).toggleClass('child-list-visible').closest(this.classes.list).find(jqString).collapse('toggle');
    }

    /**********************************************************
    Figure out which category item is active 
    Drill up and uncollapse all of it's parents.
    **********************************************************/
    revealActiveCategory() {
        const categoryType = UrlParser.getPathValue(3); // '/search/products/categories/[major,minor,sub]
        if (categoryType == null) {
            return;
        }
    
        const categoryID = UrlParser.getPathValue(4);

        switch(categoryType) {
            case SidenavFilterCategories.categoryTypes.major:
                this.revealActiveCategoryMajor(categoryID); break;
            case SidenavFilterCategories.categoryTypes.minor:
                this.revealActiveCategoryMinor(categoryID); break;
            case SidenavFilterCategories.categoryTypes.sub:
                this.revealActiveCategorySub(categoryID); break;
            default:
                console.error('SidenavFilterCategories - revealActiveCategory: invalid product category'); break;
        }    
    }

    /**********************************************************
    Show a sub category item and it's parent and grandfather (major category).
    **********************************************************/
    revealActiveCategoryMajor(a_iCategoryId) {
        let listItemSelector = `${SidenavFilterCategories.classes.listItem}.major[data-id="${a_iCategoryId}"]`;
        let eListItem = $(listItemSelector);

        $(eListItem).addClass('text-success').removeClass('text-muted').next().collapse('show');
        $(eListItem).find('a').toggleClass('text-reset, font-weight-bold');
    }

    /**********************************************************
    Show a minor category item and it's parent.
    **********************************************************/
    revealActiveCategoryMinor(a_iCategoryId) {
        let listItemSelector = `${SidenavFilterCategories.classes.listItem}.minor[data-id="${a_iCategoryId}"]`;
        let eListItem = $(listItemSelector);

        $(eListItem).addClass('text-success').removeClass('text-muted').next().collapse('show');
        $(eListItem).find('a').toggleClass('text-reset, font-weight-bold');

        let grandfatherList = $(eListItem).closest('.collapse');
        $(grandfatherList).collapse('show');   
    }

    /**********************************************************
    Show a major category item.
    **********************************************************/
    revealActiveCategorySub(a_iCategoryId) {
        let listItemSelector = `${SidenavFilterCategories.classes.listItem}.sub[data-id="${a_iCategoryId}"]`;
        let eListItem = $(listItemSelector);
        
        $(eListItem).addClass('text-success').removeClass('text-muted').next().collapse('show');
        $(eListItem).find('a').toggleClass('text-reset, font-weight-bold');
        
        let parentList = $(eListItem).closest(SidenavFilterCategories.classes.list);
        $(parentList).collapse('show');

        let grandfatherList = $(parentList).closest('.collapse');
        $(grandfatherList).collapse('show');        
    }

}


/**********************************************************
Static properties
**********************************************************/
SidenavFilterCategories.classes = {
    container: '.sidenav-filter-categories',
    list: '.sidenav-filter-categories-list',
    listItem: '.sidenav-filter-categories-list-item',
    collapseListBtn: '.sidenav-filter-categories-list-btn-collapse',
    listMajor: '.sidenav-filter-categories-list-major',
    listMinor: '.sidenav-filter-categories-list-minor',
    listSub: '.sidenav-filter-categories-list-sub',
};

SidenavFilterCategories.dataAttrs = {
    parentID: 'data-parent-id',
    id: 'data-id',
    categoryType: 'data-category-type',
}; 


SidenavFilterCategories.categoryTypes = {
    major: 'major',
    minor: 'minor',
    sub: 'sub',
};class SortingType
{
    constructor(a_id, a_text, a_urlSortQuery, a_subtext=null) {
        this.id = a_id;
        this.text = a_text;
        this.subtext = a_subtext;
        this.urlSortQuery = a_urlSortQuery;

        this.getHtml = this.getHtml.bind(this);
    }

    /**********************************************************
    Generate the html for an element
    **********************************************************/
    getHtml() {
        const subtextDisplay = this.subtext == null ? '' : `data-subtext="${this.subtext}"`;
        let html = `<option value="${this.id}" ${subtextDisplay}>${this.text}</option>`;
        return html;
    }
}


class SortingElement
{
    constructor() {

        this.addEventListeners = this.addEventListeners.bind(this);
        this.setNewSortOption  = this.setNewSortOption.bind(this);
        this.displayOptions    = this.displayOptions.bind(this);
        this.setOptionFromUrl  = this.setOptionFromUrl.bind(this);
        this.getOptionsHtml    = this.getOptionsHtml.bind(this);
        this.getValue          = this.getValue.bind(this);

        this.addEventListeners();   
    }

    /**********************************************************
    Register all the event listeners
    **********************************************************/
    addEventListeners() {
        const self = this;

        $(SortingElement.selectors.container).on('change', function() {
            self.setNewSortOption();
        });
    }

    /**********************************************************
    Once a new option is chosen, set the sort url query parm to the new one.
    Then, refresh the page.
    **********************************************************/
    setNewSortOption() {
        const val = this.getValue();
        const urlQueryParmValue = SortingElement.Options[val].urlSortQuery;
        UrlParser.setQueryParm('sort', urlQueryParmValue, true);
    }

    /**********************************************************
    Display all of the available options.
    **********************************************************/
    displayOptions() {
        const optionsHtml = this.getOptionsHtml();
        $(SortingElement.selectors.container).html(optionsHtml);
        this.setOptionFromUrl();
        $(SortingElement.selectors.container).selectpicker('render');
    }

    /**********************************************************
    Set the selected option from the value in the current url
    **********************************************************/
    setOptionFromUrl() {
        const urlValue = UrlParser.getQueryParm('sort');

        if (urlValue == null) {
            return;
        }

        for (const option of Object.values(SortingElement.Options)) {
            if (option.urlSortQuery == urlValue) {
                const index = option.id;
                const optionElements = SortingElement.getOptions();
                $(optionElements[index]).attr('selected','selected');
                break;
            }
        }
    }

    /**********************************************************
    Generate the html for the options within the select element
    **********************************************************/
    getOptionsHtml() {
        let html = '';

        for (const option of Object.values(SortingElement.Options)) {
            html += option.getHtml();
        }

        return html;
    }

    /**********************************************************
    Get the currently selected value
    **********************************************************/
    getValue() {
        const value = $(SortingElement.selectors.container).find('option:checked').val();
        return parseInt(value);
    }

    /**********************************************************
    Get a list of all the option elements in the DOM.
    **********************************************************/
    static getOptions() {
        return $(SortingElement.selectors.container).find('option');
    }
}


SortingElement.selectors = {
    container: '.selectpickr-search-product:visible',
};

SortingElement.Options = {
    0: new SortingType(0, "Name", "name:asc", null),
    1: new SortingType(1, "Price full day", "price_full:desc", "high to low"),
    2: new SortingType(2, "Price full day", "price_full:asc", "low to high"),
    3: new SortingType(3, "Price half day", "price_half:desc", "high to low"),
    4: new SortingType(4, "Price half day", "price_half:asc", "low to high"),
};const m_SidenavFilterCategories = new SidenavFilterCategories();
const m_SortingElement = new SortingElement();
const m_Pagination = new Pagination(Pagination.list);


const eBtnToggleFilters = '#btn-toggle-filters';
const eCategoryColumn = '.category-column';

/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    m_SidenavFilterCategories.revealActiveCategory();
    m_SortingElement.displayOptions();
    m_Pagination.init();
    addEventListeners();
});


function addEventListeners() {
    $(eBtnToggleFilters).on('click', function() {
        toggleHiddenCategoryColumn();
    });
}


function toggleHiddenCategoryColumn() {
    $(eCategoryColumn).toggleClass('d-none');
}})();//# sourceMappingURL=search-products-results.bundle.js.map

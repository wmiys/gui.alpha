

class SortingType
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
}

SortingElement.Options = {
    0: new SortingType(0, "Name", "name:asc", null),
    1: new SortingType(1, "Price full day", "price_full:desc", "high to low"),
    2: new SortingType(2, "Price full day", "price_full:asc", "low to high"),
    3: new SortingType(3, "Price half day", "price_half:desc", "high to low"),
    4: new SortingType(4, "Price half day", "price_half:asc", "low to high"),
};



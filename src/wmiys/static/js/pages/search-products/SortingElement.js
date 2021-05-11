
class SortingType
{
    constructor(a_id, a_text, a_urlSortQuery, a_subtext=null) {
        this.id = a_id;
        this.text = a_text;
        this.subtext = a_subtext;
        this.urlSortQuery = a_urlSortQuery;
    }

    getHtml = () => {
        const subtextDisplay = this.subtext == null ? '' : `data-subtext="${this.subtext}"`;
        let html = `<option value="${this.id}" ${subtextDisplay}>${this.text}</option>`;
        return html;
    }
}

class SortingElement
{
    constructor() {
        this.addEventListeners();
    }

    addEventListeners = () => {
        const self = this;

        $(SortingElement.selectors.container).on('change', function() {
            self.setNewSortOption();
        });
    }

    displayOptions = () => {
        const optionsHtml = this.getOptionsHtml();
        $(SortingElement.selectors.container).html(optionsHtml).selectpicker('refresh');
        $(SortingElement.selectors.container).selectpicker('render');
    }

    getOptionsHtml = () => {
        let html = '';

        for (const option of Object.values(SortingElement.Options)) {
            html += option.getHtml();
        }

        return html;
    }

    getValue = () => {
        const value = $(SortingElement.selectors.container).find('option:checked').val();
        return parseInt(value);
    }

    setNewSortOption = () => {
        const val = this.getValue();
        const urlQueryParmValue = SortingElement.Options[val].urlSortQuery;
        UrlParser.setQueryParm('sort', urlQueryParmValue, true);
    }
}


SortingElement.selectors = {
    container: '.selectpickr-search-product',
}

SortingElement.Options = {
    0: new SortingType(0, "Relevance", "relevance", null),
    1: new SortingType(1, "Top Rated", "top-rated", null),
    2: new SortingType(2, "Price full day", "price-full-high", "high to low"),
    3: new SortingType(3, "Price full day", "price-full-low", "low to high"),
    4: new SortingType(4, "Price half day", "price-half-high", "high to low"),
    5: new SortingType(5, "Price half day", "price-half-low", "low to high"),
};



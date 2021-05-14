

class Pagination
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
        const presentPage = UrlParser.getQueryParm('page');
        const lastPage = $(Pagination.list).attr('data-page-last');

        if (presentPage == 1 || presentPage == null) {
            this.togglePaginationStateFirstPage();
    
            if (presentPage == lastPage) {
                this.toggleFirstAndOnlyPage();
            }
    
            return;
            
        } else if (presentPage == lastPage) {
            this.togglePaginationStateLastPage();
            return;
        } else {
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
Pagination.items.last     = '.page-item-last';



const m_SidenavFilterCategories = new SidenavFilterCategories();
const m_SortingElement = new SortingElement();


const e_pagination = {
    list: '.pagination-search-products',

    items: {
        first: '.page-item-first',
        previous: '.page-item-previous',
        left: '.page-item-left',
        center: '.page-item-center',
        right: '.page-item-right',
        next: '.page-item-next',
        last: '.page-item-last',
    }
};

/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    // addListeners();
    m_SortingElement.displayOptions();
    togglePaginationStates();

    toggleSidenavCollapse();
});


function togglePaginationStates() {
    const presentPage = UrlParser.getQueryParm('page');
    const lastPage = $(e_pagination.list).attr('data-page-last');

    if (presentPage == 1 || presentPage == null) {
        togglePaginationStateFirstPage();

        if (presentPage == lastPage) {
            toggleFirstAndOnlyPage();
        }

        return;
        
    } else if (presentPage == lastPage) {
        togglePaginationStateLastPage();
        return;
    } else {
        togglePaginationStateNormal();
    }
}

function togglePaginationStateFirstPage() {

    let ul = $(e_pagination.list);
    const items = e_pagination.items;

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

function toggleFirstAndOnlyPage() {
    let ul = $(e_pagination.list);
    const items = e_pagination.items;

    // disable the first and previous buttons
    $(ul).find(items.center).addClass('disabled');
    $(ul).find(items.next).addClass('disabled');
    $(ul).find(items.last).addClass('disabled');
}


function togglePaginationStateLastPage() {
    let ul = $(e_pagination.list);
    const items = e_pagination.items;

    // disable the first and previous buttons
    $(ul).find(items.last).addClass('disabled');
    $(ul).find(items.next).addClass('disabled');
    $(ul).find(items.right).addClass('disabled').find('a').text('...');

    // set the right button to active
    $(ul).find(items.center).addClass('active');
}


function togglePaginationStateNormal() {
    $(e_pagination.list).find(e_pagination.items.center).addClass('active');
}



function toggleSidenavCollapse() {
    const categoryType = UrlParser.getPathValue(3);
    if (categoryType == null) {
        return;
    }

    const categoryID = UrlParser.getPathValue(4);

    $('.sidenav-filter-categories-list-item.sub[data-id="3"]').addClass('active');
}




const m_SidenavFilterCategories = new SidenavFilterCategories();
const m_SortingElement = new SortingElement();
const m_Pagination = new Pagination(Pagination.list);


/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    m_SortingElement.displayOptions();
    m_Pagination.init();
    toggleSidenavCollapse();
});


function toggleSidenavCollapse() {
    const categoryType = UrlParser.getPathValue(3);
    if (categoryType == null) {
        return;
    }

    const categoryID = UrlParser.getPathValue(4);

    $('.sidenav-filter-categories-list-item.sub[data-id="3"]').addClass('active');
}



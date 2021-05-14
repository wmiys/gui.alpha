
const m_SidenavFilterCategories = new SidenavFilterCategories();
const m_SortingElement = new SortingElement();
const m_Pagination = new Pagination(Pagination.list);


/**********************************************************
Main logic
**********************************************************/
$(document).ready(function() {
    m_SidenavFilterCategories.revealActiveCategory();
    m_SortingElement.displayOptions();
    m_Pagination.init();
    // toggleSidenavCollapse();
});





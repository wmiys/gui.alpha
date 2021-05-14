
const m_SidenavFilterCategories = new SidenavFilterCategories();
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
}




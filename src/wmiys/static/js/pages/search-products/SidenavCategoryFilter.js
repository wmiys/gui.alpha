



class SidenavFilterCategories
{
    /**********************************************************
    Constructor
    **********************************************************/
    constructor() {

        this.addEventListeners();
        this.classes = SidenavFilterCategories.classes;
        this.dataAttrs = SidenavFilterCategories.dataAttrs;
    }

    /**********************************************************
    Regsites all of the event listeners for this class
    **********************************************************/
    addEventListeners = () => {
        $(SidenavFilterCategories.classes.collapseListBtn).on('click', (e) => {
            this.collapseSidenavFilterCategoryList(e.currentTarget);
        });
    }

    /**********************************************************
    Toggle a collapseable list
    **********************************************************/
    collapseSidenavFilterCategoryList = (a_eBtnClicked) => {
        let listItemID = $(a_eBtnClicked).closest(this.classes.listItem).attr(this.dataAttrs.id);
        let jqString = `${this.classes.list}[${this.dataAttrs.parentID}="${listItemID}"]`;
        $(jqString).collapse('toggle');
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
}

SidenavFilterCategories.dataAttrs = {
    parentID: 'data-parent-id',
    id: 'data-id',
    categoryType: 'data-category-type',
} 

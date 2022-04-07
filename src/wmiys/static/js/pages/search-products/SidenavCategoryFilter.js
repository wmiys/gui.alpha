import { UrlParser }       from "../../classes/UrlParser";

export class SidenavFilterCategories
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
}

SidenavFilterCategories.dataAttrs = {
    parentID: 'data-parent-id',
    id: 'data-id',
    categoryType: 'data-category-type',
} 


SidenavFilterCategories.categoryTypes = {
    major: 'major',
    minor: 'minor',
    sub: 'sub',
} 



import { AlertTop }        from "../../classes/AlertTop";
import { ALERT_TOP_TYPES } from "../../classes/AlertTop";
import { ApiWrapper }      from "../../classes/API-Wrapper";
import { CommonHtml }      from "../../classes/Common-Html";
import { CountUp }         from "../../classes/CountUp";
import { Dropdown }        from "../../classes/Dropdown";
import { FlatpickrRange }  from "../../classes/FlatpickrRange";
import { DateTime }        from "../../classes/GlobalConstants";
import { LocalStorage }    from "../../classes/LocalStorage";
import { LocationsSelect } from "../../classes/LocationsSelect";
import { ProductLender }   from "../../classes/ProductLender";
import { SpinnerButton }   from "../../classes/SpinnerButton";
import { UrlParser }       from "../../classes/UrlParser";
import { Utilities }       from "../../classes/Utilities";
import { API_BASE_URL }    from "../api-base-url";
import { API_URL_PREFIX }  from "../api-base-url";


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




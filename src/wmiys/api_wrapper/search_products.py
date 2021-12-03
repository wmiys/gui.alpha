import requests
from . import ApiWrapperBase, RequestParms, ApiUrls

class ApiWrapperSearchProducts(ApiWrapperBase):
    """Api Wrapper for Search Products"""

    URL          = ApiUrls.SEARCH_PRODUCTS
    URL_CATEGORY = ApiUrls.SEARCH_PRODUCTS_CATEGORY

    #------------------------------------------------------
    # Search all products
    #------------------------------------------------------
    def get(self, location_id, starts_on, ends_on, sort, per_page, page) -> requests.Response:
        parms = RequestParms(
            url = self.URL,
            parms=self._getRequestParmsDict(location_id, starts_on, ends_on, sort, per_page, page)
        )

        return self._get(parms)

    #------------------------------------------------------
    # Search all products for major category
    #------------------------------------------------------
    def getMajor(self, location_id, starts_on, ends_on, product_category_major_id, sort, per_page, page) -> requests.Response:
        return self._getRequestForCategory(location_id, starts_on, ends_on, product_category_major_id, sort, per_page, page, 'major')
    
    #------------------------------------------------------
    # Search all products for minor category
    #------------------------------------------------------
    def getMinor(self, location_id, starts_on, ends_on, product_category_minor_id, sort, per_page, page) -> requests.Response:
        return self._getRequestForCategory(location_id, starts_on, ends_on, product_category_minor_id, sort, per_page, page, 'minor')
    
    #------------------------------------------------------
    # Search all products for sub category
    #------------------------------------------------------
    def getSub(self, location_id, starts_on, ends_on, product_category_sub_id, sort, per_page, page) -> requests.Response:
        return self._getRequestForCategory(location_id, starts_on, ends_on, product_category_sub_id, sort, per_page, page, 'sub')

    #------------------------------------------------------
    # Template for requesting a search product with a category filter
    #------------------------------------------------------
    def _getRequestForCategory(self, location_id, starts_on, ends_on, category_id, sort, per_page, page, category_type) -> requests.Response:
        parms = RequestParms(
            url = self.URL_CATEGORY.format(category_type, category_id),
            parms = self._getRequestParmsDict(location_id, starts_on, ends_on, sort, per_page, page)
        )

        return self._get(parms) 
        
    #------------------------------------------------------
    # Template for transforming all the request url parms into a dict
    #------------------------------------------------------
    def _getRequestParmsDict(self, location_id, starts_on, ends_on, sort, per_page, page) -> dict:
        return dict(
            location_id = location_id,
            starts_on   = starts_on,
            ends_on     = ends_on,
            sort        = sort,
            per_page    = per_page,
            page        = page
        )
            
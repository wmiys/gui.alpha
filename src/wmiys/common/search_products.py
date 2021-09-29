import flask

from .api_wrapper import ApiWrapper
from .pagination import Pagination
from . import constants, flask_request_urls


class SearchProducts:
    """Object that handles the interfacing with the api wrapper
    """

    DEFAULT_PER_PAGE = 20

    def __init__(self, a_oFlaskRequest: flask.request, a_oApiWrapper: ApiWrapper):
        self._request     = a_oFlaskRequest
        self._location_id = a_oFlaskRequest.args.get('location_id') or None
        self._starts_on   = a_oFlaskRequest.args.get('starts_on') or None
        self._ends_on     = a_oFlaskRequest.args.get('ends_on') or None
        self._sort        = a_oFlaskRequest.args.get('sort') or None
        self._page        = a_oFlaskRequest.args.get('page') or 1
        self.apiWrapper   = a_oApiWrapper

    @property
    def location_id(self) -> int:
        return self._location_id
    
    @property
    def starts_on(self):
        return self._starts_on

    @property
    def ends_on(self):
        return self._ends_on

    @property
    def sort(self):
        return self._sort
    
    @property
    def page(self):
        return self._page

    def areRequiredFieldsSet(self) -> bool:
        if None in [self.location_id, self.starts_on, self.ends_on]:
            return False
        else:
            return True


    def searchAll(self):
        return self.apiWrapper.searchProductsAll(self.location_id, self.starts_on, self.ends_on, self.sort, self.DEFAULT_PER_PAGE, self.page)

    def searchMajor(self, product_categories_major_id: int):
        return self.apiWrapper.searchProductsCategoryMajor(self.location_id, self.starts_on, self.ends_on, product_categories_major_id, self.sort, self.DEFAULT_PER_PAGE, self.page)
    
    def searchMinor(self, product_categories_minor_id: int):
        return self.apiWrapper.searchProductsCategoryMinor(self.location_id, self.starts_on, self.ends_on, product_categories_minor_id, self.sort, self.DEFAULT_PER_PAGE, self.page)
    
    def searchSub(self, product_categories_sub_id: int):
        return self.apiWrapper.searchProductsCategorySub(self.location_id, self.starts_on, self.ends_on, product_categories_sub_id, self.sort, self.DEFAULT_PER_PAGE, self.page)


    def transformSearchResults(self, productsApiResponse) -> dict:
        if productsApiResponse.status_code != 200:
            pass
            
        categories = ApiWrapper.getProductCategories(True)

        # split the response into the results and pagination sections
        responseData = productsApiResponse.json()    
        productsData = self.generateImageData(responseData['results'])
        pagination = Pagination(self._request, int(responseData['pagination']['total_pages']))
        
        # merge all the outgoing data into 1 dict
        outData = dict()

        outData['products']          = productsData
        outData['productCategories'] = categories.json()
        # outData['urlParms']          = self._request.args.to_dict()
        outData['pagination']        = pagination.getAllPaginationLinks()
        outData['total_records']     = int(responseData['pagination']['total_records'])
        outData['query_string']      = flask_request_urls.getUrlDict().get('query_string')

        return outData
    
    def generateImageData(self, rawProductJson):
        productsData = rawProductJson
        
        # format the product images
        for product in productsData:
            if product['image'] != None:
                product['image'] = '{}/{}'.format(constants.PRODUCT_IMAGES_PATH, product['image'])
            else:
                product['image'] = '/static/img/placeholder.jpg'
        
        return productsData
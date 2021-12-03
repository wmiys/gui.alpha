from __future__ import annotations
import flask
from .pagination import Pagination
from . import flask_request_urls
from .. import api_wrapper
from ..api_wrapper import ApiWrapperSearchProducts

class SearchProducts:
    """Object that handles the interfacing with the api wrapper."""

    DEFAULT_PER_PAGE = 20


    def __init__(self, flask_request: flask.Request):
        self._request     = flask_request

        self.location_id = flask_request.args.get('location_id') or None
        self.starts_on   = flask_request.args.get('starts_on') or None
        self.ends_on     = flask_request.args.get('ends_on') or None
        self.sort        = flask_request.args.get('sort') or None
        self.page        = flask_request.args.get('page') or 1

        self._api_wrapper = ApiWrapperSearchProducts(flask.g)

    def areRequiredFieldsSet(self) -> bool:
        if None in [self.location_id, self.starts_on, self.ends_on]:
            return False
        else:
            return True


    def searchAll(self):
        return self._api_wrapper.get(self.location_id, self.starts_on, self.ends_on, self.sort, self.DEFAULT_PER_PAGE, self.page)

    def searchMajor(self, product_categories_major_id: int):
        return self._api_wrapper.getMajor(self.location_id, self.starts_on, self.ends_on, product_categories_major_id, self.sort, self.DEFAULT_PER_PAGE, self.page)
    
    def searchMinor(self, product_categories_minor_id: int):
        return self._api_wrapper.getMinor(self.location_id, self.starts_on, self.ends_on, product_categories_minor_id, self.sort, self.DEFAULT_PER_PAGE, self.page)
    
    def searchSub(self, product_categories_sub_id: int):
        return self._api_wrapper.getSub(self.location_id, self.starts_on, self.ends_on, product_categories_sub_id, self.sort, self.DEFAULT_PER_PAGE, self.page)


    def transformSearchResults(self, productsApiResponse) -> dict:
        if productsApiResponse.status_code != 200:
            pass
            
        categories = api_wrapper.getProductCategories(True)

        # split the response into the results and pagination sections
        api_response = productsApiResponse.json()    
        products = self.generateImageData(api_response['results'])
        pagination = Pagination(self._request, int(api_response['pagination']['total_pages']))
        
        # merge all the outgoing data into 1 dict
        outData = dict(
            products          = products,
            productCategories = categories.json(),
            pagination        = pagination.getAllPaginationLinks(),
            total_records     = int(api_response['pagination']['total_records']),
            query_string      = flask_request_urls.getUrlDict().get('query_string'),
        )

        return outData
    
    def generateImageData(self, search_products_results: list[dict]):
        # format the product images
        for product in search_products_results:
            if product['image'] == None:
                product['image'] = '/static/img/placeholder.jpg'                
        
        return search_products_results
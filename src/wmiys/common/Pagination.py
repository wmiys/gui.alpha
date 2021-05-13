
from wmiys.common.Utilities import Utilities
from flask import request

class Pagination:

    def __init__(self, flask_request: request, total_pages: int):
        self._request      = flask_request
        self._page_current = self._request.args.get('page') or 1
        self._page_current = int(self._page_current)
        self._total_pages  = int(total_pages)
    
    @property
    def page_current(self) -> int:
        return int(self._page_current)
    
    @property
    def page_first(self) -> int:
        return 1
    
    @property
    def total_pages(self) -> int:
        return int(self._total_pages)

    @property
    def page_last(self):
        return int(self.total_pages)

    @property
    def page_next(self):
        if self._page_current <= self._total_pages:
            return self._page_current + 1
        else:
            return self._page_current
    
    @property
    def page_previous(self) -> int:
        if self._page_current > self.page_first:
            return self._page_current - 1
        else:
            return self._page_current


    def getAllPaginationLinks(self) -> dict:
        firstUrl    = self.buildUrlWithPage(self.page_first)
        previousUrl = self.buildUrlWithPage(self.page_previous)
        currentUrl  = self.buildUrlWithPage(self.page_current)
        nextUrl     = self.buildUrlWithPage(self.page_next)
        lastUrl     = self.buildUrlWithPage(self.page_last)

        urlsDict = dict(first=firstUrl, previous=previousUrl, current=currentUrl, next=nextUrl, last=lastUrl)
        
        pagesDict = dict(first=self.page_first, previous=self.page_previous, current=self.page_current, next=self.page_next, last=self.page_last)

        return dict(urls=urlsDict, pages=pagesDict)


    def buildUrlWithPage(self, newPageNumber) -> str:
        requestArgsDict = self._request.args.to_dict()

        if newPageNumber == self._page_current:
            # no changes needed since the request url page number is the same as the current one
            return self._request.url

        url = str(self._request.base_url)

        if len(requestArgsDict) == 0:
            if newPageNumber == 1:
                return self._request.url
            else:
                # no GET arguments in the url, so just append the page to the end of the base 
                url += "?page={}".format(newPageNumber)
                return url
        
        requestArgsDict["page"] = str(newPageNumber)

        url += '?'  # need the ? before we add the args

        for key in requestArgsDict:
            value = requestArgsDict.get(key) # assume the current key is not page
            url += "{}={}&".format(key, value)
        
        # don't want any trailing '&', so remove it if present
        if url.endswith("&"):
            url = url[:-1]
        
        return url



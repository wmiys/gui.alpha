from flask import request

def getUrlDict() -> dict:
    
    urlsDict = dict(
        base_url     = str(request.base_url),
        full_path    = str(request.full_path),
        host         = str(request.host),
        host_url     = str(request.host_url),
        path         = str(request.path),
        url          = str(request.url),
        url_charset  = str(request.url_charset),
        url_root     = str(request.url_root),
        url_rule     = str(request.url_rule),
        query_string = str(request.query_string)[2:-1]      # "b'query_string_shit'"
    )
    
    return urlsDict
from flask import request

def getUrlDict() -> dict:
    urlsDict = dict()
    urlsDict['base_url']     = str(request.base_url)
    urlsDict['full_path']    = str(request.full_path)
    urlsDict['host']         = str(request.host)
    urlsDict['host_url']     = str(request.host_url)
    urlsDict['path']         = str(request.path)
    urlsDict['url']          = str(request.url)
    urlsDict['url_charset']  = str(request.url_charset)
    urlsDict['url_root']     = str(request.url_root)
    urlsDict['url_rule']     = str(request.url_rule)

    # request.query_string returns as: "b'query_string_shit'"
    # so strip the shit off
    urlsDict['query_string'] = str(request.query_string)[2:-1]

    return urlsDict
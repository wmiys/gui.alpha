import requests


class ApiWrapper:
    URL_BASE = 'http://10.0.0.82:5000'


    def __init__(self, email=None, password=None):
        self.email = email
        self.password = password


    @staticmethod
    def login(email, password):
        url = ApiWrapper.generateApiUrl('/login')
        r = requests.get(url, params=dict(email=email, password=password))

        return r
    

    @staticmethod
    def createAccount(email, password, name_first, name_last, birth_date):
        url = ApiWrapper.generateApiUrl('/users')
        parms = dict(email=email, password=password, name_first=name_first, name_last=name_last, birth_date=birth_date)
        response = requests.post(url, data=parms)
        return response

    
    @staticmethod
    def generateApiUrl(suffix=''):
        url = "{}{}".format(ApiWrapper.URL_BASE, suffix)
        return url
    
    




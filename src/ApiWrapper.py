import requests


class ApiWrapper:
    URL_BASE = 'http://10.0.0.82:5000'

    def __init__(self, userID=None, email=None, password=None):
        self.userID = userID
        self.email = email
        self.password = password

    
    def getUser(self):
        url = "{}/users/{}".format(ApiWrapper.URL_BASE, self.userID)
        response = requests.get(url, auth=(self.email, self.password))
        return response


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
    
    




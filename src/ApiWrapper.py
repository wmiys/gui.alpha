import requests


class ApiWrapper:
    URL_BASE = 'http://10.0.0.82:5000'


    @staticmethod
    def login(email, password):
        url = "{}/login".format(ApiWrapper.URL_BASE)
        r = requests.get(url, params=dict(email=email, password=password))

        return r




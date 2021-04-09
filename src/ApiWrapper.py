import requests
from Utilities import Utilities
import json

class ApiWrapper:
    URL_BASE = 'http://10.0.0.82:5000'

    #------------------------------------------------------
    # Constructor
    #------------------------------------------------------
    def __init__(self, userID=None, email=None, password=None):
        self.userID = userID
        self.email = email
        self.password = password

    #------------------------------------------------------
    # Get the client's information
    #------------------------------------------------------
    def getUser(self):
        url = "{}/users/{}".format(ApiWrapper.URL_BASE, self.userID)
        response = requests.get(url, auth=(self.email, self.password))
        return response

    #------------------------------------------------------
    # Get a user's products
    #------------------------------------------------------
    def getUserProducts(self):
        url = "{}/users/{}/products".format(ApiWrapper.URL_BASE, self.userID)
        response = requests.get(url, auth=(self.email, self.password))
        return response
    
    #------------------------------------------------------
    # Get a user's products
    #------------------------------------------------------
    def getUserProduct(self, product_id):
        url = "{}/users/{}/products/{}".format(ApiWrapper.URL_BASE, self.userID, product_id)
        response = requests.get(url, auth=(self.email, self.password))
        return response

    #------------------------------------------------------
    # Create a new product
    #------------------------------------------------------
    def postUserProduct(self, newProduct, imageFile):
        url = "{}/users/{}/products".format(ApiWrapper.URL_BASE, self.userID)

        if imageFile:
            productImage = {'image': (imageFile.filename, imageFile)}   # setup the photo to send to the api
        else:
            productImage = None

        response = requests.post(url, auth=(self.email, self.password), files=productImage, data=newProduct)
        return response
    

    #------------------------------------------------------
    # Update a product
    #------------------------------------------------------
    def putUserProduct(self, product_id, updatedProduct, imageFile):
        url = "{}/users/{}/products/{}".format(ApiWrapper.URL_BASE, self.userID, product_id)

        if imageFile:
            productImage = {'image': (imageFile.filename, imageFile)}       # setup the photo to send to the api
        else:
            productImage = None

        response = requests.put(url, auth=(self.email, self.password), files=productImage, data=updatedProduct)

        return response


    #------------------------------------------------------
    # Log a client in
    #------------------------------------------------------
    @staticmethod
    def login(email, password):
        url = ApiWrapper.generateApiUrl('/login')
        r = requests.get(url, params=dict(email=email, password=password))

        return r
    
    #------------------------------------------------------
    # Create a new client account
    #------------------------------------------------------
    @staticmethod
    def createAccount(email, password, name_first, name_last, birth_date):
        url = ApiWrapper.generateApiUrl('/users')
        parms = dict(email=email, password=password, name_first=name_first, name_last=name_last, birth_date=birth_date)
        response = requests.post(url, data=parms)
        return response

    #------------------------------------------------------
    # Generate an API url
    #------------------------------------------------------
    @staticmethod
    def generateApiUrl(suffix=''):
        url = "{}{}".format(ApiWrapper.URL_BASE, suffix)
        return url
    
    
    




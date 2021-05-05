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

    #************************************************************************************
    #                                  USER
    #************************************************************************************
    def getUser(self):
        """Get the client's information
        """
        url = "{}/users/{}".format(ApiWrapper.URL_BASE, self.userID)
        response = requests.get(url, auth=(self.email, self.password))
        return response

    #************************************************************************************
    #                             USER PRODUCTS
    #************************************************************************************
    def getUserProducts(self):
        """Get a user's products
        """

        url = "{}/users/{}/products".format(ApiWrapper.URL_BASE, self.userID)
        response = requests.get(url, auth=(self.email, self.password))
        return response

    def getUserProduct(self, product_id):
        """Get a user's products
        """

        url = "{}/users/{}/products/{}".format(ApiWrapper.URL_BASE, self.userID, product_id)
        response = requests.get(url, auth=(self.email, self.password))
        return response

    def postUserProduct(self, newProduct, imageFile):
        """Create a new product
        """

        url = "{}/users/{}/products".format(ApiWrapper.URL_BASE, self.userID)

        if imageFile:
            productImage = {'image': (imageFile.filename, imageFile)}   # setup the photo to send to the api
        else:
            productImage = None

        response = requests.post(url, auth=(self.email, self.password), files=productImage, data=newProduct)
        return response
    

    def putUserProduct(self, product_id, updatedProduct, imageFile):
        """Update a product
        """

        url = "{}/users/{}/products/{}".format(ApiWrapper.URL_BASE, self.userID, product_id)

        if imageFile:
            productImage = {'image': (imageFile.filename, imageFile)}       # setup the photo to send to the api
        else:
            productImage = None

        response = requests.put(url, auth=(self.email, self.password), files=productImage, data=updatedProduct)

        return response

    

    #************************************************************************************
    #                             PRODUCT AVAILABILITY
    #************************************************************************************
    def getProductAvailabilities(self, product_id):
        """Get the product availabilities for a single product

        Args:
            product_id (int): the product's id

        Returns:
            list: a list of all the product's availabilities
        """

        url = "{}/users/{}/products/{}/availability".format(ApiWrapper.URL_BASE, self.userID, product_id)
        response = requests.get(url, auth=(self.email, self.password))
        return response
    
    def getProductAvailability(self, product_id, product_availability_id):
        """Request a single product availability record

        Args:
            product_id (int): the product id
            product_availability_id (int): id of the desired product availability
        """

        url = "{}/users/{}/products/{}/availability/{}".format(ApiWrapper.URL_BASE, self.userID, product_id, product_availability_id)
        response = requests.get(url, auth=(self.email, self.password))
        return response

    
    def putProductAvailability(self, product_id, product_availability_id, updatedProductAvailability):
        """Update a single product availability record

        Args:
            product_id (int): the product id
            product_availability_id (int): id of the desired product availability
            updatedProductAvailability (dict): a dict containing the request body data
        """


        url = "{}/users/{}/products/{}/availability/{}".format(ApiWrapper.URL_BASE, self.userID, product_id, product_availability_id)
        response = requests.put(url, auth=(self.email, self.password), data=updatedProductAvailability)
        return response


    def deleteProductAvailability(self, product_id, product_availability_id):
        """Delete a single product availability record

        Args:
            product_id (int): the product id
            product_availability_id (int): id of the requested product availability
        """

        url = "{}/users/{}/products/{}/availability/{}".format(ApiWrapper.URL_BASE, self.userID, product_id, product_availability_id)
        response = requests.delete(url, auth=(self.email, self.password))
        return response

    def insertProductAvailability(self, product_id, newProductAvailabilityFormData):
        """Create a new single product availability record

        Args:
            product_id (int): the product id
            newProductAvailabilityFormData (object): the request form data
        """

        url = "{}/users/{}/products/{}/availability".format(ApiWrapper.URL_BASE, self.userID, product_id)
        response = requests.post(url, auth=(self.email, self.password), data=newProductAvailabilityFormData)
        return response

    
    def updateUser(self, user_data):
        url = "{}/users/{}".format(ApiWrapper.URL_BASE, self.userID)
        response = requests.put(url, auth=(self.email, self.password), data=user_data)
        return response



    @staticmethod
    def login(email, password):
        """Log a client in
        """

        url = ApiWrapper.generateApiUrl('/login')
        r = requests.get(url, params=dict(email=email, password=password))

        return r
    

    @staticmethod
    def createAccount(email, password, name_first, name_last, birth_date):
        """Create a new client account
        """

        url = ApiWrapper.generateApiUrl('/users')
        parms = dict(email=email, password=password, name_first=name_first, name_last=name_last, birth_date=birth_date)
        response = requests.post(url, data=parms)
        return response


    @staticmethod
    def generateApiUrl(suffix=''):
        """Generate an API url
        """

        url = "{}{}".format(ApiWrapper.URL_BASE, suffix)
        return url
    
    
    



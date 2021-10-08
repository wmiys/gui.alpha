import requests

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

    #------------------------------------------------------
    # Get the client's information
    #------------------------------------------------------
    def getUser(self):        
        url = "{}/users/{}".format(ApiWrapper.URL_BASE, self.userID)
        response = requests.get(url, auth=(self.email, self.password))
        return response

    #------------------------------------------------------
    # Update a user
    #------------------------------------------------------
    def updateUser(self, user_data):
        url = "{}/users/{}".format(ApiWrapper.URL_BASE, self.userID)
        response = requests.put(url, auth=(self.email, self.password), data=user_data)
        return response

    #************************************************************************************
    #                             USER PRODUCTS
    #************************************************************************************
    
    #------------------------------------------------------
    # Get a user's products
    #------------------------------------------------------
    def getUserProducts(self):
        url = "{}/users/{}/products".format(ApiWrapper.URL_BASE, self.userID)
        response = requests.get(url, auth=(self.email, self.password))
        return response

    #------------------------------------------------------
    # Get a user's product
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


    #************************************************************************************
    #                             PRODUCT AVAILABILITY
    #************************************************************************************

    #------------------------------------------------------
    # Get the product availabilities for a single product
    #
    # Parms:
    #    product_id: the product's id
    #
    # Returns: a list of all the product's availabilities
    #------------------------------------------------------
    def getProductAvailabilities(self, product_id):
        url = "{}/users/{}/products/{}/availability".format(ApiWrapper.URL_BASE, self.userID, product_id)
        response = requests.get(url, auth=(self.email, self.password))
        return response
    
    #------------------------------------------------------
    # Request a single product availability record
    #
    # Parms:
    #   product_id: the product id
    #   product_availability_id: id of the desired product availability
    #
    # Returns the api response
    #------------------------------------------------------
    def getProductAvailability(self, product_id, product_availability_id):
        url = "{}/users/{}/products/{}/availability/{}".format(ApiWrapper.URL_BASE, self.userID, product_id, product_availability_id)
        response = requests.get(url, auth=(self.email, self.password))
        return response


    #------------------------------------------------------
    # Update a single product availability record
    #
    # Parms:
    #   product_id: the product id
    #   product_availability_id: id of the desired product availability
    #   updatedProductAvailability: a dict containing the request body data
    #
    # Returns the api response
    #------------------------------------------------------
    def putProductAvailability(self, product_id, product_availability_id, updatedProductAvailability):
        url = "{}/users/{}/products/{}/availability/{}".format(ApiWrapper.URL_BASE, self.userID, product_id, product_availability_id)
        response = requests.put(url, auth=(self.email, self.password), data=updatedProductAvailability)
        return response


    #------------------------------------------------------
    # Delete a single product availability record
    #
    # Parms:
    #   product_id (int): the product id
    #   product_availability_id (int): id of the requested product availability
    #
    # Returns the api response
    #------------------------------------------------------
    def deleteProductAvailability(self, product_id, product_availability_id):
        url = "{}/users/{}/products/{}/availability/{}".format(ApiWrapper.URL_BASE, self.userID, product_id, product_availability_id)
        response = requests.delete(url, auth=(self.email, self.password))
        return response


    #------------------------------------------------------
    # Create a new single product availability record
    #
    # Parms:
    #   product_id (int): the product id
    #   newProductAvailabilityFormData (object): the request form data
    #
    # Returns the api response
    #------------------------------------------------------
    def insertProductAvailability(self, product_id, newProductAvailabilityFormData):
        url = "{}/users/{}/products/{}/availability".format(ApiWrapper.URL_BASE, self.userID, product_id)
        response = requests.post(url, auth=(self.email, self.password), data=newProductAvailabilityFormData)
        return response



    #************************************************************************************
    #                             PRODUCT SEARCH
    #************************************************************************************
    
    #------------------------------------------------------
    # Search all products
    #------------------------------------------------------
    def searchProductsAll(self, location_id, starts_on, ends_on, sort, per_page, page):
        url = "{}/search/products".format(ApiWrapper.URL_BASE)
        parms = dict(location_id=location_id, starts_on=starts_on, ends_on=ends_on, sort=sort, per_page=per_page, page=page)
        response = requests.get(url, params=parms, auth=(self.email, self.password))
        return response


    #------------------------------------------------------
    # Search all products for major category
    #------------------------------------------------------
    def searchProductsCategoryMajor(self, location_id, starts_on, ends_on, product_category_major_id, sort, per_page, page):
        url = "{}/search/products/categories/major/{}".format(ApiWrapper.URL_BASE, product_category_major_id)
        parms = dict(location_id=location_id, starts_on=starts_on, ends_on=ends_on, sort=sort, per_page=per_page, page=page)
        response = requests.get(url, params=parms, auth=(self.email, self.password))
        return response


    #------------------------------------------------------
    # Search all products for minor category
    #------------------------------------------------------
    def searchProductsCategoryMinor(self, location_id, starts_on, ends_on, product_category_minor_id, sort, per_page, page):
        url = "{}/search/products/categories/minor/{}".format(ApiWrapper.URL_BASE, product_category_minor_id)
        parms = dict(location_id=location_id, starts_on=starts_on, ends_on=ends_on, sort=sort, per_page=per_page, page=page)
        response = requests.get(url, params=parms, auth=(self.email, self.password))
        return response


    #------------------------------------------------------
    # Search all products for sub category
    #------------------------------------------------------
    def searchProductsCategorySub(self, location_id, starts_on, ends_on, product_category_sub_id, sort, per_page, page):
        url = "{}/search/products/categories/sub/{}".format(ApiWrapper.URL_BASE, product_category_sub_id)
        parms = dict(location_id=location_id, starts_on=starts_on, ends_on=ends_on, sort=sort, per_page=per_page, page=page)
        response = requests.get(url, params=parms, auth=(self.email, self.password))
        return response


    #************************************************************************************
    #                             PRODUCT IMAGES
    #************************************************************************************
    
    #------------------------------------------------------
    # Get all the product images for a single product
    #------------------------------------------------------
    def getProductImages(self, product_id):
        url = "{}/users/{}/products/{}/images".format(ApiWrapper.URL_BASE, self.userID, product_id)
        response = requests.get(url, auth=(self.email, self.password))
        return response

    #------------------------------------------------------
    # Create a new product image
    #------------------------------------------------------
    def postProductImages(self, product_id, imageFiles):
        url = "{}/users/{}/products/{}/images".format(ApiWrapper.URL_BASE, self.userID, product_id)
        response = requests.post(url, auth=(self.email, self.password), files=imageFiles)
        return response
    
    #------------------------------------------------------
    # Delete the images for a product
    #------------------------------------------------------
    def deleteProductImages(self, product_id):
        url = "{}/users/{}/products/{}/images".format(ApiWrapper.URL_BASE, self.userID, product_id)
        response = requests.delete(url, auth=(self.email, self.password))
        return response

    
    #************************************************************************************
    #                         PRODUCT LISTINGS
    #************************************************************************************
    
    #------------------------------------------------------
    # Get a product listing
    #------------------------------------------------------
    def getProductListing(self, product_id):
        url = "{}/listings/{}".format(ApiWrapper.URL_BASE, product_id)
        response = requests.get(url, auth=(self.email, self.password))
        return response

    #------------------------------------------------------
    # Get a product listing availability
    #------------------------------------------------------
    def getProductListingAvailability(self, product_id, starts_on, ends_on, location_id):
        url = "{}/listings/{}/availability".format(ApiWrapper.URL_BASE, product_id)
        parms = dict(location_id=location_id, starts_on=starts_on, ends_on=ends_on)
        response = requests.get(url, params=parms, auth=(self.email, self.password))

        return response


    #************************************************************************************
    #                               PAYMENTS
    #************************************************************************************
    
    #------------------------------------------------------
    # Insert a new pending payment request
    #------------------------------------------------------
    def insertPayment(self, product_id, location_id, starts_on, ends_on):
        url = f'''{ApiWrapper.URL_BASE}/payments'''
        parms = dict(product_id=product_id, dropoff_location_id=location_id, starts_on=starts_on, ends_on=ends_on)
        return requests.post(url, data=parms, auth=(self.email, self.password))


    #************************************************************************************
    #                             PRODUCT REQUESTS
    #************************************************************************************

    #------------------------------------------------------
    # Insert a new product request to a lender
    #------------------------------------------------------
    def insertProductRequest(self, payment_id, session_id):
        url = f'''{ApiWrapper.URL_BASE}/requests/received'''
        parms = dict(payment_id=payment_id, session_id=session_id)
        return requests.post(url, data=parms, auth=(self.email, self.password))


    #************************************************************************************
    #                         LOCATIONS
    #************************************************************************************
    
    #------------------------------------------------------
    # Request to get a single location.
    #------------------------------------------------------
    def getLocation(self, location_id: int):
        url = "{}/locations/{}".format(ApiWrapper.URL_BASE, location_id)
        response = requests.get(url, auth=(self.email, self.password))
        return response


    #************************************************************************************
    #                         LOGIN AND OTHER SHIT
    #************************************************************************************
    
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
    # Return all of the product categories from the api
    #
    # Returns the api response of the product categories as either:
    #   - a table
    #   - 3 seperate lists (major, minor, sub)
    #------------------------------------------------------
    @staticmethod
    def getProductCategories(a_bReturnAsSeperate: bool=False):
        url = ApiWrapper.generateApiUrl('/product-categories')

        if a_bReturnAsSeperate:
            url += '?seperate=true'

        response = requests.get(url)
        return response

    #------------------------------------------------------
    # Generate an API url
    #------------------------------------------------------
    @staticmethod
    def generateApiUrl(suffix=''):
        url = "{}{}".format(ApiWrapper.URL_BASE, suffix)
        return url
    
    
    




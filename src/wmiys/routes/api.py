#*******************************************************************************************
# Module:       api
#
# Url Prefix:   /api
#
# Description:  Handles the flask.requests for the front end api
#*******************************************************************************************

import flask
from ..common import ApiWrapper, security as security
from http import HTTPStatus

# module blueprint
bpApi = flask.Blueprint('api', __name__)

@bpApi.route('')
def pHome():
    return 'API bitch'


#------------------------------------------------------
# Get login
#------------------------------------------------------
@bpApi.route('login')
def apiLogin():
    # get the email and password details
    userEmail = flask.request.args.get('email')
    userPassword = flask.request.args.get('password')

    # call the api
    result = ApiWrapper.login(userEmail, userPassword)

    # verify that the login was successful
    if result.status_code != 200:
        flask.abort(result.status_code)

    # set the session variables
    responseData = result.json()
    
    flask.session['userID'] = responseData['id']
    flask.session['email'] = userEmail
    flask.session['password'] = userPassword

    return ('', 200)


#------------------------------------------------------
# Create a new account
#------------------------------------------------------
@bpApi.route('create-account', methods=['POST'])
def apiCreateAccount():
    user_email      = flask.request.form.get('email')
    user_password   = flask.request.form.get('password')
    user_name_first = flask.request.form.get('name_first')
    user_name_last  = flask.request.form.get('name_last')
    user_birth_date = flask.request.form.get('birth_date')

    result = ApiWrapper.createAccount(email=user_email, password=user_password, name_first=user_name_first, name_last=user_name_last, birth_date=user_birth_date)

    if result.status_code != 200:
        flask.abort(result.status_code)

    # set the session variables
    responseData = result.json()
    flask.session['userID'] = responseData['id']
    flask.session['email'] = user_email
    flask.session['password'] = user_password

    return ('', 200)


#------------------------------------------------------
# Create a new product
#------------------------------------------------------
@bpApi.route('products', methods=['POST'])
@security.login_required
def apiProductsPost():
    apiResponse = security.apiWrapper.postUserProduct(flask.request.form, flask.request.files.get('image'))

    if apiResponse.status_code != 200:
        flask.abort(apiResponse.status_code)
    
    return ('', 200)


#------------------------------------------------------
# Modify an existing product
#------------------------------------------------------
@bpApi.route('products/<int:product_id>', methods=['PUT'])
@security.login_required
def apiProductPut(product_id):
    apiResponse = security.apiWrapper.putUserProduct(product_id, flask.request.form, flask.request.files.get('image'))

    if apiResponse.status_code != 200:
        flask.abort(apiResponse.status_code)
    
    return ('', 200)



#------------------------------------------------------
# Handle any flask.requests related a single product availability:
#  - GET:    Retrieve a single product availability record
#  - PUT:    Update a single product availability record
#  - DELETE: Delete a single product availability record
#------------------------------------------------------
@bpApi.route('products/<int:product_id>/availability/<int:product_availability_id>', methods=['GET', 'PUT','DELETE'])
@security.login_required
def apiProductAvailabilityModify(product_id, product_availability_id):
    if flask.request.method == 'GET':
        apiResponse = security.apiWrapper.getProductAvailability(product_id, product_availability_id)

        if apiResponse.status_code != 200:          # error
            flask.abort(apiResponse.status_code)

        return (flask.jsonify(apiResponse.json()), 200)

    apiResponse = None

    if flask.request.method == 'PUT':
        apiResponse = security.apiWrapper.putProductAvailability(product_id, product_availability_id, flask.request.form)
    elif flask.request.method == 'DELETE':
        apiResponse = security.apiWrapper.deleteProductAvailability(product_id, product_availability_id)

    return ('', apiResponse.status_code)


#------------------------------------------------------
# Create a new product availability record
#------------------------------------------------------
@bpApi.route('products/<int:product_id>/availability', methods=['POST'])
@security.login_required
def apiProductAvailability(product_id):
    apiResponse = security.apiWrapper.insertProductAvailability(product_id, flask.request.form)

    if apiResponse.status_code != 200:          # error
        flask.abort(apiResponse.status_code)

    return (flask.jsonify(apiResponse.json()), 200)


#------------------------------------------------------
# Update a user's info
#------------------------------------------------------
@bpApi.route('users', methods=['PUT'])
@security.login_required
def apiUserUpdate():
    apiResponse = security.apiWrapper.updateUser(flask.request.form)

    if apiResponse.status_code != 200:          # error
        flask.abort(apiResponse.status_code)

    return (flask.jsonify(apiResponse.json()), 200)


#------------------------------------------------------
# Get all the product images for a single product.
#------------------------------------------------------
@bpApi.route('products/<int:product_id>/images', methods=['GET'])
@security.login_required
def getProductImages(product_id: int):
    images = security.apiWrapper.getProductImages(product_id)
    return flask.jsonify(images.json())


#------------------------------------------------------
# Delete all the product images for a single product.
#------------------------------------------------------
@bpApi.route('products/<int:product_id>/images', methods=['DELETE'])
@security.login_required
def deleteProductImages(product_id: int):
    security.apiWrapper.deleteProductImages(product_id)
    return ('deleted bitch', 200)


#------------------------------------------------------
# Get all the product images for a single product.
#------------------------------------------------------
@bpApi.route('products/<int:product_id>/images', methods=['POST'])
@security.login_required
def postProductImages(product_id: int):    
    imgsDict = dict(flask.request.files.to_dict()) or None

    if imgsDict:
        security.apiWrapper.postProductImages(product_id, imgsDict)

    return ('', 200)


#------------------------------------------------------
# Get a location based on the location's id.
#------------------------------------------------------
@bpApi.route('locations/<int:location_id>', methods=['GET'])
@security.login_required
def getLocation(location_id: int):    
    locationApiResponse = security.apiWrapper.getLocation(location_id)
    return flask.jsonify(locationApiResponse.json())


#------------------------------------------------------
# Request a product listing availability
#------------------------------------------------------
@bpApi.route('listings/<int:product_id>/availability', methods=['GET'])
@security.login_required
def getProductListingAvailability(product_id: int):    
    apiResponse = security.apiWrapper.getProductListingAvailability(product_id, flask.request.args.get('starts_on'), flask.request.args.get('ends_on'), flask.request.args.get('location_id'))
    return flask.jsonify(apiResponse.json())
    

#------------------------------------------------------
# Submit a new product request
#------------------------------------------------------
@bpApi.route('requests/submitted', methods=['POST'])
@security.login_required
def insertProductRequest():
    # transform the request form into a dict
    data: dict = flask.request.form.to_dict()
    apiResponse = security.apiWrapper.insertProductRequest(data.get('product_id'), data.get('starts_on'), data.get('ends_on'), data.get('location_id'))

    if not apiResponse.ok:
        return (apiResponse.text, HTTPStatus.BAD_REQUEST)
    else:
        return ('', HTTPStatus.CREATED)



@bpApi.route('requests/received/<int:request_id>/<string:status>', methods=['POST'])
@security.login_required
def insertProductRequestResponse(request_id: int, status: str):
    
    apiResponse = security.apiWrapper.insertProductRequestResponse(request_id, status)

    if apiResponse.ok:
        return ('', HTTPStatus.NO_CONTENT.value)
    else:
        return (apiResponse.text, HTTPStatus.BAD_REQUEST)


    



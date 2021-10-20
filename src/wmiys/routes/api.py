#*******************************************************************************************
# Module:       api
#
# Url Prefix:   /api
#
# Description:  Handles the flask.requests for the front end api
#*******************************************************************************************

import flask
from ..common import security as security, api_wrapper
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
    email = flask.request.args.get('email')
    password = flask.request.args.get('password')

    # call the api
    result = api_wrapper.login(email, password)

    # verify that the login was successful
    if result.status_code != 200:
        flask.abort(result.status_code)

    # set the session variables
    responseData = result.json()
    
    flask.session['userID'] = responseData['id']
    flask.session['email'] = email
    flask.session['password'] = password

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

    api_response = api_wrapper.createAccount(email=user_email, password=user_password, name_first=user_name_first, name_last=user_name_last, birth_date=user_birth_date)

    if api_response.status_code != 200:
        flask.abort(api_response.status_code)

    # set the session variables
    responseData = api_response.json()
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
    
    api_wrapper = api_wrapper.ApiWrapperProductAvailability(flask.g)
    
    if flask.request.method == 'GET':
        apiResponse = api_wrapper.get(product_id, product_availability_id)

        if not apiResponse.ok:
            return (apiResponse.text, apiResponse.status_code)
        else:
            return (flask.jsonify(apiResponse.json()), 200)

    apiResponse = None

    if flask.request.method == 'PUT':
        apiResponse = api_wrapper.put(product_availability_id, product_availability_id, flask.request.form.to_dict())
    elif flask.request.method == 'DELETE':
        apiResponse = api_wrapper.delete(product_id, product_availability_id)


    return ('', apiResponse.status_code)


#------------------------------------------------------
# Create a new product availability record
#------------------------------------------------------
@bpApi.route('products/<int:product_id>/availability', methods=['POST'])
@security.login_required
def apiProductAvailability(product_id):
    api_wrapper = api_wrapper.ApiWrapperProductAvailability(flask.g)
    api_response = api_wrapper.post(product_id, flask.request.form.to_dict())

    if api_response.ok:
        return (flask.jsonify(api_response.json()), 200)
    else:
        flask.abort(api_response.status_code)

#------------------------------------------------------
# Update a user's info
#------------------------------------------------------
@bpApi.route('users', methods=['PUT'])
@security.login_required
def apiUserUpdate():
    api = api_wrapper.ApiWrapperUsers(flask.g)
    apiResponse = api.put(flask.request.form.to_dict())

    if apiResponse.status_code != 200:          # error
        flask.abort(apiResponse.status_code)

    return (flask.jsonify(apiResponse.json()), 200)


#------------------------------------------------------
# Get all the product images for a single product.
#------------------------------------------------------
@bpApi.route('products/<int:product_id>/images', methods=['GET'])
@security.login_required
def getProductImages(product_id: int):
    api = api_wrapper.ApiWrapperProductImages(flask.g)
    images = api.get(product_id)
    return flask.jsonify(images.json())


#------------------------------------------------------
# Delete all the product images for a single product.
#------------------------------------------------------
@bpApi.route('products/<int:product_id>/images', methods=['DELETE'])
@security.login_required
def deleteProductImages(product_id: int):
    api = api_wrapper.ApiWrapperProductImages(flask.g)
    response = api.delete(product_id)
    return ('', 204)


#------------------------------------------------------
# Get all the product images for a single product.
#------------------------------------------------------
@bpApi.route('products/<int:product_id>/images', methods=['POST'])
@security.login_required
def postProductImages(product_id: int):    
    imgs: dict = flask.request.files.to_dict() or None

    if imgs:
        api = api_wrapper.ApiWrapperProductImages(flask.g)
        api.post(product_id, imgs)

    return ('', 200)



#------------------------------------------------------
# Get a location based on the location's id.
#------------------------------------------------------
@bpApi.route('locations/<int:location_id>', methods=['GET'])
@security.login_required
def getLocation(location_id: int):
    api_wrapper = api_wrapper.ApiWrapperLocations(flask.g)
    api_response = api_wrapper.get(location_id)

    return flask.jsonify(api_response.json())


#------------------------------------------------------
# Request a product listing availability
#------------------------------------------------------
@bpApi.route('listings/<int:product_id>/availability', methods=['GET'])
@security.login_required
def getProductListingAvailability(product_id: int):    
    api = api_wrapper.ApiWrapperListingAvailability(flask.g)
    availability = api.get(product_id, flask.request.args.get('starts_on'), flask.request.args.get('ends_on'), flask.request.args.get('location_id'))
    return flask.jsonify(availability.json())


#------------------------------------------------------
# Lender responds to a product request
#------------------------------------------------------
@bpApi.route('requests/received/<int:request_id>/<string:status>', methods=['POST'])
@security.login_required
def insertProductRequestResponse(request_id: int, status: str):
    api = api_wrapper.ApiWrapperRequests(flask.g)

    apiResponse = api.put(request_id, status)

    if apiResponse.ok:
        return ('', HTTPStatus.NO_CONTENT.value)
    else:
        return (apiResponse.text, HTTPStatus.BAD_REQUEST)


    



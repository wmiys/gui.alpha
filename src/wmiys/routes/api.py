#*******************************************************************************************
# Module:       api
#
# Url Prefix:   /api
#
# Description:  Handles the flask.requests for the front end api
#*******************************************************************************************

import flask
from uuid import UUID
from http import HTTPStatus
import wmiys.api_wrapper as api_wrapper
from wmiys.common import security as security



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
    api_response = api_wrapper.login(email, password)

    # verify that the login was successful
    if not api_response.ok:
        return (api_response.text, api_response.status_code)

    # set the session variables
    response_data: dict = api_response.json()

    security.clear_session_values()
    
    security.set_session_values(
        user_id  = response_data.get('id'),
        email    = email,
        password = password
    )

    return ('', HTTPStatus.OK.value)


#------------------------------------------------------
# Create a new account
#------------------------------------------------------
@bpApi.post('create-account')
def apiCreateAccount():
    # create an account with the api
    api_response = api_wrapper.createAccount(
        email      = flask.request.form.get('email'),
        password   = flask.request.form.get('password'),
        name_first = flask.request.form.get('name_first'),
        name_last  = flask.request.form.get('name_last'),
        birth_date = flask.request.form.get('birth_date')
    )

    # make sure the API accepted the request successfully
    if not api_response.ok:
        return (api_response.text, api_response.status_code)
    else:
        response_data = api_response.json()
    
    # save user's credentials into the session
    security.clear_session_values()

    security.set_session_values(
        user_id  = response_data.get('id'),
        email    = flask.request.form.get('email'),
        password = flask.request.form.get('password')
    )

    return ('', HTTPStatus.OK.value)


#------------------------------------------------------
# Create a new product
#------------------------------------------------------
@bpApi.post('products')
@security.login_required
def apiProductsPost():
    api = api_wrapper.ApiWrapperProducts(flask.g)
    api_response = api.post(flask.request.form.to_dict(), flask.request.files.get('image'))

    if api_response.ok:
        return ('', HTTPStatus.OK.value)
    else: 
        return (api_response.text, api_response.status_code)
    
    


#------------------------------------------------------
# Modify an existing product
#------------------------------------------------------
@bpApi.route('products/<int:product_id>', methods=['PUT'])
@security.login_required
def apiProductPut(product_id):
    api = api_wrapper.ApiWrapperProducts(flask.g)
    api_response = api.put(product_id, flask.request.form.to_dict(), flask.request.files.get('image'))

    if not api_response.ok:
        return (api_response.text, api_response.status_code)
    
    return ('', HTTPStatus.OK.value)



#------------------------------------------------------
# Handle any flask.requests related a single product availability:
#  - GET:    Retrieve a single product availability record
#  - PUT:    Update a single product availability record
#  - DELETE: Delete a single product availability record
#------------------------------------------------------
@bpApi.route('products/<int:product_id>/availability/<uuid:product_availability_id>', methods=['GET', 'PUT','DELETE'])
@security.login_required
def apiProductAvailabilityModify(product_id, product_availability_id):
    api = api_wrapper.ApiWrapperProductAvailability(flask.g)
    
    if flask.request.method == 'GET':
        apiResponse = api.get(product_id, product_availability_id)
        return (apiResponse.text, apiResponse.status_code)

    if flask.request.method == 'PUT':
        apiResponse = api.put(product_id, product_availability_id, flask.request.form.to_dict())
    elif flask.request.method == 'DELETE':
        apiResponse = api.delete(product_id, product_availability_id)


    return ('', apiResponse.status_code)


#------------------------------------------------------
# Create a new product availability record
#------------------------------------------------------
@bpApi.route('products/<int:product_id>/availability', methods=['POST'])
@security.login_required
def apiProductAvailability(product_id):
    api = api_wrapper.ApiWrapperProductAvailability(flask.g)
    api_response = api.post(product_id, flask.request.form.to_dict())

    return (api_response.text, api_response.status_code)

#------------------------------------------------------
# Update a user's info
#------------------------------------------------------
@bpApi.put('users')
@security.login_required
def apiUserUpdate():
    form         = flask.request.form.to_dict()
    api          = api_wrapper.ApiWrapperUsers(flask.g)
    api_response = api.put(form)

    return (api_response.text, api_response.status_code)

#------------------------------------------------------
# Get a user's info
#------------------------------------------------------
@bpApi.get('users')
@security.login_required
def getUser():
    api = api_wrapper.ApiWrapperUsers(flask.g)
    api_response = api.get()

    return (api_response.text, api_response.status_code)


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
    api_response = api.delete(product_id)
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

    return ('', HTTPStatus.OK.value)



#------------------------------------------------------
# Get a location based on the location's id.
#------------------------------------------------------
@bpApi.route('locations/<int:location_id>', methods=['GET'])
@security.login_required
def getLocation(location_id: int):
    api = api_wrapper.ApiWrapperLocations(flask.g)
    api_response = api.get(location_id)

    return flask.jsonify(api_response.json())


#------------------------------------------------------
# Request a product listing availability
#------------------------------------------------------
@bpApi.route('listings/<int:product_id>/availability', methods=['GET'])
@security.login_required
def getProductListingAvailability(product_id: int):    
    api = api_wrapper.ApiWrapperListingAvailability(flask.g)
    availability = api.get(product_id, flask.request.args.to_dict())
    return flask.jsonify(availability.json())


#------------------------------------------------------
# Lender responds to a product request
#------------------------------------------------------
@bpApi.post('requests/received/<uuid:request_id>/<string:status>')
@security.login_required
def insertProductRequestResponse(request_id: UUID, status: str):
    api = api_wrapper.ApiWrapperRequests(flask.g)

    apiResponse = api.put(request_id, status)

    if apiResponse.ok:
        return ('', HTTPStatus.NO_CONTENT.value)
    else:
        return (apiResponse.text, HTTPStatus.BAD_REQUEST)


#------------------------------------------------------
# Lender responds to a product request
#------------------------------------------------------
@bpApi.get('requests/submitted/<uuid:request_id>')
@security.login_required
def getSubmittedProductRequest(request_id: UUID):
    api = api_wrapper.ApiWrapperRequestSubmitted(flask.g)
    response = api.get(request_id)
    return (response.text, response.status_code)



#------------------------------------------------------
# Create a new balance transfer request
#------------------------------------------------------
@bpApi.post('/balance-transfers')
@security.login_required
def insertBalanceTransfer():
    
    api = api_wrapper.ApiWrapperBalanceTransfers(flask.g)
    api_response = api.post()

    print(api_response.text)

    return (api_response.text, api_response.status_code)

    return flask.jsonify(balance_transfer)



#------------------------------------------------------
# Create a new password reset object
#------------------------------------------------------
@bpApi.post('/password-resets')
def insertPasswordReset():
    api = api_wrapper.ApiWrapperPasswordResets(flask.g)
    api_response = api.post(flask.request.form.get('email'))

    if not api_response.ok:
        return (api_response.text, api_response.status_code)

    return flask.jsonify(api_response.json())


#------------------------------------------------------
# Create a new password reset object
#------------------------------------------------------
@bpApi.put('/password-resets/<uuid:password_reset_id>')
def updatePasswordReset(password_reset_id: UUID):
    api = api_wrapper.ApiWrapperPasswordResets(flask.g)
    password = flask.request.form.get('password')

    try:
        api_response = api.put(password_reset_id, password)
        return (api_response.text, api_response.status_code)

    except Exception as e:
        return (e, HTTPStatus.BAD_REQUEST)



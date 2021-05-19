
"""
Package:        api
Url Prefix:     /api
Description:    Handles the requests for the front end api
"""

import flask
from flask import Blueprint, jsonify, request
from wmiys.common.ApiWrapper import ApiWrapper
import wmiys.common.Security as Security
from wmiys.common.Security import apiWrapper

bpApi = Blueprint('api', __name__)

@bpApi.route('')
def pHome():
    return 'API bitch'


@bpApi.route('login')
def apiLogin():
    # get the email and password details
    userEmail = request.args.get('email')
    userPassword = request.args.get('password')

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


@bpApi.route('create-account', methods=['POST'])
def apiCreateAccount():
    user_email      = request.form.get('email')
    user_password   = request.form.get('password')
    user_name_first = request.form.get('name_first')
    user_name_last  = request.form.get('name_last')
    user_birth_date = request.form.get('birth_date')

    result = ApiWrapper.createAccount(email=user_email, password=user_password, name_first=user_name_first, name_last=user_name_last, birth_date=user_birth_date)

    if result.status_code != 200:
        flask.abort(result.status_code)

    # set the session variables
    responseData = result.json()
    flask.session['userID'] = responseData['id']
    flask.session['email'] = user_email
    flask.session['password'] = user_password

    return ('', 200)


@bpApi.route('products', methods=['POST'])
@Security.login_required
def apiProductsPost():
    apiResponse = apiWrapper.postUserProduct(request.form, request.files.get('image'))

    if apiResponse.status_code != 200:
        flask.abort(apiResponse.status_code)
    
    return ('', 200)

@bpApi.route('products/<int:product_id>', methods=['PUT'])
@Security.login_required
def apiProductPut(product_id):
    apiResponse = apiWrapper.putUserProduct(product_id, request.form, request.files.get('image'))

    if apiResponse.status_code != 200:
        flask.abort(apiResponse.status_code)
    
    return ('', 200)



#------------------------------------------------------
# Handle any requests related a single product availability:
#  - GET:    Retrieve a single product availability record
#  - PUT:    Update a single product availability record
#  - DELETE: Delete a single product availability record
#------------------------------------------------------
@bpApi.route('products/<int:product_id>/availability/<int:product_availability_id>', methods=['GET', 'PUT','DELETE'])
@Security.login_required
def apiProductAvailabilityModify(product_id, product_availability_id):
    if request.method == 'GET':
        apiResponse = apiWrapper.getProductAvailability(product_id, product_availability_id)

        if apiResponse.status_code != 200:          # error
            flask.abort(apiResponse.status_code)

        return (jsonify(apiResponse.json()), 200)

    apiResponse = None

    if request.method == 'PUT':
        apiResponse = apiWrapper.putProductAvailability(product_id, product_availability_id, request.form)
    elif request.method == 'DELETE':
        apiResponse = apiWrapper.deleteProductAvailability(product_id, product_availability_id)

    return ('', apiResponse.status_code)


#------------------------------------------------------
# Create a new product
#------------------------------------------------------
@bpApi.route('products/<int:product_id>/availability', methods=['POST'])
@Security.login_required
def apiProductAvailability(product_id):
    
    apiResponse = apiWrapper.insertProductAvailability(product_id, request.form)

    if apiResponse.status_code != 200:          # error
        flask.abort(apiResponse.status_code)

    return (jsonify(apiResponse.json()), 200)


#------------------------------------------------------
# Update a user's info
#------------------------------------------------------
@bpApi.route('users', methods=['PUT'])
@Security.login_required
def apiUserUpdate():
    apiResponse = apiWrapper.updateUser(request.form)

    if apiResponse.status_code != 200:          # error
        flask.abort(apiResponse.status_code)

    return (jsonify(apiResponse.json()), 200)


#------------------------------------------------------
# Get all the product images for a single product.
#------------------------------------------------------
@bpApi.route('products/<int:product_id>/images', methods=['GET'])
@Security.login_required
def getProductImages(product_id: int):
    images = apiWrapper.getProductImages(product_id)
    return jsonify(images.json())




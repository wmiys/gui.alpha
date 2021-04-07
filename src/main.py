#************************************************************************************
#
#                                   API URL Routing Page
#
#************************************************************************************
import flask
from flask import Flask, jsonify, request, session, redirect, url_for
from flask_cors import CORS
from markupsafe import escape
import os
from ApiWrapper import ApiWrapper
from Utilities import Utilities
from functools import wraps, update_wrapper
from Constants import Constants
import json

app = Flask(__name__)
app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
CORS(app)


apiWrapper = ApiWrapper()



#************************************************************************************
#
#                                   Decorators
#
#************************************************************************************
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        # if user is not logged in, redirect to login page
        if not session:
            return redirect(url_for('login'))

        # set the wrapper authentication members
        global apiWrapper
        apiWrapper.userID = session.get('userID')
        apiWrapper.email = session.get('email')
        apiWrapper.password = session.get('password')

        return f(*args, **kwargs)

    return wrap




#************************************************************************************
#
#                                   Pages
#
#************************************************************************************
@app.route('/')
@login_required
def home():
    return flask.render_template('home.html', email=flask.session.get('email'), password=flask.session.get('password'))


@app.route('/login')
def login():
    # clear the session data
    flask.session.pop('email', None)
    flask.session.pop('password', None)

    return flask.render_template('login.html')


@app.route('/create-account')
def createAccount():
    # clear the session data
    session.pop('email', None)
    session.pop('password', None)

    return flask.render_template('create-account.html')


@app.route('/products', methods=['GET'])
@login_required
def productsGet():
    apiResponse = apiWrapper.getUserProducts()

    if apiResponse.status_code != 200:
        pass    # error

    products = apiResponse.json()

    # format the product images
    for product in products:
        if product['image'] != None:
            product['image'] = '{}/{}'.format(Constants.PRODUCT_IMAGES_PATH, product['image'])
        else:
            product['image'] = '/static/img/placeholder.jpg'

    return flask.render_template('products.html', products=products)


@app.route('/products/new')
@login_required
def productsNew():
    return flask.render_template('products-new.html')


@app.route('/products/<int:product_id>')
@login_required
def productPage(product_id):
    return flask.render_template('product-page.html')


@app.route('/account-settings')
@login_required
def accountSettings():
    response = apiWrapper.getUser()
    return flask.render_template('account-settings.html', userInfo=response.json())



#************************************************************************************
#
#                                   API Calls
#
#************************************************************************************
@app.route('/api/login')
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


@app.route('/api/create-account', methods=['POST'])
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


@app.route('/api/products', methods=['POST'])
@login_required
def apiProductsPost():    
    apiResponse = apiWrapper.postUserProduct(request.form, request.files)

    if apiResponse.status_code != 200:
        flask.abort(apiResponse.status_code)
    
    return ('', 200)

#************************************************************************************
#
#                                   Main function
#
#************************************************************************************
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)








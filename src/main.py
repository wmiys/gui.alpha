#************************************************************************************
#
#                                   API URL Routing Page
#
#************************************************************************************
import flask
from flask import Flask, jsonify, request, current_app
from flask_cors import CORS
from markupsafe import escape
import os

app = Flask(__name__)
CORS(app)


#************************************************************************************
#
#                                   Index
#
#************************************************************************************
@app.route('/')
def home():
    return flask.render_template('home.html')


@app.route('/login')
def login():
    return flask.render_template('login.html')


@app.route('/create-account')
def createAccount():
    return flask.render_template('create-account.html')


@app.route('/products')
def products():
    return flask.render_template('products.html')

@app.route('/products/new')
def productsNew():
    return flask.render_template('products-new.html')


@app.route('/products/<int:product_id>')
def productPage(product_id):
    return flask.render_template('product-page.html')


@app.route('/account-settings')
def accountSettings():
    return flask.render_template('account-settings.html')


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)





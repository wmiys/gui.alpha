"""
Package:        home
Url Prefix:     none
Description:    Handles the routing for the home page, login, and create account
"""

import flask
from flask import Blueprint, jsonify, request
import wmiys.common.Security as Security
from wmiys.common.Security import apiWrapper

bpHome = Blueprint('home', __name__)

@bpHome.route('')
@Security.login_required
def pHome():
    return flask.render_template('pages/home.html', email=flask.session.get('email'), password=flask.session.get('password'))


@bpHome.route('create-account')
def pCreateAccount():
    # clear the session data
    flask.session.pop('email', None)
    flask.session.pop('password', None)
    
    return flask.render_template('pages/create-account.html')


@bpHome.route('login')
def pLogin():
    # clear the session data
    flask.session.pop('email', None)
    flask.session.pop('password', None)

    return flask.render_template('pages/login.html')

"""
Package:        home
Url Prefix:     none
Description:    Handles the routing for the home page, login, and create account
"""

import flask
from ..common import security

bpHome = flask.Blueprint('home', __name__)

@bpHome.route('')
@security.login_required
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

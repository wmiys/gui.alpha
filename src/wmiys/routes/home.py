#*******************************************************************************************
# Module:       home
#
# Url Prefix:   /home
#
# Description:  Handles the routing for the home page, login, and create account
#*******************************************************************************************
import flask
from ..common import security

# module blueprint
bpHome = flask.Blueprint('home', __name__)

#------------------------------------------------------
# Home page (search page)
#------------------------------------------------------
@bpHome.route('')
@security.login_required
def pHome():
    return flask.render_template('pages/home.html', email=flask.session.get('email'), password=flask.session.get('password'))


#------------------------------------------------------
# Create account page
#------------------------------------------------------
@bpHome.route('create-account')
def pCreateAccount():
    # clear the session data
    security.clear_session_values()
    
    return flask.render_template('pages/log-in/create-account.html')

#------------------------------------------------------
# Login page
#------------------------------------------------------
@bpHome.route('login')
def pLogin():
    # clear the session data
    security.clear_session_values()

    return flask.render_template('pages/log-in/login.html')


#------------------------------------------------------
# 404 page
#------------------------------------------------------
@bpHome.route('404')
def p404():
    return flask.render_template('pages/404.html')


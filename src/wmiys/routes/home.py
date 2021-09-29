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
    flask.session.pop('email', None)
    flask.session.pop('password', None)
    
    return flask.render_template('pages/create-account.html')

#------------------------------------------------------
# Login page
#------------------------------------------------------
@bpHome.route('login')
def pLogin():
    # clear the session data
    flask.session.pop('email', None)
    flask.session.pop('password', None)

    return flask.render_template('pages/login.html')

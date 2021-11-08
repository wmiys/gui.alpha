import flask
from functools import wraps
from wmiys_common import config_pairs


SESSION_KEY_USER_ID  = 'userID'
SESSION_KEY_EMAIL    = 'email'
SESSION_KEY_PASSWORD = 'password'

LOGIN_URL_PREFIX = config_pairs.FrontEndUrls.PRODUCTION

#------------------------------------------------------
# Decorator function that verifies that the user's session variables are set.
# If they are, save them to the flask.g object.
# Otherwise, redirect them to the login page.
#------------------------------------------------------
def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        # if user is not logged in, redirect to login page
        if not flask.session:
            redirect_url = f'{LOGIN_URL_PREFIX}/login'
            return flask.redirect(redirect_url, 302)

        # set the flask g object
        flask.g.user_id  = flask.session.get(SESSION_KEY_USER_ID)
        flask.g.email    = flask.session.get(SESSION_KEY_EMAIL)
        flask.g.password = flask.session.get(SESSION_KEY_PASSWORD)

        return f(*args, **kwargs)

    return wrap


#------------------------------------------------------
# Clear the session values
#------------------------------------------------------
def clear_session_values():
    flask.session.clear()

#------------------------------------------------------
# Set the session values with the given values.
#------------------------------------------------------
def set_session_values(user_id: int, email: str, password: str):
    flask.session.setdefault(SESSION_KEY_USER_ID, user_id)
    flask.session.setdefault(SESSION_KEY_EMAIL, email)
    flask.session.setdefault(SESSION_KEY_PASSWORD, password)

#------------------------------------------------------
# show the 404 page
#------------------------------------------------------
def show_404(e: Exception):
    pass
    # return flask.render_template('pages/404.html')




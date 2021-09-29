import flask
from functools import wraps, update_wrapper
from .api_wrapper import ApiWrapper

apiWrapper = ApiWrapper()


def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        # if user is not logged in, redirect to login page
        if not flask.session:
            return flask.redirect(flask.url_for('home.pLogin'))

        # set the wrapper authentication members
        global apiWrapper
        apiWrapper.userID   = flask.session.get('userID')
        apiWrapper.email    = flask.session.get('email')
        apiWrapper.password = flask.session.get('password')

        return f(*args, **kwargs)

    return wrap
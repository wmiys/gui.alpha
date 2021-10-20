import flask
from functools import wraps


def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        # if user is not logged in, redirect to login page
        if not flask.session:
            return flask.redirect(flask.url_for('home.pLogin'))

        # set the flask g object
        flask.g.user_id  = flask.session.get('userID')
        flask.g.email    = flask.session.get('email')
        flask.g.password = flask.session.get('password')

        return f(*args, **kwargs)

    return wrap
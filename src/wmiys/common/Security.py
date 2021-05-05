import flask
from flask import session, redirect, url_for
from wmiys.common.ApiWrapper import ApiWrapper
from functools import wraps, update_wrapper

apiWrapper = ApiWrapper()


def login_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        # if user is not logged in, redirect to login page
        if not session:
            return redirect(url_for('home.pLogin'))

        # set the wrapper authentication members
        global apiWrapper
        apiWrapper.userID = session.get('userID')
        apiWrapper.email = session.get('email')
        apiWrapper.password = session.get('password')

        return f(*args, **kwargs)

    return wrap
import flask
from flask_cors import CORS
from . import routes
from .common import security
from werkzeug.exceptions import HTTPException


def initApp(flaskApp):
    """Sets up and initializes the flask application

    Args:
        flaskApp (obj): the flask application
    """
    
    # flaskApp.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0    # remove cacheing
    flaskApp.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

    flaskApp.config['JSON_SORT_KEYS'] = False               # don't sort the json keys
    flaskApp.config['JSONIFY_PRETTYPRINT_REGULAR'] = False  # print the json pretty

    CORS(flaskApp)                                      # setup the CORS policy


def registerBlueprints(flaskApp):
    """Register all of the Flask blueprints

    Args:
        flaskApp (obj): the flask application
    """
    flaskApp.register_blueprint(routes.home.bpHome, url_prefix='/')
    flaskApp.register_blueprint(routes.api.bpApi, url_prefix='/api')
    flaskApp.register_blueprint(routes.products.bpProducts, url_prefix='/products')
    flaskApp.register_blueprint(routes.account_settings.bpAccountSettings, url_prefix='/account-settings')
    flaskApp.register_blueprint(routes.search_products.bpSearchProducts, url_prefix='/search/products')
    flaskApp.register_blueprint(routes.listings.bpProductListings, url_prefix='/listings')
    flaskApp.register_blueprint(routes.checkout.bpCreateCheckoutSession, url_prefix='/checkout')
    flaskApp.register_blueprint(routes.setup.bpSetup, url_prefix='/setup')

# register the abort 404 page
def register404Page(flaskApp: flask.Flask):
    flaskApp.register_error_handler(Exception, security.show_404)


app = flask.Flask(__name__)
initApp(app)
registerBlueprints(app)
register404Page(app)



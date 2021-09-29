from flask import Flask
from flask_cors import CORS
from . import routes


def initApp(flaskApp):
    """Sets up and initializes the flask application

    Args:
        flaskApp (obj): the flask application
    """
    
    # flaskApp.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0    # remove cacheing
    flaskApp.secret_key = b'_5#y2L"F4Q8z\n\xec]/'
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


app = Flask(__name__)
initApp(app)
registerBlueprints(app)

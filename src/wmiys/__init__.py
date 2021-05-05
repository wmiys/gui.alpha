from flask import Flask
from flask_cors import CORS
from wmiys.home.controllers import bpHome
from wmiys.api.controllers import bpApi
from wmiys.products.controllers import bpProducts
from wmiys.account_settings.controllers import bpAccountSettings


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
    flaskApp.register_blueprint(bpHome, url_prefix='/')
    flaskApp.register_blueprint(bpApi, url_prefix='/api')
    flaskApp.register_blueprint(bpProducts, url_prefix='/products')
    flaskApp.register_blueprint(bpAccountSettings, url_prefix='/account-settings')


app = Flask(__name__)
initApp(app)
registerBlueprints(app)

import flask
from flask_cors import CORS
from . import routes
from .common import security
from werkzeug.exceptions import HTTPException
import wmiys_common
import wmiys.api_wrapper.base
import wmiys.common.security
import wmiys.payments.payout_accounts
import wmiys.routes.account_settings




#----------------------------------------------------------
# Sets up and initializes the flask application (NEW WAY)
#----------------------------------------------------------
def configure_app(flask_app: flask.Flask):
    # set the flask configuration values for either production or development
    if flask_app.env == "production":
        flask_app.config.from_object(wmiys_common.config.Production)
    else:
        flask_app.config.from_object(wmiys_common.config.Dev)

    flask_app.secret_key = flask_app.config.get('SECRET_KEY_GUI')

    CORS(flask_app)

    _set_static_url_values(flask_app)
    
#----------------------------------------------------------
# Setup some static url values
#----------------------------------------------------------
def _set_static_url_values(flask_app: flask.Flask):
    # get the config url prefixes
    api_prefix = flask_app.config.get('URL_API')
    gui_prefix = flask_app.config.get('URL_GUI')

    # assign them
    wmiys.api_wrapper.base.URL_BASE         = api_prefix
    wmiys.common.security.LOGIN_URL_PREFIX  = gui_prefix
    wmiys.payments.payout_accounts.URL_BASE = gui_prefix
    wmiys.routes.account_settings.URL_BASE  = gui_prefix


#----------------------------------------------------------
# Register all of the Flask blueprints
#----------------------------------------------------------
def register_blueprints(flaskApp):
    flaskApp.register_blueprint(routes.home.bpHome, url_prefix='/')
    flaskApp.register_blueprint(routes.api.bpApi, url_prefix='/api')
    flaskApp.register_blueprint(routes.products.bpProducts, url_prefix='/products')
    flaskApp.register_blueprint(routes.account_settings.bpAccountSettings, url_prefix='/account-settings')
    flaskApp.register_blueprint(routes.search_products.bpSearchProducts, url_prefix='/search/products')
    flaskApp.register_blueprint(routes.listings.bpProductListings, url_prefix='/listings')
    flaskApp.register_blueprint(routes.checkout.bpCreateCheckoutSession, url_prefix='/checkout')
    flaskApp.register_blueprint(routes.setup.bpSetup, url_prefix='/setup')
    flaskApp.register_blueprint(routes.password_reset.bpPasswordReset, url_prefix='/password-reset')

#----------------------------------------------------------
# register the abort 404 page
#----------------------------------------------------------
def register404Page(flaskApp: flask.Flask):
    flaskApp.register_error_handler(Exception, security.show_404)


app = flask.Flask(__name__)
# initApp(app)
configure_app(app)
register_blueprints(app)
register404Page(app)



#*******************************************************************************************
# Module:       password_reset
#
# Url Prefix:   /password-reset
#
# Description:  Reset/update a user's password
#*******************************************************************************************
from uuid import UUID
import flask
from wmiys.common import security

# module blueprint
bpPasswordReset = flask.Blueprint('bpPasswordReset', __name__)

#------------------------------------------------------
# Page to reset password
#------------------------------------------------------
@bpPasswordReset.route('<uuid:password_reset_id>')
def get(password_reset_id: UUID):
    security.clear_session_values()
    return flask.render_template('pages/password-reset/reset.html')

from __future__ import annotations
import flask
from enum import Enum
from datetime import datetime
from . import security, api_wrapper2


DATE_FORMAT_TOKEN = '%m/%d/%y'
DATE_KEYS = ['ends_on', 'starts_on', 'expires_on']


#------------------------------------------------------
# Possible request status values
#------------------------------------------------------
class RequestStatus(str, Enum):
    accepted = 'accepted'
    denied   = 'denied'
    expired  = 'expired'
    pending  = 'pending'

#------------------------------------------------------
# Bootstrap badge classes
#------------------------------------------------------
class StatusBadge(str, Enum):
    danger  = 'danger'
    light   = 'light'
    success = 'success'


#------------------------------------------------------
# Returns all the product request api response from the api
#------------------------------------------------------
def getRequests(status: str=RequestStatus.pending.value) -> list[dict]:
    api = api_wrapper2.ApiWrapperRequests(flask.g)
    apiResponse = api.get(status)
    requests = apiResponse.json()
    
    for request in requests:
        _formatRequestDates(request)
        request['status_badge_class'] = _getStatusBadgeValue(request.get('status')).value

    return requests


#------------------------------------------------------
# Format each of the request date fields
#------------------------------------------------------
def _formatRequestDates(request: dict) -> None:
    for key in DATE_KEYS:
        request[key] = datetime.fromisoformat(request[key]).strftime(DATE_FORMAT_TOKEN)


#------------------------------------------------------
# Determine which badge css class to send to the browser
#------------------------------------------------------
def _getStatusBadgeValue(request_status) -> StatusBadge:
    if request_status == RequestStatus.pending.value:
        return StatusBadge.light
    elif request_status == RequestStatus.accepted.value:
        return StatusBadge.success
    else:
        return StatusBadge.danger
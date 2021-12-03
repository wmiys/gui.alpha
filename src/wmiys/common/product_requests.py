from __future__ import annotations
import flask
from enum import Enum
from datetime import datetime, timedelta
from wmiys_common import utilities
from ..api_wrapper import ApiWrapperRequests, ApiWrapperRequestsSubmitted


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
    warning = 'warning'


#------------------------------------------------------
# Returns all the product request api response from the api
#------------------------------------------------------
def getRequests(status: str=RequestStatus.pending.value) -> list[dict]:
    api = ApiWrapperRequests(flask.g)
    apiResponse = api.get(status)
    requests = apiResponse.json()
    
    for request in requests:
        _formatRequestDates(request)
        request['status_badge_class'] = _getStatusBadgeValue(request.get('status')).value

    return requests


#------------------------------------------------------
# Get all submitted requests
#------------------------------------------------------
def getSubmitted() -> list[dict]:
    api = ApiWrapperRequestsSubmitted(flask.g)
    requests_api_response = api.get()

    if not requests_api_response.ok:
        flask.abort(400)

    requests = requests_api_response.json()
    
    for request in requests:
        _formatRequestDates(request)
        request['status_badge_class'] = _getStatusBadgeValue(request.get('status')).value
        request['total_charge'] = _calculateTotalCharge(request.get('price_total'), request.get('fee_renter'))
        request['hours_till_expiration'] = _calculateNumHoursTillExpires(request.get('created_on'))
        
    return requests


#------------------------------------------------------
# Format each of the request date fields
#------------------------------------------------------
def _formatRequestDates(request: dict) -> None:
    for key in DATE_KEYS:
        if key in request:
            request[key] = datetime.fromisoformat(request[key]).strftime(DATE_FORMAT_TOKEN)

#------------------------------------------------------
# Determine which badge css class to send to the browser
#------------------------------------------------------
def _getStatusBadgeValue(request_status) -> StatusBadge:
    if request_status == RequestStatus.pending.value:
        return StatusBadge.light
    elif request_status == RequestStatus.accepted.value:
        return StatusBadge.success
    elif request_status == RequestStatus.expired.value:
        return StatusBadge.warning
    else:
        return StatusBadge.danger

#------------------------------------------------------
# Calculate the total charge for a renter
#------------------------------------------------------
def _calculateTotalCharge(price_total: float, fee_renter: float) -> str:
    charge = price_total + fee_renter
    return "{:,.2f}".format(charge)

#------------------------------------------------------
# Calculate the number of hours till a submitted request expires
#------------------------------------------------------
def _calculateNumHoursTillExpires(created_on: datetime) -> int:
    expires_on = datetime.fromisoformat(created_on) + timedelta(days=1)
    return round(utilities.getDurationHours(datetime.now(), expires_on))







    

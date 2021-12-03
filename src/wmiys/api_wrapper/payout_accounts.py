import requests
from uuid import UUID
from . import ApiWrapperBase, RequestParms, ApiUrls


class ApiWrapperPayoutAccounts(ApiWrapperBase):
    "Api Wrapper for Payout Accounts"

    URL = ApiUrls.PAYOUT_ACCOUNTS

    #------------------------------------------------------
    # Create a new payout account
    #------------------------------------------------------
    def post(self) -> requests.Response:
        parms = RequestParms(
            url = self.URL
        )

        return self._post(parms)

    #------------------------------------------------------
    # Confirm a lender's payout account
    #------------------------------------------------------
    def put(self, payout_account_id: UUID, confirmed: bool) -> requests.Response:
        parms = RequestParms(
            url = f'{self.URL}/{str(payout_account_id)}',
            data = dict(confirmed=confirmed),
        )

        return self._put(parms)
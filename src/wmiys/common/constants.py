from enum import Enum


class DevelopmentUrls(str, Enum):
    API       = 'http://10.0.0.82:5000'
    FRONT_END = 'http://10.0.0.82:8000'


class ProductionUrls(str, Enum):
    API       = 'https://api.wmiys.com'
    FRONT_END = 'https://wmiys.com'




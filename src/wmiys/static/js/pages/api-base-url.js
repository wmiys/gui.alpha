
export const API_URL_PREFIX = {
    Production: 'https://api.wmiys.com',
    Development: 'http://10.0.0.82:5000',
}

export const API_BASE_URL = window.location.hostname == '10.0.0.82' ? API_URL_PREFIX.Development : API_URL_PREFIX.Production

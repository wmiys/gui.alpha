/************************************************************************** 

This is the Rollup.JS configuration file.

***************************************************************************/


class RollupConfig
{
    constructor(input, output) {
        this.input = input;

        this.output = {
            format: 'iife',
            compact: true,
            sourcemap: true,
            file: output,
        }
    }
}


const configs = [
    new RollupConfig('pages/create-account.js', 'dist/create-account.bundle.js'),
    new RollupConfig('pages/home.js', 'dist/home.bundle.js'),
    new RollupConfig('pages/login.js', 'dist/login.bundle.js'),
    new RollupConfig('pages/account-settings/general.js', 'dist/account-settings-general.bundle.js'),
    new RollupConfig('pages/account-settings/requests-submitted.js', 'dist/account-settings-requests-submitted.bundle.js'),
    new RollupConfig('pages/password-reset/index.js', 'dist/password-reset-index.bundle.js'),
    new RollupConfig('pages/product-listings/product-listing.js', 'dist/product-listings-product-listing.bundle.js'),
    new RollupConfig('pages/products/inventory.js', 'dist/products-inventory.bundle.js'),
    new RollupConfig('pages/products/overview.js', 'dist/products-overview.bundle.js'),
    new RollupConfig('pages/products/requests.js', 'dist/products-requests.bundle.js'),
    new RollupConfig('pages/products/product/availability.js', 'dist/products-product-availability.bundle.js'),
    new RollupConfig('pages/products/product/insights.js', 'dist/products-product-insights.bundle.js'),
    new RollupConfig('pages/products/product/overview/main.js', 'dist/products-product-overview.bundle.js'),
    new RollupConfig('pages/products/product/settings.js', 'dist/products-product-settings.bundle.js'),
    new RollupConfig('pages/search-products/results.js', 'dist/search-products-results.bundle.js'),
];



// rollup.config.js
export default configs;
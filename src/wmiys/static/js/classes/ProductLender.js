

class ProductLender {
    
    /**********************************************************
    Constructor
    **********************************************************/
    constructor(a_apiResponse) {
        this.created_on                  = null;
        this.description                 = null;
        this.id                          = null;
        this.image                       = null;
        this.location_city               = null;
        this.location_id                 = null;
        this.location_state_id           = null;
        this.location_state_name         = null;
        this.name                        = null;
        this.price_full                  = null;
        this.price_half                  = null;
        this.product_categories_sub_id   = null;
        this.product_categories_sub_name = null;
        this.user_id                     = null;
        
        
        const keys = Object.keys(this);
        
        // fill in all the fields
        for (let count = 0; count < keys.length; count++) {
            const key = keys[count];
            
            if (a_apiResponse.hasOwnProperty(key)) {
                this[key] = a_apiResponse[key];
            }
        }
        
    }

    /**********************************************************
    Generates the html for the product
    **********************************************************/
    getHtml() {
        const productPageUrl = this.getProductPageUrl();
        const formattedPriceFull = Utilities.toCurrencyFormat(this.price_full);
        const formattedPriceHalf = Utilities.toCurrencyFormat(this.price_half);
        const displayLocation = `${this.location_city}, ${this.location_state_id}`;


        let imgSrc = "/static/img/placeholder.jpg";
        if (this.image != null) {
            imgSrc = `http://10.0.0.82/files/api.wmiys/src/product-images/${this.image}`;
        }

        let html = `
        <div class="card card-lender-product-listing mb-5" data-product-id="${this.id}">
            <div class="row no-gutters">
                <div class="col-md-4 col-sm-12">
                    <a href="${productPageUrl}" class="d-flex flex-column h-100 justify-content-center"><img src="${imgSrc}" class="img-fluid mx-auto d-block" height="200px" alt="..."></a>
                </div>
                <div class="col-md-8 col-sm-12">
                    <div class="card-body p-4 h-100">
                        <div class="d-flex align-items-center justify-content-between">
                            <h4 class="card-lender-product-detail">${this.name}</h4>

                            <div class="dropdown">
                                <button class="btn btn-sm no-focus-outline" type="button" data-toggle="dropdown">
                                    <i class='bx bx-dots-horizontal-rounded'></i>
                                </button>
                                <div class="dropdown-menu dropdown-menu-right">
                                    <a class="dropdown-item" href="${productPageUrl}">Details</a>
                                    <a class="dropdown-item" href="#">View Listing</a>
                                </div>
                            </div>
                        </div>

                        <p class="card-text text-muted">${displayLocation}</p>

                        <div class="product-rating mb-2">
                            <i class='bx bxs-star rating-star rating-star-filled'></i>
                            <i class='bx bxs-star rating-star rating-star-filled'></i>
                            <i class='bx bxs-star rating-star rating-star-filled'></i>
                            <i class='bx bxs-star-half rating-star rating-star-filled'></i>
                            <i class='bx bxs-star rating-star'></i>
                            <span class="badge badge-pill badge-dark ml-2">3.6</span>
                        </div>

                        <div class="row">
                            <div class="col-sm-12 col-md-4">
                                <div><small class="text-muted font-weight-light">Full Day</small></div>
                                <div class="h5 text-secondary">${formattedPriceFull}</div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div><small class="text-muted font-weight-light">Half Day</small></div>
                                <div class="h5 text-secondary">${formattedPriceHalf}</div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div><small class="text-muted font-weight-light">Category</small></div>
                                <div class="h5 text-secondary">${this.product_categories_sub_name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;
        
        return html;
    }


    /**********************************************************
    Generates a skeleton card html element
    **********************************************************/
    static getHtmlSkeleton() {
        let html = `
        <div class="card card-lender-product-listing mb-5">
            <div class="row no-gutters">
                <div class="col-md-4 col-sm-12">
                    <a href="#"><img src="/static/img/placeholder.jpg" class="card-img" alt="..."></a>
                </div>
                <div class="col-md-8 col-sm-12">
                    <div class="card-body p-4 h-100">
                        <div class="d-flex align-items-center justify-content-between">
                            <h4 class="card-lender-product-detail">
                                <div class="skeleton-text skeleton-effect-wave">Card title of this product</div>
                            </h4>
                        </div>

                        <p class="card-text text-muted">
                        <div class="skeleton-text skeleton-effect-wave">Location, OH</div>
                        </p>

                        <div class="product-rating mb-2">
                            <div class="skeleton-text skeleton-effect-wave">ajskdlfjaklsf jjasdfjlas dfkjlasdjf lasdf</div>
                        </div>

                        <div class="row">
                            <div class="col-sm-12 col-md-4">
                                <div class="skeleton-text skeleton-effect-wave">505050</div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="skeleton-text skeleton-effect-wave">505050</div>
                            </div>
                            <div class="col-sm-12 col-md-4">
                                <div class="skeleton-text skeleton-effect-wave">505050</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>`;

        return html;
    }

    /**********************************************************
    Generates the url to the product page
    **********************************************************/
    getProductPageUrl() {
        return `product.php?product_id=${this.id}`;
    }
    
}




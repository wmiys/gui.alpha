<!doctype html>
<html lang="en">

<head>
    <?php include('header.php'); ?>
    <title>Create a new product</title>
</head>

<body>
    <?php include('navbar.php'); ?>

    <div class="container pb-3">

        <h1 class="text-center mt-5">New Product</h1>

        <form class="form-new-product mt-5">

            <ul class="nav nav-pills nav-fill form-new-product-tabs" id="myTab" role="tablist">
                <li class="nav-item" role="presentation">
                    <a class="nav-link active" data-toggle="tab" href="#form-new-product-page-category" role="tab">Category</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class="nav-link " data-toggle="tab" href="#form-new-product-page-location" role="tab">Location</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" data-toggle="tab" href="#form-new-product-page-renter-info" role="tab">Renter Info</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" data-toggle="tab" href="#form-new-product-page-photos" role="tab">Photos</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" data-toggle="tab" href="#form-new-product-page-name-desc" role="tab">Name and Description</a>
                </li>
                <li class="nav-item" role="presentation">
                    <a class="nav-link" data-toggle="tab" href="#form-new-product-page-price" role="tab">Price</a>
                </li>
            </ul>

            <hr>

            <div class="tab-content form-new-product-pages">

                <!-- category -->
                <div class="tab-pane fade show active" id="form-new-product-page-category">
                    <!-- major -->
                    <div class="form-group mt-5">
                        <label for="form-new-product-input-category-major">Major category</label>
                        <select class="form-control form-new-product-input" id="form-new-product-input-category-major" required>
                            <option selected disabled class="d-none">Choose...</option>
                        </select>
                        <div class="invalid-feedback">Invalid feedback text</div>
                    </div>

                    <!-- minor -->
                    <div class="form-group">
                        <label for="form-new-product-input-category-minor">Minor category</label>
                        <select class="form-control form-new-product-input" id="form-new-product-input-category-minor" required disabled>
                            <option selected disabled class="d-none">Choose...</option>
                        </select>
                        <div class="invalid-feedback">Invalid feedback text</div>
                    </div>

                    <!-- sub -->
                    <div class="form-group">
                        <label for="form-new-product-input-category-sub">Sub category</label>
                        <select class="form-control form-new-product-input" id="form-new-product-input-category-sub" required disabled>
                            <option selected disabled class="d-none">Choose...</option>
                        </select>
                        <div class="invalid-feedback">Invalid feedback text</div>
                    </div>

                    <div class="form-new-product-step-btns">
                        <button type="button" data-page-location="1" class="btn btn-secondary form-new-product-btn-step mr-2" disabled>Previous</button>
                        <button type="button" data-page-location="2" class="btn btn-primary form-new-product-btn-step">Next</button>
                    </div>
                </div>

                <!-- location -->
                <div class="tab-pane fade" id="form-new-product-page-location">
                    <div class="form-group mt-5">
                        <label for="form-new-product-input-location">Find your location</label>

                        <div class="input-group input-group-search">
                            <div class="input-group-prepend">
                                <span class="input-group-text" id="basic-addon1"><i class='bx bx-search'></i></span>
                            </div>
                            <select class="form-control form-new-product-input" id="form-new-product-input-location" required placeholder="Search">
                                <option>Search</option>
                            </select>
                        </div>
                        <div class="invalid-feedback">Invalid feedback text</div>
                    </div>

                    <div class="form-new-product-step-btns">
                        <button type="button" data-page-location="1" class="btn btn-secondary form-new-product-btn-step mr-2">Previous</button>
                        <button type="button" data-page-location="3" class="btn btn-primary form-new-product-btn-step">Next</button>
                    </div>
                </div>

                <!-- Renter Info -->
                <div class="tab-pane fade" id="form-new-product-page-renter-info">
                    <p class="mt-5">Placeholder for all the shit we are going to display to the lender about the renters.</p>

                    <div class="form-new-product-step-btns">
                        <button type="button" data-page-location="2" class="btn btn-secondary form-new-product-btn-step mr-2">Previous</button>
                        <button type="button" data-page-location="4" class="btn btn-primary form-new-product-btn-step">Next</button>
                    </div>
                </div>


                <!-- photos -->
                <div class="tab-pane fade" id="form-new-product-page-photos">
                    <div class="form-group mt-5">
                        <div class="custom-file">
                            <input type="file" class="custom-file-input form-new-product-input" id="form-new-product-input-photos">
                            <label class="custom-file-label" for="form-new-product-input-photos">Choose up to 5 photos</label>
                        </div>
                        <div class="invalid-feedback">Invalid feedback text</div>
                    </div>

                    <hr class="mt-5">
                    <p>We can put tips and advice here for selecting good, quality photos.</p>

                    <div class="form-new-product-step-btns">
                        <button type="button" data-page-location="3" class="btn btn-secondary form-new-product-btn-step mr-2">Previous</button>
                        <button type="button" data-page-location="5" class="btn btn-primary form-new-product-btn-step">Next</button>
                    </div>
                </div>

                <!-- name and description -->
                <div class="tab-pane fade" id="form-new-product-page-name-desc">
                    <!-- name -->
                    <div class="form-group mt-5">
                        <label for="form-new-product-input-name">Name</label>
                        <input class="form-control form-new-product-input" id="form-new-product-input-name" type="text" required>
                        <div class="invalid-feedback">Invalid feedback text</div>
                    </div>

                    <!-- description -->
                    <div class="form-group mt-3">
                        <label for="form-new-product-input-description">Description</label>
                        <textarea class="form-control form-new-product-input" id="form-new-product-input-description" rows="7" required></textarea>
                        <div class="invalid-feedback">Invalid feedback text</div>
                    </div>

                    <div class="form-new-product-step-btns">
                        <button type="button" data-page-location="4" class="btn btn-secondary form-new-product-btn-step mr-2">Previous</button>
                        <button type="button" data-page-location="6" class="btn btn-primary form-new-product-btn-step">Next</button>
                    </div>

                </div>

                <!-- price -->
                <div class="tab-pane fade" id="form-new-product-page-price">
                    <!-- full day price -->
                    <div class="form-group mt-5">
                        <label for="form-new-product-input-price-full">Full day price</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">$</span>
                            </div>
                            <input class="form-control form-new-product-input" id="form-new-product-input-price-full" type="text" inputmode="decimal" required>
                            <div class="input-group-append">
                                <span class="input-group-text">Per hour</span>
                            </div>
                        </div>
                        <div class="invalid-feedback">Invalid feedback text</div>
                    </div>

                    <!-- half day price -->
                    <div class="form-group mt-3">
                        <label for="form-new-product-input-price-half">Half day price</label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">$</span>
                            </div>
                            <input inputmode="decimal" class="form-control form-new-product-input" id="form-new-product-input-price-half" type="text" required>
                            <div class="input-group-append">
                                <span class="input-group-text">Per hour</span>
                            </div>
                        </div>
                        <div class="invalid-feedback">Invalid feedback text</div>
                    </div>

                    <div class="form-new-product-step-btns">
                        <button type="button" data-page-location="5" class="btn btn-secondary form-new-product-btn-step mr-2">Previous</button>
                        <button type="button" class="btn btn-success form-new-product-btn-submit">Submit</button>
                    </div>

                </div>
            </div>
        </form>
    </div>


    <?php include('footer.php'); ?>
    <script src="js/create-product.js"></script>

</body>

</html>
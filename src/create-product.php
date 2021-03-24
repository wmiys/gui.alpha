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
                    <a class="nav-link" data-toggle="tab" href="#form-new-product-page-location" role="tab">Location</a>
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
                            <option data-id="1">Water</option>
                            <option data-id="2">Land</option>
                        </select>
                        <div class="invalid-feedback">Invalid feedback text</div>
                    </div>

                    <!-- minor -->
                    <div class="form-group">
                        <label for="form-new-product-input-category-minor">Minor category</label>
                        <select class="form-control form-new-product-input" id="form-new-product-input-category-minor" required disabled>
                            <option selected disabled class="d-none">Choose...</option>
                            <option data-id="1" data-parent-category="1">Water Transportation</option>
                            <option data-id="2" data-parent-category="1">Snorkeling</option>
                            <option data-id="3" data-parent-category="2">Relaxation</option>
                            <option data-id="4" data-parent-category="2">Beach Games</option>
                            <option data-id="5" data-parent-category="2">Technology </option>
                            <option data-id="6" data-parent-category="2">Camping Gear</option>
                            <option data-id="7" data-parent-category="2">Inflatable toys for pools</option>
                        </select>
                        <div class="invalid-feedback">Invalid feedback text</div>
                    </div>

                    <!-- sub -->
                    <div class="form-group">
                        <label for="form-new-product-input-category-sub">Sub category</label>
                        <select class="form-control form-new-product-input" id="form-new-product-input-category-sub" required disabled>
                            <option selected disabled class="d-none">Choose...</option>
                            <option data-parent-category="1">Kayak</option>
                            <option data-parent-category="1">Paddleboards</option>
                            <option data-parent-category="1">Surfboards</option>
                            <option data-parent-category="1">Boogie boards</option>
                            <option data-parent-category="2">Snorkel </option>
                            <option data-parent-category="2">Fins</option>
                            <option data-parent-category="2">Life vests</option>
                            <option data-parent-category="3">Chairs</option>
                            <option data-parent-category="3">Umbrellas</option>
                            <option data-parent-category="3">Shade Canopies/Tents</option>
                            <option data-parent-category="3">Hammocks </option>
                            <option data-parent-category="3">Blowup Chairs</option>
                            <option data-parent-category="3">Coolers</option>
                            <option data-parent-category="4">Spike ball</option>
                            <option data-parent-category="4">Volleyball</option>
                            <option data-parent-category="4">Football</option>
                            <option data-parent-category="4">Baggo</option>
                            <option data-parent-category="5">Bluetooth Speakers</option>
                            <option data-parent-category="5">Power bank with solar charger</option>
                            <option data-parent-category="5">Gopro</option>
                            <option data-parent-category="5">Beach Lock box</option>
                            <option data-parent-category="5">Waterproof phone case</option>
                            <option data-parent-category="5">SHARK DETERRENT ARMBAND</option>
                            <option data-parent-category="5">Metal detector </option>
                            <option data-parent-category="6">Tent </option>
                            <option data-parent-category="6">Grill </option>
                            <option data-parent-category="7">THAT BIG ASS PINK FLAMINGO!!!!!!!!!!</option>
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
                    <!-- location -->
                    <div class="form-group mt-5">
                        <label for="form-new-product-input-location">Find your location</label>
                        <input class="form-control form-new-product-input" id="form-new-product-input-location" placeholder="Enter city or state" type="text" required>
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
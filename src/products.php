<!doctype html>
<html lang="en">

<head>
    <?php include('header.php'); ?>
    <title>Your products</title>
</head>

<body>
    <?php include('navbar.php'); ?>
    <div class="container">
        

        <div class="row align-items-center mt-5 mb-3">
            <div class="col-md-8">
                <h2>Your products</h2>
            </div>

            <div class="col-md-4">
                <a href="create-product.php" role="button" class="btn btn-sm btn-outline-primary float-right">Create new product</a>
            </div>
        </div>

        <div id="lender-product-listings"></div>


    </div>


    <?php include('footer.php'); ?>
    <script src="js/classes/ProductLender.js"></script>
    <script src="js/products.js"></script>

</body>

</html>
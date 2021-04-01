<!doctype html>
<html lang="en">

<head>
    <?php include('header.php'); ?>
    <title>Your products</title>
</head>

<body>
    <?php include('navbar.php'); ?>
    <div class="container">

        <div class="toolbar mt-5 mb-3">
            <h2>Your products</h2>
            <a href="create-product.php" role="button" class="btn btn-primary">Create new product</a>
        </div>

        <!-- where all the products will be displayed -->
        <div id="lender-product-listings"></div>


    </div>


    <?php include('footer.php'); ?>
    <script src="js/classes/ProductLender.js"></script>
    <script src="js/products.js"></script>

</body>

</html>
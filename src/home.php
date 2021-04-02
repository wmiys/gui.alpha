<!doctype html>
<html lang="en">

<head>
    <?php include('header.php'); ?>
    <title>Hello, world!</title>
</head>

<body>
    <?php include('navbar.php'); ?>
    <div class="container">


        <h1 class="mt-5 text-center">What's mine is yours</h1>

        <div class="card mt-5">
            <div class="card-body">
                <div class="d-flex align-items-center">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text"><i class='bx bx-search'></i></span>
                        </div>
                        <input type="text" class="form-control form-control-lg" placeholder="What are you searching for?">
                    </div>

                    <button type="button" class="btn btn-lg btn-primary ml-3">Search</button>
                </div>
            </div>
        </div>


    </div>


    <?php include('footer.php'); ?>
    <script src="js/home.js"></script>

</body>

</html>
<!doctype html>
<html lang="en">

<head>
    <?php include('header.php'); ?>
    <title>Hello, world!</title>
</head>

<body>

    <section id="navbar">
            <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown">
                    <i class='bx bx-menu'></i>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav">
                        <li class="nav-item"><a class="nav-link custom-font" id="nav-item-home" href="home.php">Home</a></li>
                        <li class="nav-item"><a class="nav-link custom-font" id="nav-item-new-event" href="login.php">Login</a></li>
                        <li class="nav-item"><a class="nav-link custom-font" id="nav-item-logout" href="create-account.php">Create Account</a></li>
                        <!-- <li class="nav-item"><a class="nav-link" id="nav-item-test" href="test.php">Test</a></li> -->
                    </ul>
                </div>
            </nav>
    </section>



    <div class="container">


        <h1 class="mt-5 text-center">WMIYS - home page</h1>
        <p class="text-center"><small>Suck my clam - Chis Yerkes</small></p>


        <ul class="info-list">
        </ul>

    </div>


    <?php include('footer.php'); ?>
    <script src="js/home.js"></script>

</body>

</html>
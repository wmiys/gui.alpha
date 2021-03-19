<!DOCTYPE html>
<html lang="en">

<head>
    <?php include('header.php'); ?>
    <title>Log in | WMIYS</title>
</head>

<body>
    <div class="container-md mb-5">
        <h2 class="my-5 text-center">Log in to your account</h2>

        <div class="d-flex justify-content-center">
            <div class="card form-sm-wrapper">
                <div class="card-body">
                    <form id="form-login">

                        <!-- email -->
                        <div class="form-group">
                            <label for="form-login-email">Email</label>
                            <input type="email" class="form-control form-control-sm" id="form-login-email" required>
                        </div>

                        <!-- password -->
                        <div class="form-group">
                            <label for="form-login-password">Password</label>
                            <input type="password" class="form-control form-control-sm" id="form-login-password" required minlength="1">
                        </div>

                        <!-- submit button -->
                        <button type="button" class="btn btn-sm btn-block btn-primary" id="form-login-submit">Log in</button>

                        <p class="text-center mt-2"><a href="create-account.php">Create an account</a></p>
                        
                    </form>
                </div>
            </div>
        </div>

    </div>


    <?php include('footer.php'); ?>
    <script src="js/login.js"></script>
</body>

</html>
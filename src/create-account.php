<!DOCTYPE html>
<html lang="en">

<head>
    <?php include('header.php'); ?>
    <title>Create account | WMIYS</title>
</head>

<body>
    <div class="container">

        <h1 class="my-5 text-center">Create your account</h1>

        <div class="d-flex justify-content-center">

            <div class="card">
                <div class="card-body">
                    <form id="form-create-account" class="form-sm">
                        <div class="form-row">
                            <!-- first name -->
                            <div class="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <label for="form-create-account-name-first">First Name</label>
                                    <input type="text" class="form-control form-control-sm" id="form-create-account-name-first" required autofocus>
                                </div>
                            </div>

                            <!-- last name -->
                            <div class="col-sm-12 col-md-6">
                                <div class="form-group">
                                    <label for="form-create-account-name-first">Last Name</label>
                                    <input type="text" class="form-control form-control-sm" id="form-create-account-name-last" required>
                                </div>
                            </div>

                        </div>

                        <!-- dob -->
                        <div class="form-group">
                            <label for="form-create-account-name-first">Birth date</label>
                            <input type="text" class="form-control form-control-sm" id="form-create-account-dob" required>
                        </div>

                        <!-- email -->
                        <div class="form-group">
                            <label for="form-create-account-name-first">Email</label>
                            <input type="email" class="form-control form-control-sm" id="form-create-account-email" required>
                        </div>

                        <!-- password -->
                        <div class="form-group">
                            <label for="form-create-account-name-first">Password</label>
                            <input type="password" class="form-control form-control-sm" id="form-create-account-password" required minlength="6">
                        </div>

                        <!-- submit button -->
                        <button type="button" class="btn btn-sm btn-block btn-primary" id="form-create-account-submit">Create account</button>
                    </form>
                </div>
            </div>


        </div>



    </div>


    <?php include('footer.php'); ?>
    <script src="js/create-account.js"></script>
</body>

</html>
<!doctype html>
<html lang="en">

<head>
    <?php include('header.php'); ?>
    <title>Account settings</title>
</head>

<body>
    <?php include('navbar.php'); ?>
    <div class="container mt-5">

        <div class="row">
            <!-- sidenav -->
            <div class="col-sm-12 col-lg-4">
                <div class="card card-account-settings-sidenav mb-3">
                    <div class="card-body">
                        <div class="profile-info d-flex flex-column align-items-center">
                            <!-- profile pic -->
                            <img src="img/placeholder.jpg" class="img-fluid img-profile-pic mb-3" alt="Profile picture">

                            <!-- user name -->
                            <p class="h5">
                                <span class="profile-info-name-first"></span>
                                <span class="profile-info-name-last"></span>
                            </p>
                        </div>

                        <div class="menu mt-4">
                            <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                <a class="nav-link active" id="v-pills-home-tab" data-toggle="pill" href="#v-pills-home" role="tab">Personal info</a>
                                <a class="nav-link" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab">Login & security</a>
                                <a class="nav-link" id="v-pills-messages-tab" data-toggle="pill" href="#v-pills-messages" role="tab">Messages</a>
                                <a class="nav-link" id="v-pills-settings-tab" data-toggle="pill" href="#v-pills-settings" role="tab">Payments & payouts</a>
                            </div>

                        </div>
                    </div>
                </div>
            </div>


            <!-- content -->
            <div class="col-sm-12 col-lg-8">
                <div class="card mb-3">
                    <div class="card-body">
                        <h5 class="mb-4">General information</h5>
                        <form class="form-account-settings-basic">
                            <div class="row mb-3">
                                <!-- first name -->
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <label for="form-account-settings-basic-name-first">First name</label>
                                        <input type="text" class="form-control form-account-settings-basic-input" disabled id="form-account-settings-basic-name-first" required>
                                    </div>
                                </div>

                                <!-- last name -->
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <label for="form-account-settings-basic-name-last">Last name</label>
                                        <input type="text" class="form-control form-account-settings-basic-input" disabled id="form-account-settings-basic-name-last" required>
                                    </div>
                                </div>
                            </div>

                            <div class="row mb-3">
                                <!-- email -->
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <label for="form-account-settings-basic-email">Email</label>
                                        <input type="email" class="form-control form-account-settings-basic-input" disabled id="form-account-settings-basic-email" required>
                                    </div>
                                </div>

                                <!-- dob -->
                                <div class="col-sm-12 col-md-6">
                                    <div class="form-group">
                                        <label for="form-account-settings-basic-dob">Birthday</label>
                                        <input type="date" class="form-control form-account-settings-basic-input" disabled id="form-account-settings-basic-dob" required>
                                    </div>
                                </div>
                            </div>

                            <button type="button" class="btn btn-primary form-account-settings-basic-btn px-4" disabled id="form-account-settings-basic-submit">Save changes</button>

                        </form>
                    </div>
                </div>
            </div>


        </div>


    </div>


    <?php include('footer.php'); ?>
    <script src="js/account-settings.js"></script>


</body>

</html>
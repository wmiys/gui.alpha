<?php

// insert the email into the database
function insertEmail() {

    include('db-info.php');

    // filter the input values
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);

    if (strlen($email) <= 0) {
        return;
    }

    $ipAddress = filter_input(INPUT_SERVER, 'REMOTE_ADDR', FILTER_SANITIZE_STRING);

    // connect to database
    $pdo = new PDO("mysql:host=$host;dbname=$dbName",$user,$password);

    // set the error mode to silent (don't throw any exceptions)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_SILENT);

    // prepare the statement
    $stmt = 'INSERT INTO Coming_Soon_Entries (email, ip_address) VALUES (:email, :ip_address)';
    $sql = $pdo->prepare($stmt);

    // bind the paramters
    $sql->bindParam(':email', $email, PDO::PARAM_STR);
    $sql->bindParam(':ip_address', $ipAddress, PDO::PARAM_STR);

    // execute sql statement
    $sql->execute();

    // close the connections
    $pdo = null;
    $sql = null;
}






?>
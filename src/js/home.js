

if (!LocalStorage.isUserIDSet()) {
    window.location.href = 'login.php';
}


// main logic
$(document).ready(function() {    
    ApiWrapper.requestGetUser(LocalStorage.getUserID(), displayUserData);    
});


function displayUserData(response, status, xhr) {
    
    let html = `
    <li>First name: ${response.name_first}</li>
    <li>Last name:  ${response.name_last}</li>
    <li>Email:      ${response.email}</li>
    <li>Birthdate:  ${response.birth_date}</li>`;

    $('.info-list').html(html);
    
} 




LocalStorage.validateStatus();  // be sure the user is logged in



// main logic
$(document).ready(function() {    
    ApiWrapper.requestGetUser(LocalStorage.getUserID(), displayUserData, console.error);    
});


function displayUserData(response, status, xhr) {  
      
    let html = `
    <li>First name: ${response.name_first}</li>
    <li>Last name:  ${response.name_last}</li>
    <li>Email:      ${response.email}</li>
    <li>Birthdate:  ${response.birth_date}</li>`;

    $('.info-list').html(html);
    
} 



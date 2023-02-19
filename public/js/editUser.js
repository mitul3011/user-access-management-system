const submitBtn = document.querySelector('#editSubmit');
const name = document.querySelector('#inputName');
const email = document.querySelector('#inputEmail');
const role = document.querySelector('#inputRole');
const idLabel = document.querySelector('#idlabel');
const logOutBtn = document.querySelector('#logOut');
const logOutAllBtn = document.querySelector('#logOutAll');
let updates;

submitBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const id = idLabel.innerHTML;

    if(role){
    updates = {
        name: name.value,
        email: email.value,
        role: role.value
    }
    }else{
        updates = {
            name: name.value,
            email: email.value,
        }
    }

    fetch('/user/updateInfo/' + id, {
        method: 'PATCH',
        body: JSON.stringify(updates),
        headers: {
            "Content-Type": "application/json; charset=UTF-8"
        }
    }).then((response) => {
        if(response.status === 200)
            window.location = '/user/info';
        else{
            window.location.reload();
        }
    });
});

// Logout function
logOutBtn.addEventListener('click', () => {
    document.querySelector('#commonSpinner').removeAttribute('hidden');
    fetch('/user/logout', {
        method: 'POST'
    }).then((response) => {
        if(response.status === 200)
            window.location = '/user/';
        else{
            window.location.reload();
        }
    });
});

// Logout from All Devices function
logOutAllBtn.addEventListener('click', () => {
    document.querySelector('#commonSpinner').removeAttribute('hidden');
    fetch('/user/logoutall', {
        method: 'POST'
    }).then((response) => {
        if(response.status === 200)
            window.location = '/user/';
        else{
            window.location.reload();
        }
    });
});
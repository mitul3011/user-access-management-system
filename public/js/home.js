// All Button
const logOutBtn = document.querySelector('#logOut');
const logOutAllBtn = document.querySelector('#logOutAll');

const deleteUser = (id) => {
    fetch('/user/deleteuser/' + id, {
        method: 'DELETE'
    }).then((response) => {
        if(response.status === 200)
            window.location = '/user/home';
        else{
            window.location.reload();
        }
    });
};

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
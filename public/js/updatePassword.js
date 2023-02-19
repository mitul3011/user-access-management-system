const signupForm = document.querySelector('form');
const errMsg = document.querySelector('#errorMsg');
const submitBtn = document.querySelector('#submit');
const logOutBtn = document.querySelector('#logOut');
const logOutAllBtn = document.querySelector('#logOutAll');

signupForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const password = document.querySelector('#inputPassword').value;

    submitBtn.innerHTML = 'Updating...';

    const formData = {};

    let passwordChanged = false;
    let passwordChangedSuccess = false;

    if(password !== ''){
        passwordChanged = true;

        if(password.length <= 7){
            errMsg.innerHTML = 'Password must contain more than 8 characters.';
            submitBtn.innerHTML = 'Update';
            return;
        }

        const passwordOk = checkPassword(password);

        if(passwordOk !== ''){
            errMsg.innerHTML = passwordOk;
            submitBtn.innerHTML = 'Update';
        }else{
            passwordChangedSuccess = true;
        }
    }

    if(passwordChanged && passwordChangedSuccess){
        formData.password = password;

        fetch('/user/updatePassword', {
            method: 'PATCH',
            body: JSON.stringify(formData),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }).then((response) => {
            if(response.status === 200)
                window.location = '/user/home';
            else{
                window.location.reload();
            }
        });
    }
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

const checkPassword = (password) => {

    let errorMessage = '';
    const upperCase = new RegExp("(?=.*[A-Z])");
    const number = new RegExp("(?=.*[0-9])");
    const specialChar = new RegExp("(?=.*[!@#$%^&*])");

    if(password.toLowerCase().includes('password')){
        errorMessage += ' Password cannot contain "password".';
    }

    if(!upperCase.test(password)){
        errorMessage += ' Password must contain atleast 1 upper case character.'
    }

    if(!number.test(password)){
        errorMessage += ' Password must contain atleast 1 numerical character.'
    }

    if(!specialChar.test(password)){
        errorMessage += ' Password must contain atleast 1 special character.'
    }

    return errorMessage;
};
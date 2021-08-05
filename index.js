const form = document.querySelector('form')
const user = document.querySelector('useremail')
const password = document.querySelector('password-input')
const error = document.querySelector('error')

form.addEventListener('submit', (e) => {
  let messages =[]
  if( user === "admin" && password === "admin") {
    alert("Entered correct");
    e.preventDefault()
  }
  else{
    document.getElementById('error').style.display='flex';
    document.getElementById('error-pass').style.display='flex';
    alert("Entered fail");
    e.preventDefault()
  }
})

function myFunction() {
    const textpass = document.getElementById("password");
    if (textpass.type === "password") {
      textpass.type = "text";
    } else {
      textpass.type = "password";
    }
  }
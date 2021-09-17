const form = document.querySelector('form');
const user = document.getElementById('useremail');
const password = document.getElementById('pasword');
document.getElementById('useremail').addEventListener("click", EventRemoveUser);
document.getElementById('password').addEventListener("click", EventRemovePass);


// Remove pass and email
function EventRemoveUser() {
  document.getElementById('error').style.display='none'
}
function EventRemovePass() {
  document.getElementById('error-pass').style.display='none';
}

// Event Login 
form.addEventListener('submit', (e) => {
  e.preventDefault()
  const email = document.getElementById('useremail').value;
  const pass = document.getElementById('password').value; 
 
  if (validateEmail(email) && validatePassword(pass)) {
    //console.log("lo hice!")
    let loginserver = UserServer(email, pass);

    if(loginserver === "error"){
      //console.log("no lo hize")
      document.getElementById('error').style.display='flex';
      document.getElementById('error-pass').style.display='flex';
    }
    else{
      document.cookie = "authToken-" + loginserver.accessToken;
      window.location = "main.html";
    }

  }
  else {
    //console.log("no lo hize")
    document.getElementById('error').style.display='flex';
    document.getElementById('error-pass').style.display='flex';
  }

  //
  function validateEmail(email) {
  console.log(email)
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
  }
  function validatePassword(password){
    let valid = false;
    if ( password.length > 2 && password != ""){
      valid = true; 
      console.log(password)
      return valid;
    }
    else {
      valid = false; 
      console.log(password)
      return valid; 
    }
  }

})

// Fetch with the local host Json server
async function UserServer(email, password){
  console.log(email)
  console.log(password)
  const loginResponse = await fetch("http://localhost:3000/users", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: `${email}`,
                password: `${password}`,
            }),

        }).then(async(loginStatus) => {
          let loginText = await loginStatus.json();
          if(loginStatus.status === 200) {
            return loginText;
          }
          else{
            let error = "error"
            return error;
          }
        })
}

// Show and hide password 
function showHidePassword() {
    const textpass = document.getElementById("password");
    if (textpass.type === "password") {
      textpass.type = "text";
    } else {
      textpass.type = "password";
    }
  }
const form = document.querySelector("form");
const user = document.getElementById("useremail");
const password = document.getElementById("pasword");
document.getElementById("useremail").addEventListener("click", EventRemoveUser);
document.getElementById("password").addEventListener("click", EventRemovePass);

carouselInteractionfunction();

// Remove pass and email
function EventRemoveUser() {
  document.getElementById("error").style.display = "none";
}
function EventRemovePass() {
  document.getElementById("error-pass").style.display = "none";
}

// Event Login
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("useremail").value;
  const pass = document.getElementById("password").value;

  if (validateEmail(email) && validatePassword(pass)) {
    let loginserver = UserServer(email, pass);

    if (loginserver === "error") {
      document.getElementById("error").style.display = "flex";
      document.getElementById("error-pass").style.display = "flex";
    }
  } else {
    document.getElementById("error").style.display = "flex";
    document.getElementById("error-pass").style.display = "flex";
  }

  //
  function validateEmail(email) {
    const re =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  function validatePassword(password) {
    let valid = false;
    if (password.length > 2 && password != "") {
      valid = true;
      console.log("password-Correct");
      return valid;
    } else {
      valid = false;
      console.log("Password-incorrect");
      return valid;
    }
  }
});

// Fetch with the local host Json server
async function UserServer(email, password) {
  console.log(email);
  console.log(password);
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
  }).catch((error) => {
    document.getElementById("error").style.display = "flex";
    document.getElementById("error-pass").style.display = "flex";
  });
  const loginData = await loginResponse.json();
  if (loginData.status === 200 || 201) {
    document.cookie = "authToken-" + loginResponse.accessToken;
    window.location = "main.html";
  }

  return loginResponse;
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
// caroulsel interaction  ( no time, only click )
function carouselInteractionfunction() {
  const track = document.querySelector(".carousel-truck");
  const slides = Array.from(track.children);
  const dotsNav = document.querySelector(".carousel-dot-container");
  const dots = Array.from(dotsNav.children);
  const slideWidth = slides[0].getBoundingClientRect().width;
  const img = document.querySelector(".carousel-truck");

  const setSlidePostion = (slides, index) => {
    slides.style.left = slideWidth * index + "px";
  };
  slides.forEach(setSlidePostion);

  const movetoSlide = (track, currentSlide, targetSlide) => {
    track.style.transform = "translateX(-" + targetSlide.style.left + ")";
    if (currentSlide.classList != null) {
      currentSlide.classList.remove("current-slide");
    }
    targetSlide.classList.add("current-slide");
  };

  /* const updateDots = () =>{
     currentDot.classList.remove('current-slide');
     targetDot.classList.add('current-slide');
   } */

  /* img.addEventListener("click", (e) => {
    let currentSlide = track.querySelector(".current-slide");
    let nextSlide = currentSlide.nextElementSibling;
    const startSlide = track.querySelector("#carousel-welcome-image");
    const currentDot = dotsNav.querySelector(".current-slide");
    const nextDot = currentDot.nextElementSibling;
    if (nextSlide == null) {
      startSlide.classList.add("current-slide");
    } else {
      movetoSlide(track, currentSlide, nextSlide); */
  /* updateDots(currentDot, nextDot) */
  /*   }
  });
 */
  dotsNav.addEventListener("click", (e) => {
    const targetDot = e.target.closest("input");
    if (!targetDot) return;
    const currentSlide = track.querySelector(".current-slide");
    const currentDot = dotsNav.querySelector(".current-slide");
    const targetIndex = dots.findIndex((dot) => dot == targetDot);
    const targetSlide = slides[targetIndex];
    let check = document.querySelectorAll(".carousel-dot");
    check[0].classList.remove("checked");

    movetoSlide(track, currentSlide, targetSlide);
    /* updateDots(currentDot, targetDot); */
    /* currentDot.classList.remove('current-slide');
        targetDot.classList.add('current-slide'); */
  });
}

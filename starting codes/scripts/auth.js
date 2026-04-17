const overlayTitle = document.getElementById('overlayTitle');
const overlayText = document.getElementById('overlayText');
const loginSlides = document.querySelectorAll('.login-slide');
const signupSlides = document.querySelectorAll('.signup-slide');

function switchToSignup() {
  document.querySelector('.auth-container').classList.add('signup-mode');

  overlayTitle.innerText = "Join Gilded";
  overlayText.innerText = "Start your personalized beauty experience today. Experience luxury like never before.";

  loginSlides.forEach(s => s.classList.remove('active'));
  signupSlides.forEach(s => s.classList.add('active'));

  setTimeout(() => {
    document.getElementById('loginForm').classList.remove('active');
    document.getElementById('signupForm').classList.add('active');
  }, 400);
}

function switchToLogin() {
  document.querySelector('.auth-container').classList.remove('signup-mode');

  overlayTitle.innerText = "Welcome Back";
  overlayText.innerText = "Your beauty journey continues here. Sign in to manage your appointments.";

  signupSlides.forEach(s => s.classList.remove('active'));
  loginSlides.forEach(s => s.classList.add('active'));

  setTimeout(() => {
    document.getElementById('signupForm').classList.remove('active');
    document.getElementById('loginForm').classList.add('active');
  }, 400);
}

import{
    auth,
    signInWithEmailAndPassword
} from "./firebase.js";

let Login = () => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");

    console.log(email.value,password.value);
  
    signInWithEmailAndPassword(auth, email.value, password.value)

    .then((userCredential) => {
      const user = userCredential.user;
      window.location = "/assets/HTML/profile.html"
      console.log(user)
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage)
    });
  
  }
  
  let LoginBtn = document.getElementById("LoginBtn");
  LoginBtn && LoginBtn.addEventListener("click",Login)
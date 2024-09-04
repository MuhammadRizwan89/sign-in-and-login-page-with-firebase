import {
  auth,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  doc, 
  setDoc,
  db,
  getDoc 
} from "./firebase.js";

// Register Email and Password

let confirmation;
let register = () => {
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const phone = document.getElementById("phone");

  console.log(email.value, password.value, phone.value);

  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
    });

    // Phone Number Rigister

  window.recaptchaVerifier = new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {}
  );
  const appVerifier = window.recaptchaVerifier;
  console.log(phone.value);
  signInWithPhoneNumber(auth, `+${phone.value}`, appVerifier)
    .then((confirmationResult) => {
      confirmation = confirmationResult;
      console.log("sms sent");
    })
    .catch((error) => {
      console.log(error);
    });
};
let registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
  registerBtn.addEventListener("click", register);

  // Otp verify

  let verify = () => {
    let otp = document.getElementById("otp");
    console.log(otp);
    confirmation
      .confirm(otp.value)
      .then((result) => {
        console.log(confirmation);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  let otpVerify = document.getElementById("otpVerify");
  otpVerify && otpVerify.addEventListener("click", verify);
}

// singn In With Google

const googleProvider = new GoogleAuthProvider();

let googleVerify = ()=>{

  signInWithPopup(auth, googleProvider)
  .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;

    console.log("user",user)
    addUserToFirestore(user)
    
  }).catch((error) => { 
    const errorCode = error.code;
    const errorMessage = error.message;
    const email = error.customData.email;
    const credential = GoogleAuthProvider.credentialFromError(error);

    console.log("errorMessage",errorMessage)
  });}

let signInWihtGoogle = document.getElementById("signInWihtGoogle");
signInWihtGoogle && signInWihtGoogle.addEventListener("click",googleVerify)


// add user data in filestore

let addUserToFirestore = async (user)=>{
  const res = await setDoc(doc(db, "users", user.uid), {
    name: user.displayName,
    email: user.email,
    verify: user.emailVerified, 
    photoURL: user.photoURL,
  });
  console.log(res)
}
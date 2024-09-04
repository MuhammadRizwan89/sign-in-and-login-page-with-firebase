import {
  auth,
  onAuthStateChanged,
  signOut,
  db,
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
} from "./firebase.js";

// user already login

let name = document.getElementById("name");
let email = document.getElementById("email");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    console.log(docSnap.data());

    if (docSnap.data()) {
      console.log(user);

      if (location.href !== "/assets/HTML/profile.html") {
        location.href = "/assets/HTML/profile.html";
      }

      name.value = user.email.slice(0, user.email.indexOf("@"));
      email.innerHTML = user.email;
    } else {
      console.log("not login");
      if (
        location.href !== "/index.html" &&
        location.href !== "/assets/HTML/register.html"
      ) {
        location.href = "/index.html";
      }
    }
  }
});

// Up Date Name

let updateName = async () => {
  let name = document.getElementById("name");

  console.log(name.value, auth);

  const userRef = doc(db, "users", auth.currentUser.uid);
  await updateDoc(userRef, {
    name: name.value,
  });
  console.log("profile Updated");
};

let updateBtn = document.getElementById("updateBtn");
updateBtn && updateBtn.addEventListener("click", updateName);

// get all users

let getAllUsers = async () => {
  const q = collection(db, "users");

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
};
getAllUsers();

// user logOut

let logout = () => {
  signOut(auth)
    .then(() => {
      console.log("signOut successfully");
      window.location = "/index.html";
    })
    .catch((error) => {
      console.log(error);
    });
};

let logOutbtn = document.getElementById("logOutbtn");
logOutbtn && logOutbtn.addEventListener("click", logout);

// storage in firebase

const uploadFile = async () => {
  let file = document.getElementById("file");
  const url = await upLoadToStorage(file.files[0])

  console.log("download url--->",url)
};

let uploadbtn = document.getElementById("uploadbtn");
uploadbtn && uploadbtn.addEventListener("click", uploadFile);

let file = document.getElementById("file");
image.addEventListener("change", (e) => {
  const image = document.getElementById("image");
  image.src = url.creatObjectURL(e.target.files[0]);
});

const upLoadToStorage = (file) => {
  return new Promise((resolve, reject) => {
    const fileName = file.name;
    const storageRef = ref(
      storage,
      `users/aslk934294 ${fileName.slice(fileName.lastIndexOf("."))}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

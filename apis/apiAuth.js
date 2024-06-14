const dotenv = require('dotenv');
dotenv.config();

const { getAuth, signInWithCredential, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, sendEmailVerification } = require("firebase/auth"); 
const { initializeApp } = require("firebase/app");
const { GoogleAuthProvider } = require("firebase/auth"); // Asegúrate de importar cualquier otro proveedor que necesites

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
}

const app = initializeApp(firebaseConfig)

const auth = getAuth(app);


function SingUpGoogle (token) {
    return(
        new Promise (async (res, rej) => {
            const credential = GoogleAuthProvider.credential(token);
            signInWithCredential(auth, credential).then(result => {
                console.log(result)
            })
        })
    )
}

function SingInPass (email, password) {
    return(
      new Promise((res, rej) => {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential)=>{
            const user = userCredential.user
            console.log(user)
            const data = {id: user.uid}
            res(user)
          }).catch(error => {
            console.log(error);
            rej(error)
          })
      })
    )
}

function resetPass (email) {
    return(
        new Promise (async (res, rej) => {
            sendPasswordResetEmail(auth, email).then(() => {
                res()
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function SingUpEmail1(email, pass) {
    return new Promise((res, rej) => {
      createUserWithEmailAndPassword(auth, email, pass)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user.uid);
  
          // Enviar correo de verificación
          sendEmailVerification(user)
            .then(() => {
              console.log("Correo de verificación enviado.");
              res(user);
            })
            .catch((error) => {
              console.error("Error al enviar correo de verificación:", error);
              rej(error);
            });
        })
        .catch((error) => {
          console.error(error);
          if (error.code === "auth/email-already-in-use") {
            rej(1); // Correo electrónico ya en uso
          } else if (error.code === "auth/weak-password") {
            rej(2); // Contraseña débil
          } else {
            rej(error.code); // Otro error
          }
        });
    });
  }


module.exports = {
    SingUpGoogle,
    SingUpEmail1,
    SingInPass,
    resetPass,
    app,

}
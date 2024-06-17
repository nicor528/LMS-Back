const { app } = require("./apiAuth");
const { setDoc, doc, getDoc, query, collection, where, getDocs, getFirestore, deleteDoc } = require("firebase/firestore");
const { getStorage, ref, uploadString, uploadBytes, getDownloadURL  } = require("firebase/storage")

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();



const DB = getFirestore(app);
const storage = getStorage(app);

function createToken(payload, expiresIn) {
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

async function saveTokensInFirebase(userID, accessToken, refreshToken, refreshTokenExpiry) {
    const userRef = doc(DB, 'users-data', userID);
    await setDoc(userRef, {
        accessToken,
        refreshToken,
        refreshTokenExpiry: refreshTokenExpiry.toISOString()
    });
}

async function generateAndSaveTokens(userID) {
    const payload = { userID };

    // Crear tokens
    const accessToken = createToken(payload, '1h');  // Token de acceso con validez de 1 hora
    const refreshToken = createToken(payload, '7d');  // Token de actualización con validez de 7 días

    // Calcular fecha de expiración del token de actualización
    const refreshTokenExpiry = new Date();
    refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 7);

    // Guardar tokens en Firebase
    await saveTokensInFirebase(userID, accessToken, refreshToken, refreshTokenExpiry);

    return { accessToken, refreshToken };
}


function uploadProfilePicture(user_ID, picture) {
    return(
        new Promise(async (res, rej) => {
            try{
                const url = user_ID + "/profilePicture.jpeg";
                const storageRef = ref(storage, url);
                const snapShot = await uploadBytes(storageRef, picture);
                const downUrl = await getDownloadURL(snapShot.ref);
                res(downUrl);
            }catch(error){
                console.log(error);
                rej(error)
            }

        })
    )
}

function uploadCV(user_ID, pdfFile) {
    return new Promise(async (res, rej) => {
        try {
            const url = user_ID + "/CV.pdf";
            const storageRef = ref(storage, url);
            const snapShot = await uploadBytes(storageRef, pdfFile);
            const downUrl = await getDownloadURL(snapShot.ref);
            res(downUrl);
        } catch (error) {
            console.log(error);
            rej(error);
        }
    });
}

function getCV(user_ID) {
    return new Promise(async (res, rej) => {
        try {
            const url = user_ID + "/CV.pdf";
            const pathRef = ref(storage, url);
            const downUrl = await getDownloadURL(pathRef);
            res(downUrl);
        } catch (error) {
            if (error.code === 'storage/object-not-found') {
                // El archivo no existe
                res("")
            } else {
                console.log(error);
                rej(error);
            }
        }
    });
}

function getProfilePicture (user_ID) {
    return(
        new Promise(async (res, rej) => {
            try{
                const url = user_ID + "/profilePicture.jpeg";
                const pathRef = ref(storage, url);
                const downUrl = await getDownloadURL(pathRef);
                res(downUrl);
            }catch(error){
                console.log(error);
                rej(error)
            }
        })
    )
}

function getPDF (pdf) {
    return(
        new Promise (async (res, rej) => {
            try{
                const url = pdf;
                const pathRef = ref(storage, url);
                const downUrl = await getDownloadURL(pathRef);
                res(downUrl);
            }catch(error){
                console.log(error)
                rej(error)
            }
        })
    )
}

function getRequestUserState(user_ID, course_ID) {
    return(
        new Promise(async (res, rej) => {
            try{
                const docRefOpen = doc(DB, "user-courses-requests", "open", "requests", user_ID + course_ID)
                const docSnap = await getDoc(docRefOpen);
                const docRefClose = doc(DB, "user-courses-requests", "closed", "requests", user_ID + course_ID)
                const docSnapClose = await getDoc(docRefClose);
                if(docSnapClose.exists()){
                    const data = docSnapClose.data();
                    if(data.state === "aproved"){
                        res("enroled")
                    }else{
                        res("rejected")
                    }
                }if(docSnap.exists()){
                    res("pending")
                }else{
                    res("no_exist")
                }
            }catch(error) {
                console.log(error)
                rej(error)
            }
        })
    )
}

function getScore(user_ID, module_ID) {
    return(
        new Promise(async (res, rej) => {

            try{
                const docRef = doc(DB, "users-quiz-results-modules", user_ID + module_ID);
                const docSnap = await getDoc(docRef);
                if(docSnap.exists()){
                    const data = docSnap.data();
                    res(data.score)
                }else{
                    rej(docSnap)
                }
            }catch(error){
                console.log(error);
                rej(error)
            }
        })
    )
}

function createNewScore (user_ID, module_ID, score, aproved) {
    return(
        new Promise(async (res, rej) => {
            try{
                const docRef = doc (DB, "users-quiz-results-modules", user_ID + module_ID);
                await setDoc(docRef, {
                    user_ID: user_ID,
                    module_ID: module_ID,
                    score: score,
                    aproved: aproved
                })
                const docSnap = await getDoc(docRef);
                if(docSnap.exists()) {
                    res()
                }else{
                    rej(docSnap)
                }
            }catch(error) {
                console.log(error);
                rej(error)
            }
        })
    )
}

function createNewCourseRequest (user_ID, course_ID, course, user) {
    console.log(course);
    console.log(user)
    return(
        new Promise(async (res, rej) => {
            let localDate = new Date();
            try{
                const docRef = doc(DB, "user-courses-requests", "open", "requests", user_ID + course_ID)
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    res("on going request")
                } else {
                    await setDoc(docRef, {
                        date: localDate,
                        course_ID: course_ID,
                        course_name: course.technology,
                        user_name: user.name + " " + user.last_name,
                        user_ID: user_ID,
                        state: "pending",
                        email: user.email,
                        imageUrl: course.imageUrl.data ? course.imageUrl.data.attributes.url : ""
                    })
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        res(docSnap.data());
                    } else {
                        // doc.data() will be undefined in this case
                        rej(docSnap)
                    }
                }
            }catch(error) {
                console.log(error)
                rej(error)
            }
        })
    )
}

function getOpenRequests() {
    return(
        new Promise(async (res, rej) => {
            try{
                const openRef = collection(DB, "user-courses-requests", "open", "requests")
                const snapShot = await getDocs(openRef)
                const pedings = snapShot.docs.map(request => {
                    const request2 = request.data();
                    return{...request2}
                })
                res(pedings)
            }catch(error){
                console.log(error)
                rej(error)
            }
        })
    )
}

function getCloseRequests() {
    return(
        new Promise(async (res, rej) => {
            try{
                const closeRef = collection(DB, "user-courses-requests", "closed", "requests")
                const snapShot = await getDocs(closeRef)
                const closed = snapShot.docs.map(request => {
                    const request2 = request.data();
                    return{...request2}
                })
                res(closed)
            }catch(error){
                console.log(error)
                rej(error)
            }
        })
    )
}




function aproveUserCourseRequest(request_ID, aproved) {
    return(
        new Promise(async (res, rej) => {
            let localDate = new Date();
            try{
                const openRef = doc(DB, "user-courses-requests", "open", "requests", request_ID)
                const OpenDocSnap = await getDoc(openRef);
                const closeRef = doc(DB, "user-courses-requests", "closed", "requests", request_ID)
                if(OpenDocSnap.exists()){
                    const docOpen = OpenDocSnap.data()
                    console.log(docOpen)
                    await setDoc(closeRef, {
                        date: localDate,
                        course_ID: docOpen.course_ID,
                        user_name: docOpen.user_name,
                        user_ID: docOpen.user_ID,
                        course_name: docOpen.course_name,
                        state: aproved? "aproved" : "rejected",
                        email: docOpen.email,
                        imageUrl: docOpen.imageUrl
                    })
                    await deleteDoc(openRef);
                    res("")
                }else{
                    rej("request dosent exist")
                }
            }catch(error){
                console.log(error)
                rej(error)
            }
        })
    )
}


module.exports = {
    createNewCourseRequest,
    getOpenRequests,
    aproveUserCourseRequest,
    getRequestUserState,
    uploadProfilePicture,
    getProfilePicture,
    getPDF,
    getCloseRequests,
    createNewScore,
    getScore,
    generateAndSaveTokens,
    uploadCV,
    getCV
    
}
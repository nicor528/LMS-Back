const { getStorage } = require("firebase/storage");
const { app } = require("./apiAuth");
const { setDoc, doc, getDoc, query, collection, where, getDocs, getFirestore } = require("firebase/firestore");

const DB = getFirestore(app);
const storage = getStorage(app);

function createNewCourseRequest (user_ID, course_ID, course, user) {
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
                        user_name: user.name,
                        user_ID: user_ID
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

function aproveUserCourseRequest(request_ID) {
    return(
        new Promise(async (res, rej) => {
            try{
                const openRef = doc(DB, "user-courses-requests", "open", "requests", request_ID)
                const OpenDocSnap = await getDoc(openRef);
                const closeRef = doc(DB, "user-courses-requests", "closed", "requests", request_ID)
                if(OpenDocSnap.exists()){
                    const docOpen = OpenDocSnap.data()
                    console.log(docOpen)
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


}
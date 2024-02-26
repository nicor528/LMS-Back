const dotenv = require('dotenv');
const { default: fetch } = require('node-fetch');
dotenv.config();

function generateAlphanumericCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
}

//${process.env.STRAPI_TOKEN}
function createCourse () {
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABJ0lEQVR42mL8//8/AyMjI4cBQFJ1DwMBgZkWj42Nze3b29vQ6tBC9jy3s7OyWAZqAVoBP4zqys7MjJgUFTgrVABWC2Ezgkai+7gN4Ap1YDqsHAkBmzRABPlDMOpmOgDqA4AGY7gNwn5nGwBrK9wXIAkAqN6OvB1NgM6dNwAG1AGghDsAEIepngLUwDPo0/AhaCEzUL3AqOjNqAzaBBwA3G4V8wIAqjqLzTegN4AGgDLXrOvDawmYX9gAmAqNMb1ACMAKjOcbwAqNqzdgGuK4AG+gN4Adgp6EgAHXanAdIN4AkAzqwbkD5AeB1dYPX9ggRAzgAC1yA3eABzXsAma+EM9L7Aa+A7Jv8CzXuAa4TqwpzgApDAAe1ACrMHoCpyH4AwA6gNzTuawCgCwAikA8BCO8wN9wZwA1CHkAImA6S7c0GAEA8gXgAyBVsBaZoByAwA1AGghbgA2gAImAjAgwNAgZgB3GfAGZmBgA5pIGAC3ZAoCdFBYAY4ACy3fAubgAVwAw0IBPACbLdYABWU0wNAvW7Aa7v8wRZqRzCgxwAAAABJRU5ErkJggg==';
    return(
        new Promise(async (res, rej) => {
            fetch(`${process.env.url}/courses`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: await JSON.stringify({
                    data: {
                        name: "example",
                        description: "test1"
                    }
                })
            }).then(response => {
                console.log(response)
            }).catch(error => {
                console.log(error)
            })
        })
    )
}

function createUser2(name, email, uid, lastName, birth, postal_code, city, country, province, phone, street_name) {
    //const id = generateAlphanumericCode();
    const key = generateAlphanumericCode();
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/lms-users`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: await JSON.stringify({
                    data: {
                        user_ID: uid,
                        name: name,
                        email: email,
                        last_name: lastName,
                        test: key,
                        points: 0,
                        birth: birth,
                        postal_code: postal_code,
                        city: city,
                        country: country,
                        province: province,
                        phone: phone,
                        street_name : street_name,
                    }
                })
            }).then(async (response) => {
                const user =  await response.json()
                //console.log(data)
                //console.log(response)
                res(user)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function getUser2(id) {
    return(
        new Promise ((res, rej) => {
            fetch(`${process.env.url}/lms-users?populate=*`,{
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`
                }
            }).then(async (response) => {
                const data =  await response.json()
                console.log(data)
                console.log(response)
                const user = data.data.filter(user => user.attributes.user_ID === id)
                res(user[0])
            })
        })
    )
}

function getCourses () {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/lms-courses?populate=*`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
            }).then(async (result) => {
                //console.log(result)
                const data = await result.json();
                console.log(data)
                res(data)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function getOneCourse (id) {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/lms-courses/${id}?populate[lms_modules][populate]=*`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
            }).then(async (result) => {
                //console.log(result)
                const data = await result.json();
                console.log(data)
                res(data)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function getAllUserCourses () {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/lms-user-courses?populate[lms_course][populate]=*`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
            }).then(async (result) => {
                console.log(result)
                const data = await result.json();
                //console.log(data)
                res(data)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function getQuiz1 (id) {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/quizzes/${id}?populate=*`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                }
            }).then(async (result) => {
                const data = await result.json();
                res(data)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}


function getQuizz (courseID) {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/quizzes?populate=*`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                }
            }).then(async (result) => {
                const data = await result.json();
                const quiz = data.data.filter(item => item.attributes.course_id === courseID);
                const newQuiz = quiz.map(item => {
                    let newItem = {
                        title: item.attributes.title,
                    }
                    newItem.questions = item.attributes.questions.data.map(question => {
                        return{
                            question: question.attributes.question,
                            wrong_answer_1: question.attributes.wrong_answer_1,
                            wrong_answer_2: question.attributes.wrong_answer_2,
                            wrong_answer_3: question.attributes.wrong_answer_3,
                            correct_answer: question.attributes.correct_answer_1
                        }
                    })
                    return newItem
                })
                console.log(newQuiz)
                res(newQuiz)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function getOneUserCourse (id) {
    return(
        new Promise( (res, rej) => {
            fetch(`${process.env.url}/lms-user-courses/${id}?populate=*`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                }
            }).then(async (response) => {
                const data = await response.json();
                console.log(data);
                res(data)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function vinculateCourse (userID, courseID, course, n_lessons) {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/lms-user-courses`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: await JSON.stringify({
                    data: {
                        user_ID: userID,
                        //courseID: courseID,
                        /*
                        lesson1: false,
                        lesson2: false,
                        lesson3: false,
                        lesson4: false,
                        lesson5: false,
                        lesson6: false,
                        lesson7: false,
                        lesson8: false,
                        lesson9: false,
                        lesson10: false,
                        finish: false,*/
                        start_date: course.attributes.start_date,
                        end_date: course.attributes.end_date,
                        lms_course: {
                            connect: [course.id]
                        },
                        total_lessons: n_lessons,
                        percentage: 0
                    }
                })
            }).then(async (result) => {
                console.log(result)
                const data = await result.json();
                console.log(data);
                res(data)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function relationCourseWithUser(userid, user_course_id){
    return(
        new Promise ((res,rej) => {
            fetch(`${process.env.url}/lms-users/${userid}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        lms_user_courses: {
                            connect: [parseInt(user_course_id)]
                        }
                    }
                })
            }).then(async (response) => {
                const data = await response.json();
                console.log(data);
                res(data)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function updatePercentage (newper, id){
    return(
        new Promise((res, rej) => {
            fetch(`${process.env.url}/lms-user-courses/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        percentage: newper
                    }
                })
            }).then(async (result) => {
                console.log(result);
                const data = await result.json();
                res(data)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function finishCourse(id, userID) {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/lms-user-courses/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: await JSON.stringify({
                    data: {
                        finish: true
                    }
                })
            }).then(async (result) => {
                console.log(result);
                const data = await result.json();
                res(data)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function vinculateLesson(user_ID, lesson_ID) {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/lms-lessons/${lesson_ID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: await JSON.stringify({
                    data: {
                        lms_users: {
                            connect: [parseInt(user_ID)]
                        }
                    }
                })
            }).then(async (result) => {
                console.log(result);
                const data = await result.json();
                res(data)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function vinculateModule(user_ID, module_ID) {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/lms-modules/${module_ID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: await JSON.stringify({
                    data: {
                        lms_users: {
                            connect: [parseInt(user_ID)]
                        }
                    }
                })
            }).then(async (result) => {
                console.log(result);
                const data = await result.json();
                res(data)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

async function selectLesson(lesson){
    let data = {

    }
    switch(lesson) {
        case "1":
            data.lesson1 = true;  
            break;
        case "2":
            data.lesson2 = true;
            break;
        case "3":
            data.lesson3 = true;
            break;
        case "4":
            data.lesson4 = true;
            break;
        case "5":
            data.lesson5 = true;
            break;
        case "6":
            data.lesson6 = true;
            break;
        case "7":
            data.lesson7 = true;
            break;
        case "8":
            data.lesson8 = true;
            break;
        case "9":
            data.lesson9 = true;
            break;
        case "10":
            data.lesson10 = true;
            break;
        case "finish":
            data.finish = true;
            break;
        default:
            // Manejar el caso por defecto si lesson no coincide con ninguno de los casos anteriores.
    }
    return data
}

function finishLesson(id, lesson) {
    return(
        new Promise (async (res, rej) => {
            const data = await selectLesson(lesson)
            fetch(`${process.env.url}/lms-user-courses/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: await JSON.stringify({
                    data
                })
            }).then(async (result) => {
                console.log(result);
                const data = await result.json();
                res(data)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function getLesson(id){
    return(
        new Promise((res, rej) => {
            fetch(`${process.env.url}/lms-lessons/${id}?populate=*`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                }
            }).then(async (result) => {
                const data = await result.json();
                console.log(data)
                res(data)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function getCertificate(id){
    return(
        new Promise((res, rej) => {
            fetch(`${process.env.url}/lms-certificates/${id}?populate=*`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                }
            }).then(async (result) => {
                const data = await result.json();
                console.log(data)
                res(data)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function getCourseLessons (courseID) {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/lms-lessons?populate=*`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                }
            }).then(async (result) => {
                const data = await result.json();
                console.log(data)
                const lessons = data.data.filter(item => item.attributes.course_ID === courseID);
                console.log(lessons)
                const newLessons = lessons.map(item => {
                    let newItem = {
                        title: item.attributes.title,
                        description: item.attributes.description
                    }

                    if(item.attributes.video && item.attributes.video.data && item.attributes.video.data[0]){
                        newItem.videoUrl = item.attributes.video.data[0].attributes.url;
                    }

                    if (item.attributes.image && item.attributes.image.data) {
                        newItem.imageUrl = item.attributes.image.data.attributes.url;
                    }

                    return newItem;
                })
                res(newLessons)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function getModule(id){
    return(
        new Promise ((res,rej) => {
            fetch(`${process.env.url}/lms-modules/${id}?populate=*`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                }
            }).then(async (response) => {
                const data = await response.json();
                console.log(data);
                res(data)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function getUsers(){
    return(
        new Promise ((res,rej) => {
            fetch(`${process.env.url}/lms-users`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                }
            }).then(async (response) => {
                const data = await response.json();
                console.log(data);
                res(data)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}



module.exports = {
    createCourse,
    getCourses,
    getCourseLessons,
    getQuizz,
    vinculateCourse,
    finishCourse,
    createUser2,
    getUser2,
    getAllUserCourses,
    finishLesson,
    relationCourseWithUser,
    getModule,
    getOneCourse,
    vinculateLesson,
    vinculateModule,
    getOneUserCourse,
    updatePercentage,
    getLesson,
    getQuiz1,
    getCertificate,
    getUsers


}
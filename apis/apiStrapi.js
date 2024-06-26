const dotenv = require('dotenv');
const { json } = require('express');
const { default: fetch } = require('node-fetch');
const { connect } = require('pm2');
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
                        lms_user_type: {
                            connect: [4]
                        }
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
//&populate=*
async function getUser2(id) {
    try {
        const response = await fetch(`${process.env.url}/lms-users?filters[user_ID][$eq]=${id}&populate=*`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.STRAPI_TOKEN}`
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error de red: ${errorMessage}`);
        }

        const data = await response.json();
        console.log(data)
        const user = data.data.find(user => user.attributes.user_ID === id);

        if (!user) {
            throw new Error("Usuario no encontrado");
        }

        return user;
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        throw error; // Re-lanza el error para que quien llame a esta función pueda manejarlo si es necesario
    }
}

async function getUser3(id) {
    try {
        const response = await fetch(`${process.env.url}/lms-users/${id}?populate=*`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.STRAPI_TOKEN}`
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error de red: ${errorMessage}`);
        }

        const data = await response.json();

        return data;
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        throw error; // Re-lanza el error para que quien llame a esta función pueda manejarlo si es necesario
    }
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
            fetch(`${process.env.url}/lms-courses/${id}?populate[lms_certificate][populate]=*`, {
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

function getOneCourse1 (id) {
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
            fetch(`${process.env.url}/lms-user-courses?populate[lms_course][populate]=*&pagination[page]=1&pagination[pageSize]=10000`, {
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

function createNotification(id, ){

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
                        percentage: 0,
                        courseID: courseID,
                        name: course.attributes.technology,
                        imageUrl: "https://cms.pragra.io" + (course.attributes.imageUrl && course.attributes.imageUrl.data ? course.attributes.imageUrl.data.attributes.url : "")

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

function unVinculateLesson(user_ID, lesson_ID) {
    return(
        new Promise(async (res, rej) => {
            fetch(`${process.env.url}/lms-lessons/${lesson_ID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: await JSON.stringify({
                    data: {
                        lms_users: {
                            disconnect: [user_ID]
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
                            connect: [(user_ID)]
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

async function selectLesson(lesson, score){
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
            data.percentage = 100;
            data.total_lessons = score
            break;
        default:
            // Manejar el caso por defecto si lesson no coincide con ninguno de los casos anteriores.
    }
    return data
}

function finishLesson(id, lesson, score) {
    return(
        new Promise (async (res, rej) => {
            const data = await selectLesson(lesson, score)
            fetch(`${process.env.url}/lms-user-courses/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({
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

function getMentor(id){
    return(
        new Promise((res, rej) => {
            fetch(`${process.env.url}/lms-mentors/${id}?populate=*`, {
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
            fetch(`${process.env.url}/lms-modules/${id}?populate=lms_users,lms_lessons.lms_users,lms_quiz`, {
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

function saveScore(user_ID, quiz_ID, score) {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/lms-quizz-scores/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: await JSON.stringify({
                    data: {
                        lms_user: {
                            connect: [parseInt(user_ID)]
                        },
                        lms_quiz: {
                            connect: [quiz_ID]
                        },
                        score: score
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

function vinculateQuizzWithUser(user_ID, quiz_ID) {
    return(//
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/quizzes/${quiz_ID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: await JSON.stringify({
                    data: {
                        lms_users: {
                            connect: [user_ID]
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

function createTries(user_ID, quiz_ID) {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/lms-quizz-tries/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: await JSON.stringify({
                    data: {
                        lms_users: {
                            connect: [user_ID]
                        },
                        lms_quizzes: {
                            connect: [quiz_ID]
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

function getTries () {
    return(
        new Promise(async (res, rej) => {
            fetch(`${process.env.url}/lms-quizz-tries?populate=*`, {
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

function editInfoUser(user_ID, name, lastName, birth, postal_code, city, province, street_name, academic, country, phone) {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/lms-users/${user_ID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: await JSON.stringify({
                    data: {
                        name: name,
                        last_name: lastName,
                        birth: birth,
                        postal_code: postal_code,
                        city: city,
                        country: country,
                        province: province,
                        street_name: street_name,
                        academic_qualifications: academic,
                        phone: phone
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

function addMessage(user_ID, user_ID2, message, conversation_id){
    return(
        new Promise((res, rej) => {
            fetch(`${process.env.url}/lms-messages`,{
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        from: user_ID,
                        to: user_ID2,
                        message: message,
                        lms_conversations: {
                            connect: [conversation_id]
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

function createConversation(id, id2){
    return(
        new Promise((res, rej) => {
            fetch(`${process.env.url}/lms-conversations`,{
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        lms_users: {
                            connect: [id, id2]
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

function getConversation(id){
    return(
        new Promise((res, rej) => {
            fetch(`${process.env.url}/lms-conversations/${id}?populate=*`, {
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

function getConversation2(id){
    return(
        new Promise((res, rej) => {
            fetch(`${process.env.url}/lms-conversations/${id}?populate=lms_users.profilePicture,lms_messages&pagination[page]=1&pagination[pageSize]=10000`, {
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

function getAnnoucnment(id){
    return(
        new Promise((res, rej) => {
            fetch(`${process.env.url}/announcements/${id}?populate=*`, {
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

function getAllConversations(array) {
    return new Promise((res, rej) => {
        try {
            const conversationPromises = array.map(conver => {
                return getConversation2(conver.id);
            });

            Promise.all(conversationPromises)
                .then(conversations => {
                    res(conversations);
                })
                .catch(error => {
                    console.error("Error al obtener todas las conversaciones:", error);
                    rej(error);
                });
        } catch (error) {
            console.error("Error al procesar las conversaciones:", error);
            rej(error);
        }
    });
}

function readMessage(user_ID, message_id){
    return(
        new Promise((res, rej) => {
            fetch(`${process.env.url}/lms-messages/${message_id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        lms_users: {
                            connect: [user_ID]
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

function vinculateAnnouncementWithUser(user_ID, annoucement_ID) {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/announcements/${annoucement_ID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        lms_users: {
                            connect: [user_ID]
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

function vinculateCertificate(user_ID, certificate_ID){
    return(
        new Promise((res, rej) => {
            fetch(`${process.env.url}/lms-users/${user_ID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        lms_certificates: {
                            connect: [certificate_ID]
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

function addPoints(user_ID, points){
    return(
        new Promise((res, rej) => {
            fetch(`${process.env.url}/lms-users/${user_ID}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        points: points
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

async function getAllUsers() {
    try {
        const response = await fetch(`${process.env.url}/lms-users?populate=*&pagination[page]=1&pagination[pageSize]=10000`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.STRAPI_TOKEN}`
            }
        });

        if (!response.ok) {
            const errorMessage = await response.text();
            throw new Error(`Error de red: ${errorMessage}`);
        }

        const data = await response.json();
        console.log(data)
    
        return data;
    } catch (error) {
        console.error("Error al obtener el usuario:", error);
        throw error; // Re-lanza el error para que quien llame a esta función pueda manejarlo si es necesario
    }
}
//filters[courseName][$eq]=${title}&

function getTextLesson (title) {
    return(
        new Promise (async (res, rej) => {
            fetch(`${process.env.url}/tutorial-pages?filters[courseName][$eq]=${title}`, {
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
    getUsers,
    saveScore,
    vinculateQuizzWithUser,
    createTries,
    editInfoUser,
    getMentor,
    getUser3,
    createNotification,
    addMessage,
    createConversation,
    getConversation,
    getAllConversations,
    readMessage,
    getTries,
    getConversation2,
    getAnnoucnment,
    vinculateAnnouncementWithUser,
    vinculateCertificate,
    addPoints,
    getOneCourse1,
    unVinculateLesson,
    getAllUsers,
    getTextLesson

}
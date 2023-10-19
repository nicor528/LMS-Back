const dotenv = require('dotenv');
const { default: fetch } = require('node-fetch');
dotenv.config();

//${process.env.STRAPI_TOKEN}
function createCourse () {
    const base64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAABJ0lEQVR42mL8//8/AyMjI4cBQFJ1DwMBgZkWj42Nze3b29vQ6tBC9jy3s7OyWAZqAVoBP4zqys7MjJgUFTgrVABWC2Ezgkai+7gN4Ap1YDqsHAkBmzRABPlDMOpmOgDqA4AGY7gNwn5nGwBrK9wXIAkAqN6OvB1NgM6dNwAG1AGghDsAEIepngLUwDPo0/AhaCEzUL3AqOjNqAzaBBwA3G4V8wIAqjqLzTegN4AGgDLXrOvDawmYX9gAmAqNMb1ACMAKjOcbwAqNqzdgGuK4AG+gN4Adgp6EgAHXanAdIN4AkAzqwbkD5AeB1dYPX9ggRAzgAC1yA3eABzXsAma+EM9L7Aa+A7Jv8CzXuAa4TqwpzgApDAAe1ACrMHoCpyH4AwA6gNzTuawCgCwAikA8BCO8wN9wZwA1CHkAImA6S7c0GAEA8gXgAyBVsBaZoByAwA1AGghbgA2gAImAjAgwNAgZgB3GfAGZmBgA5pIGAC3ZAoCdFBYAY4ACy3fAubgAVwAw0IBPACbLdYABWU0wNAvW7Aa7v8wRZqRzCgxwAAAABJRU5ErkJggg==';
    return(
        new Promise(async (res, rej) => {
            fetch('http://localhost:1337/api/courses', {
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

function getCourses () {
    return(
        new Promise (async (res, rej) => {
            fetch("http://3.145.119.21:1337/api/courses", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
            }).then(async (result) => {
                console.log(result)
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

function getQuizz (courseID) {
    return(
        new Promise (async (res, rej) => {
            fetch("http://127.0.0.1:1337/api/quizzes?populate=*", {
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

function vinculateCourse (userID, courseID) {
    return(
        new Promise (async (res, rej) => {
            fetch("http://127.0.0.1:1337/api/user-courses", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
                body: await JSON.stringify({
                    data: {
                        userID: userID,
                        courseID: courseID,
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
                        finish: false
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

function finishCourse(id, userID) {
    return(
        new Promise (async (res, rej) => {
            fetch(`http://127.0.0.1:1337/api/user-courses/${id}`, {
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

function getCourseLessons (courseID) {
    return(
        new Promise (async (res, rej) => {
            fetch("http://127.0.0.1:1337/api/lessons?populate=*", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                }
            }).then(async (result) => {
                const data = await result.json();
                console.log(data)
                const lessons = data.data.filter(item => item.attributes.course_id === courseID);
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




module.exports = {
    createCourse,
    getCourses,
    getCourseLessons,
    getQuizz,
    vinculateCourse,
    finishCourse

}
const { SingUpEmail1 } = require("./apis/apiAuth");
const { createUser2, getUser2, getCourses, vinculateCourse, getAllUserCourses, finishLesson, relationCourseWithUser, getModule, getOneCourse, getQuiz1, getLesson, getUsers, addMessage, createConversation, getAllConversations, getTries, getConversation2, getAnnoucnment, saveScore, getMentor, getCertificate } = require("./apis/apiStrapi");
/*
createUser2("nicolas", "test23@gmail.com").then(data => {
    console.log(data.data.attributes)
}).catch(error => {
    console.log(error)
})*/
/*
SingUpEmail1("test231@gmail.com", "test12").then(user => {
    console.log(user.uid)
}).catch(error => {
    console.log(error)
})*/
/*
getUser2("28ETKZYezs9pr4i7").then(data => {
    console.log(data)
}).catch(error => console.log(error))*/
/*
getCourses().then(data => {
    console.log(data)
}).catch(error => console.log(error))*/
/*
vinculateCourse("28ETKZYezs9pr4i7", "1").then(data => {
    console.log(data.data)
}).catch(error => console.log(error))*/
/*
getAllUserCourses().then(data => {
    //console.log(data.data)
    const allCourses = data.data.filter(data => data.attributes.user_ID === "28ETKZYezs9pr4i7")
    //console.log(allCourses)
    getCourses().then(data => {
        let newCourses = []
        const courses = data.data;
        console.log(courses)
        allCourses.map(item => {
            const course = courses.find(course => course.attributes.courseID === item.attributes.course_ID)
            item.attributes.course_name = course.attributes.technology;
            item.attributes.level = course.attributes.level;
            newCourses.push(item);
        })
        console.log(newCourses);
    }).catch(error => console.log(error))
}).catch(error => console.log(error))*/
/*
const user_ID = "28ETKZYezs9pr4i7";
const course_ID = "1";
const lesson_number = "5";
    getAllUserCourses().then(data => {
        console.log(data.data)
        const allCourses = data.data.filter(data => data.attributes.user_ID === user_ID && data.attributes.course_ID === course_ID);
        console.log(allCourses)
        //const user_course = allCourses.find(item => item.attributes.courseID === course_ID);
        finishLesson(allCourses[0].id, lesson_number).then(data => {
            console.log(data)
        }).catch(error => console.log(error))
    }).catch(error => console.log(error))*/
/*const course_ID = "1";
getCourses().then(data => {
    console.log(data.data[0])
    const course = data.data.filter(item => item.attributes.courseID === course_ID)
    console.log(course[0].attributes.lms_lessons.data)
})*/
/*
createUser2("nico2", "test@gmail.com", "uidtestasd2254", "riquelme", "2024-01-14", "1234", "buenos aires", "argentina", "buenos aires", "1169018596").then(user => {
    console.log(user)
}).catch(error => console.log(error))*/
/*
getUser2("28ETKZYezs9pr4i7").then(user => {
    console.log(user)
}).catch(error => console.log(error))*/

/*
relationCourseWithUser(4,2).then(data => {
    console.log(data)
}).catch(error => console.log(error))*/
/*
getCourses().then(courses => {
    const course = courses.data.filter(item => item.id == 6);
    console.log(course[0].attributes.lms_modules)
    vinculateCourse("TcAvjO1vpccuj1pT7ALwmGQdk342", 6, course[0]).then(data => {
        const response = {
            ...data.data
        }
        console.log(response)
    }).catch(error => console.log(error))
}).catch(error => console.log(error))*/
/*
getAllUserCourses().then(data => {
    console.log(data)
    const allCourses = data.data.filter(data => data.attributes.user_ID === "TcAvjO1vpccuj1pT7ALwmGQdk342")
    console.log(allCourses[2].attributes.lms_course.data)
})*/
/*
getCourses().then(courses => {
    console.log(courses.data[3].attributes.lms_modules)
})*/
/*
getModule(1).then(module => {
    console.log(module.data.attributes.lms_lessons)
}).catch(error => console.log(error))
*/
/*
getCourses().then(courses => {
    const course = courses.data.filter(item => item.id === 6);
    let n_lessons = 0;
    getOneCourse(course[0].id).then(course => {
        console.log(course)
        course.data.attributes.lms_modules.data.map(item => {
            console.log(item)
            item.attributes.lms_lessons.data.map(item => {
                n_lessons ++;
            })
        })
        console.log(n_lessons)
    }).catch(error => console.log(error))

}).catch(error => console.log(error))*/
/*
getQuiz1(1).then(quizz => {
    const answers = [{question: "what is a variable?", answer: "i dont know"}, {question: "what is a function", answer: "asdsad"}]
    console.log(quizz.data.attributes.lms_questions.data[0])
    const right_answers = quizz.data.attributes.lms_questions.data.map(question => {
        return {correct_answer: question.attributes.correct_answer_1, question: question.attributes.question}
    })
    const questions_N = quizz.data.attributes.lms_questions.data.length
    let correct_answers = 0;
    answers.map(answer => {
        const correct = right_answers.find(data => data.question === answer.question && data.correct_answer === answer.answer)
        if(correct){
            correct_answers ++
        }
    })
    const total_score = (correct_answers * 100)/questions_N
    console.log(total_score)
})*/

/*
addMessage("iGaPnJK0qVRWt6I5ik7PFIR6lg73", "nCXrgRl23MaT9DwJOQbz7WnDXn02", "message example", "1").then(result => {
    console.log(result)
}).catch(error => {
    console.log(error)
})*/

/*
createConversation("26", "12").then(result => {
    console.log(result)
}).catch(error => {
    console.log(error)
})*/
/*
getUser2("iGaPnJK0qVRWt6I5ik7PFIR6lg73").then(user => {
    console.log(user)
    getAllConversations(user.attributes.lms_conversations.data).then(conversations => {
        console.log(conversations)
    }).catch(error => console.log(error))
}).catch(error =>  console.log(error))*/
/*
getModule(1).then(result => {
    console.log(result.data.attributes.lms_users.data)
    const finish = result.data.attributes.lms_users.data.find(user => user.attributes.user_ID == "EEMlrD0dRu2o2SSa")
    console.log(finish)
}).catch(error => {
    console.log(error)
})*/

/*
getQuiz1(1).then(quizz => {
    console.log(quizz.data.attributes.lms_course)
    getAllUserCourses().then(data => {
        const allCourses = data.data.filter(data => data.attributes.user_ID === "iGaPnJK0qVRWt6I5ik7PFIR6lg73" && (data.attributes.lms_course.data.id === quizz.data.attributes.lms_course.data.id || data.id === quizz.data.attributes.lms_course.data.id ));
        console.log(allCourses)
        finishLesson(allCourses[0].id, "finish").then(data => {
            saveScore(26, quizz.data.id, 50).then(data => {
                console.log(data)
            }).catch(error => {
                console.log(error)
            })
        }).catch(error => {res.status(400).send({error, status: false})})  
    }).catch(error => {res.status(400).send({error, status: false})})
})*/
/*
async function test () {
    const user_ID = "iGaPnJK0qVRWt6I5ik7PFIR6lg73"
    const course_ID = 2;
    try {
        const courses = await getCourses();
        let course = courses.data.filter(item => item.id === course_ID);
        console.log(course[0]);
        let mentorPromises = course[0].attributes.lms_mentors.data.map(mentor => {
            return getMentor(mentor.id).then(mentorData => mentorData.data);
        });

        let modulePromises = course[0].attributes.lms_modules.data.map(module1 => {
            return getModule(module1.id).then(moduleData => moduleData.data)
        })

        let mentors = await Promise.all(mentorPromises);
        course[0].attributes.lms_mentors.data = mentors;

        let modules = await Promise.all(modulePromises);
        course[0].attributes.lms_modules.data = modules;

        //const quiz = await getQuiz1(course[0].attributes.lms_quizs.data[0].id)

       // const score = 

        const allCourses = await getAllUserCourses();
        const isEnrolled = allCourses.data.find(data => data.attributes.user_ID === user_ID && (data.attributes.lms_course.data.id === course_ID || data.id === course_ID ));
        course[0].attributes.quiz_score = isEnrolled.attributes.finish ? isEnrolled.attributes.total_lessons : 0
        course[0].attributes.enroled = isEnrolled !== undefined;
        console.log(isEnrolled)
    } catch (error) {
        console.log(error)
    }
}

test()*/

getUser2("iGaPnJK0qVRWt6I5ik7PFIR6lg73").then(user => {
    //console.log(user)
    const certificates = user.attributes.lms_certificates.data.map((certificate) => {
        console.log(certificate)
        getCertificate(certificate.id).then(certificate => {
            return certificate
        })
    })
})
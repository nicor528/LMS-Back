const { SingUpEmail1 } = require("./apis/apiAuth");
const { createNewCourseRequest, getOpenRequests, aproveUserCourseRequest, uploadProfilePicture, getProfilePicture } = require("./apis/apiFirebase");
const { createUser2, getUser2, getCourses, vinculateCourse, getAllUserCourses, finishLesson, relationCourseWithUser, getModule, getOneCourse, getQuiz1, getLesson, getUsers, addMessage, createConversation, getAllConversations, getTries, getConversation2, getAnnoucnment, saveScore, getMentor, getCertificate, getAllUsers, getTextLesson } = require("./apis/apiStrapi");
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
/*
getUser2("iGaPnJK0qVRWt6I5ik7PFIR6lg73").then(user => {
    //console.log(user)
    const certificates = user.attributes.lms_certificates.data.map((certificate) => {
        console.log(certificate)
        getCertificate(certificate.id).then(certificate => {
            return certificate
        })
    })
})*/
/*
createNewCourseRequest("iGaPnJK0qVRWt6I5ik7PFIR6lg73", 1, {technology: "Data Science"}, {name: "nicolas"}).then(data => {
    console.log(data)
}).catch(error => {
    console.log(error)
})*/
/*
aproveUserCourseRequest("iGaPnJK0qVRWt6I5ik7PFIR6lg73")/*.then(data => {
    console.log(data)
})*/
/*
async function test(){

    const image1 = "image/jpeg;base64,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"
    
    const image1Buffer = await Buffer.from(image1.split(",")[1], "base64");

uploadProfilePicture("iGaPnJK0qVRWt6I5ik7PFIR6lg73", image1Buffer).then(data => {
    console.log(data)
})
}

test()*/
/*
getProfilePicture("iGaPnJK0qVRWt6I5ik7PFIR6lg73").then(data => {
    console.log(data)
}).catch(error => console.log(error))*/

getTextLesson("text example lesson").then(data => {
    console.log("test", data)
}).catch(error => console.log("test2", error))
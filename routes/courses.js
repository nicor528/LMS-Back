const express = require('express');
const { createCourse, getCourses, vinculateCourse, finishCourse, getAllUserCourses, finishLesson, updatePercentage, getMentor } = require('../apis/apiStrapi');
const router = express.Router();

router.post("/createCourse", async (req, res) => {
    console.log("test")
    const name = req.body.name;
    const description = req.body.description;
    const tech = req.body.tech;
    if(name && description && tech){
        createCourse().then().catch()
    }else{
        
    }
})

router.get("/get-instructor-data", (req, res) => {
    const id = req.query.id;
    if(id){
        getMentor(id).then(mentor => {
            res.status(200).send({data: mentor.data, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data", status: false})
    }
})

router.get("/get-all-courses", async (req, res) => {
    getCourses().then(courses => {
        res.status(200).send({data: courses.data, status: true})
    }).catch(error => {res.status(400).send({error, status: false})})
})

router.get("/get-single-course", async (req, res) => {
    const course_ID = parseInt(req.query.course_ID);
    if(course_ID){
        try {
            const courses = await getCourses();
            let course = courses.data.filter(item => item.id === course_ID);

            let mentorPromises = course[0].attributes.lms_mentors.data.map(mentor => {
                return getMentor(mentor.id);
            });

            let mentors = await Promise.all(mentorPromises);
            course[0].attributes.lms_mentors.data = mentors;

            res.status(200).send({data: course, status: true});
        } catch (error) {
            res.status(400).send({error, status: false});
        }
    } else {
        res.status(401).send({message: "Missing data in the body", status: false});
    }
});

router.post("/add-course-user", async (req, res) => {
    const user_ID = req.body.user_ID;
    const course_ID = parseInt(req.body.course_ID);
    //const course_title = req.body.course_title;
    //const key = req.body.key;
    if(user_ID && course_ID){
        getCourses().then(courses => {
            const Course = courses.data.filter(item => item.id === course_ID);
            let n_lessons; 
            getOneCourse(Course[0].id).then(course => {
                console.log(course)
                course.data.attributes.lms_modules.data.map(item => {
                    console.log(item)
                    item.attributes.lms_lessons.data.map(item => {
                        n_lessons ++;
                    })
                })
                console.log(n_lessons)
                vinculateCourse(user_ID, course_ID, Course[0], n_lessons).then(data => {
                    const response = {
                        ...data.data
                    }
                    res.status(200).send({data: response, status: true})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.post("/finishCourse", async (req, res) => {
    const user_ID = req.body.user_ID;
    const user_course_ID = req.body.user_course_ID;
    //const course_ID = parseInt(req.body.course_ID);
    //const id = req.body.id;
    //const key = req.body.key;
    if(user_ID && user_course_ID){
        finishLesson(user_course_ID, "finish").then(data => {
            res.status(200).send({data: data.data, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

router.get("/get-oneuser-allcourses", (req, res) => {
    const user_ID = req.query.user_ID;
    if(user_ID){
        getAllUserCourses().then(data => {
            const allCourses = data.data.filter(data => data.attributes.user_ID === user_ID)
                /*let newCourses = []
                const courses = data.data;
                allCourses.map(item => {
                    const course = courses.find(course => course.id === item.attributes.lms_course.data.attributes.)
                    item.attributes.course_name = course.attributes.technology;
                    item.attributes.level = course.attributes.level;
                    newCourses.push(item);
                })*/
            res.status(200).send({data: allCourses, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing ID", status: false})
    }
})

router.get("/get-oneuser-onecourse", (req, res) => {
    const user_ID = req.query.user_ID;
    const course_ID = parseInt(req.query.course_ID);
    if(user_ID && course_ID){
        getAllUserCourses().then(data => {
            const allCourses = data.data.filter(data => data.attributes.user_ID === user_ID && (data.attributes.lms_course.data.id === course_ID || data.id === course_ID ));
            res.status(200).send({data: allCourses, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data", status: false})
    }
})

router.get("/get-ongoing-courses", (req, res) => {
    const user_ID = req.query.user_ID;
    if(user_ID){
        getAllUserCourses().then(async (data) => {
            const allCourses = await data.data.filter(data => data.attributes.user_ID === user_ID && data.attributes.finish === false)
            res.status(200).send({data: allCourses, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data", status: false})
    }
})

router.get("/get-finished-courses", (req, res) => {
    const user_ID = req.query.user_ID;
    if(user_ID){
        getAllUserCourses().then(async (data) => {
            const allCourses = await data.data.filter(data => data.attributes.user_ID === user_ID && data.attributes.finish === true)
            res.status(200).send({data: allCourses, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data", status: false})
    }
})
/*
router.get("/get-all-courses", (req, res) => {
    getCourses().then(courses => {
        res.status(200).send({data: courses, status: true})
    }).catch(error => {res.status(400).send({error, status: false})})
})*/

/*
router.post("/finish-lesson", (req, res) => {
    const user_ID = req.body.user_ID;
    const course_ID = req.body.course_ID;
    const lesson_number = req.body.lesson_number.toString();
    if(user_ID && course_ID && lesson_number){
        getAllUserCourses().then(data => {
            const allCourses = data.data.filter(data => data.attributes.user_ID === user_ID && data.id === course_ID);
            //const user_course = allCourses.find(item => item.attributes.courseID === course_ID);
            finishLesson(allCourses[0].id, lesson_number).then(data => {
                res.status(200).send({data: data.data, status: true})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})*/





module.exports = router;
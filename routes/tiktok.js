/**
 * @swagger
 * tags:
 *   name: tiktok
 *   description: tiktok operations
 */
const express = require('express');
const { getAllVideos, addVideo, getUserVideos, saveVideo, generateAlphanumericCode, likeVideo, getSavedVideos, unLikeVideo, unSaveVideo } = require('../apis/apiDynamoDB');
const { actualizarEnlaces, actualizarEnlacesVideos, actualizarEnlacesVideos2 } = require('../apis/apiS3');
const router = express.Router();

/**
 * @swagger
 * /api/tiktok/addVideo:
 *   post:
 *     summary: Add a new video.
 *     tags: [tiktok]
 *     requestBody:
 *       description: Video data to be added.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Video added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       '400':
 *         description: Failed to add video.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       '401':
 *         description: Missing data in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 */
router.post("/addVideo", async (req, res) => {
    const id = req.body.id;
    const videoID = await generateAlphanumericCode();
    const link = req.body.link;
    const description = req.body.description;
    const postProfile = req.body.postProfile;
    const title = req.body.title;
    if(id && link && description && postProfile && title ){
        addVideo(id, videoID, link, description, postProfile, title).then(result => {
            res.status(200).send({message: "ok", status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

/**
 * @swagger
 * /api/tiktok/requestAllVideos:
 *   get:
 *     summary: Get all videos.
 *     tags: [tiktok]
 *     responses:
 *       '200':
 *         description: Successfully retrieved all videos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 status:
 *                   type: boolean
 *       '400':
 *         description: Failed to connect with the database.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 message:
 *                   type: string
 */
router.get("/requestAllVideos", async (req, res) => {
    getAllVideos().then(async (result) => {
        console.log(result)
        const videos = await result.flatMap(item => item.videos.L);
        actualizarEnlacesVideos(videos).then(videos => {
            console.log(videos)
            res.status(200).send({data: videos, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }).catch(error => {
        res.status(400).send({status: false, message: "fail to conect with DB"})
    })
})

/**
 * @swagger
 * /api/tiktok/likeVideo:
 *   post:
 *     summary: Like a video.
 *     tags: [tiktok]
 *     requestBody:
 *       description: Like video data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               ownerID:
 *                 type: string
 *               videoID:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Video liked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       '400':
 *         description: Failed to like video.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       '401':
 *         description: Missing data in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 */
router.post("/likeVideo", async (req, res) => {
    const id = req.body.id;
    const ownerID = req.body.ownerID;
    const videoID = req.body.videoID;
    if(id && ownerID && videoID){
        likeVideo(ownerID, videoID, id).then(result => {
            res.status(200).send({message: "ok", status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

/**
 * @swagger
 * /api/tiktok/unLikeVideo:
 *   post:
 *     summary: Like a video.
 *     tags: [tiktok]
 *     requestBody:
 *       description: Like video data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               ownerID:
 *                 type: string
 *               videoID:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Video liked successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       '400':
 *         description: Failed to like video.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       '401':
 *         description: Missing data in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 */
router.post("/unLikeVideo", async (req, res) => {
    const id = req.body.id;
    const ownerID = req.body.ownerID;
    const videoID = req.body.videoID;
    if(id && ownerID && videoID){
        unLikeVideo(id, ownerID, videoID).then(result => {
            res.status(200).send({message: "ok", status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

/**
 * @swagger
 * /api/tiktok/requestUserVideos:
 *   post:
 *     summary: Get videos of a user.
 *     tags: [tiktok]
 *     requestBody:
 *       description: User ID.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved user's videos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 status:
 *                   type: boolean
 *       '400':
 *         description: Failed to get user's videos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       '401':
 *         description: Missing data in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 */
router.post("/requestUserVideos", async (req, res) => {
    const id = req.body.id;
    getUserVideos(id).then(result => {
        console.log(result.videos)
        actualizarEnlacesVideos2(result.videos).then(videos => {
            console.log(videos)
            res.status(200).send({data: videos, status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }).catch(error => {res.status(400).send({error, status: false})})
})

/**
 * @swagger
 * /api/tiktok/saveVideo:
 *   post:
 *     summary: Save a video.
 *     tags: [tiktok]
 *     requestBody:
 *       description: Video data to be saved.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               videoID:
 *                 type: string
 *               ownerID:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Video saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       '400':
 *         description: Failed to save video.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       '401':
 *         description: Missing data in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 */
router.post("/saveVideo", async (req, res) => {
    const id = req.body.id;
    const videoID = req.body.videoID;
    const ownerID = req.body.ownerID;
    if(id && videoID && ownerID){
        saveVideo(id, videoID, ownerID).then(result => {
            res.status(200).send({message: "ok", status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

/**
 * @swagger
 * /api/tiktok/unSaveVideo:
 *   post:
 *     summary: Save a video.
 *     tags: [tiktok]
 *     requestBody:
 *       description: Video data to be saved.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               videoID:
 *                 type: string
 *               ownerID:
 *                 type: string
 *               link:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Video saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       '400':
 *         description: Failed to save video.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       '401':
 *         description: Missing data in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 */
router.post("/unSaveVideo", async (req, res) => {
    const id = req.body.id;
    const ownerID = req.body.ownerID;
    const videoID = req.body.videoID;
    if(id && ownerID && videoID){
        unSaveVideo(id, ownerID, videoID).then(result => {
            res.status(200).send({message: "ok", status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

/**
 * @swagger
 * /api/tiktok/requestSavedVideos:
 *   post:
 *     summary: Get saved videos of a user.
 *     tags: [tiktok]
 *     requestBody:
 *       description: User ID.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully retrieved saved videos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                 status:
 *                   type: boolean
 *       '400':
 *         description: Failed to get saved videos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 status:
 *                   type: boolean
 *       '401':
 *         description: Missing user ID in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: boolean
 */
router.post("/requestSavedVideos", async (req, res) => {
    const id = req.body.id;
    if(id){
        getSavedVideos(id).then(videos => {
            console.log(videos)
            actualizarEnlacesVideos(videos).then(videos => {
                console.log(videos)
                res.status(200).send({data: videos, status: true})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing id in the body", status: false})
    }
})

router.post("/getOneVideoData", async (req, res) => {

})




module.exports = router;
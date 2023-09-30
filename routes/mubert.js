/**
 * @swagger
 * tags:
 *   name: Spotify
 *   description: Spotify operations
 */
const express = require('express');
const { getRot, createSong, getSongStatus } = require('../apis/apiSpotify');
const { setPat, getPat, getTextSongs, addNewTextSong, getUser, likeTextSong, deleteSong, saveTextSong, getSavedSongs, unLikeSong, unSaveSong, getIASongs } = require('../apis/apiDynamoDB');
const { actualizarEnlaces, saveInS3, generarEnlaceDeDescarga, actualizarEnlaces2 } = require('../apis/apiS3');
const router = express.Router();

/**
 * @swagger
 * /api/Spotify/createPat:
 *   post:
 *     summary: Create PAT (Personal Access Token) for Spotify
 *     tags: [Spotify]
 *     requestBody:
 *       description: User email and ID
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: PAT created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: PAT created successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request
 */
router.post("/createPat", async (req, res) => {
    const email = req.body.email;
    const id = req.body.id;
    getRot(email).then(pat => {
        setPat(id, pat).then(() => {
            res.status(200).send({message: "ok"})
        }).catch(error => {res.status(400)})
    }).catch(error => {res.status(400)})
})

/**
 * @swagger
* /api/spotify/createTextSong:
*   post:
*     summary: Create a text song and associate it with a user
*     tags: [Spotify]
*     requestBody:
*       description: Song details and user ID
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               mode:
*                 type: string
*               duration:
*                 type: string
*               bitrate:
*                 type: string
*               text:
*                 type: string
*               tittle:
*                 type: string
*               id:
*                 type: string
*     responses:
*       200:
*         description: Text song created and associated successfully
*         content:
*           application/json:
*             example:
*               message: Text song created and associated successfully
*       400:
*         description: Bad request
*         content:
*           application/json:
*             example:
*               error: Bad request
*/
router.post("/createTextSong", async (req, res) => {
    const mode = "track";
    const duration = req.body.duration;
    const bitrate = "128";
    const text = req.body.text;
    const title = req.body.title;
    const id = req.body.id;
    const albumCover = "https://upload.wikimedia.org/wikipedia/en/3/3e/Basshunter_%E2%80%93_Boten_Anna.jpg";
    if(mode && duration && bitrate && text && title && id){
        getPat(id).then(pat => {
            getUser(id).then(user => {
                createSong(pat, mode, duration, bitrate, text).then(tasks => {
                    getSongStatus(pat).then(() => {
                        saveInS3(id, title, tasks[0].download_link).then(path => {
                            addNewTextSong(id, tasks[0].task_id, path, title, user.name, duration, albumCover).then(data => {
                                generarEnlaceDeDescarga(path).then(link => {
                                    res.status(200).send({data: {link: link, path: path}, status: true})
                                }).catch(error => {res.status(406).send({error, status: false})})
                            }).catch(error => {res.status(406).send({error, status: false})})
                        }).catch(error => {res.status(405).send({error, status: false})})
                    }).catch(error => {res.status(408).send({error, status: false})})
                }).catch(error => {res.status(404).send({error, status: false})})
            }).catch(error => {res.status(403).send({error, status: false})})
        }).catch(error => {res.status(402).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

/**
 * @swagger
* /api/spotify/requestTextSongs:
*   post:
*     summary: Request text songs associated with a user
*     tags: [Spotify]
*     requestBody:
*       description: User ID
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               id:
*                 type: string
*     responses:
*       200:
*         description: Text songs retrieved successfully
*         content:
*           application/json:
*             example:
*               songs:
*                 - title: Song 1
*                   lyrics: Lyrics for Song 1
*                 - title: Song 2
*                   lyrics: Lyrics for Song 2
*       400:
*         description: Bad request
*         content:
*           application/json:
*             example:
*               error: Bad request
*/
router.post("/requestTextSongs", async (req, res) => {
    const id = req.body.id;
    if(id){
        getTextSongs(id).then(async (songs) => {
            console.log(songs.songs)
            actualizarEnlaces2(songs.songs).then(songs => {
                console.log(songs)
                res.status(200).send({data: songs, status: true})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})


router.post("/deleteSong", async (req, res) => {
    const id = req.body.id;
    const title = req.body.title;
    if(id && title){
        deleteSong(id, title).then(result => {
            res.status(200).send({message: "ok", status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

/**
 * @swagger
 * /api/spotify/likeSong:
 *   post:
 *     summary: Like a song
 *     tags: [Spotify]
 *     requestBody:
 *       description: User ID, Owner ID, and Song Link
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
 *               link:
 *                 type: string
 *     responses:
 *       200:
 *         description: Song liked successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Song liked successfully
 *               status: true
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request
 */
router.post("/likeSong", async (req, res) => {
    const id = req.body.id;
    const ownerID = req.body.ownerID;
    const title = req.body.title;
    if(id && ownerID && title) {
        likeTextSong(id, ownerID, title).then(result => {
            res.status(200).send({message: "ok", status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

/**
 * @swagger
 * /api/spotify/unLikeSong:
 *   post:
 *     summary: Unlike a song
 *     tags: [Spotify]
 *     requestBody:
 *       description: User ID, Owner ID, and Song Title
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
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Song unliked successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Song unliked successfully
 *               status: true
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request
 */
router.post("/unLikeSong", async (req, res) => {
    const id = req.body.id;
    const ownerID = req.body.ownerID;
    const title = req.body.title;
    if(id && ownerID && title){
        unLikeSong(id, ownerID, title).then(result => {
            res.status(200).send({message: "ok", status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

/**
 * @swagger
 * /api/spotify/saveSong:
 *   post:
 *     summary: Save a song
 *     tags: [Spotify]
 *     requestBody:
 *       description: User ID, Owner ID, and Song Title
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
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Song saved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Song saved successfully
 *               status: true
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request
 */
router.post("/saveSong", async (req, res) => {
    const id = req.body.id;
    const ownerID = req.body.ownerID;
    const title = req.body.title;
    if(id && ownerID && title) {
        saveTextSong(id, ownerID, title).then(result => {
            res.status(200).send({message: "ok", status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})

/**
 * @swagger
 * /api/spotify/unSaveSong:
 *   post:
 *     summary: Unsave a song
 *     tags: [Spotify]
 *     requestBody:
 *       description: User ID, Owner ID, and Song Title
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
 *               title:
 *                 type: string
 *     responses:
 *       200:
 *         description: Song unsaved successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Song unsaved successfully
 *               status: true
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request
 */
router.post("/unSaveSong", async (req, res) => {
    const id = req.body.id;
    const ownerID = req.body.ownerID;
    const title = req.body.title;
    if(id && ownerID && title){
        unSaveSong(id, ownerID, title).then(result => {
            res.status(200).send({message: "ok", status: true})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false})
    }
})


/**
 * @swagger
 * /api/spotify/getAllSavedSongs:
 *   post:
 *     summary: Get all liked songs for a user
 *     tags: [Spotify]
 *     requestBody:
 *       description: User ID
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Liked songs retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               data:
 *                 - title: Liked Song 1
 *                   link: Link to Liked Song 1
 *                 - title: Liked Song 2
 *                   link: Link to Liked Song 2
 *               status: true
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               error: Bad request
 */
router.post("/getAllSavedSongs", async (req, res) => {
    const id = req.body.id;
    if(id){
        getSavedSongs(id).then(songs => {
            actualizarEnlaces(songs).then(songs => {
                console.log(songs)
                console.log(songs[0].link)
                res.status(200).send({data: songs, status: true})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})

/**
 * @swagger
* /api/spotify/getAllSongsUser:
*   post:
*     summary: Request text songs associated with a user
*     tags: [Spotify]
*     requestBody:
*       description: User ID
*       required: true
*       content:
*         application/json:
*           schema:
*             type: object
*             properties:
*               id:
*                 type: string
*     responses:
*       200:
*         description: Text songs retrieved successfully
*         content:
*           application/json:
*             example:
*               songs:
*                 - title: Song 1
*                   lyrics: Lyrics for Song 1
*                 - title: Song 2
*                   lyrics: Lyrics for Song 2
*       400:
*         description: Bad request
*         content:
*           application/json:
*             example:
*               error: Bad request
*/
router.post("/getAllSongsUser", async (req, res) => {
    const id = req.body.id;
    if(id){
        getTextSongs(id).then(songs => {
            console.log(songs)
            const Songs = songs.songs;
            getIASongs(id).then(result => {
                console.log("test2")
                const allSongs = [...result, ...Songs]
                actualizarEnlaces2(allSongs).then(songs => {
                    console.log(songs)
                    res.status(200).send({data: songs, status: true})
                }).catch(error => {res.status(400).send({error, status: false})})
            }).catch(error => {res.status(400).send({error, status: false})})
        }).catch(error => {res.status(400).send({error, status: false})})
    }else{
        res.status(401).send({message: "Missing data in the body", status: false}) 
    }
})




module.exports = router;
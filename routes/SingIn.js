/**
 * @swagger
 * tags:
 *   name: SingIn
 *   description: SingIn operations
 */

const express = require('express');
const { SingInPass, resetPass } = require('../apis/apiAuth');
const { getUser2, getAllUserCourses, editInfoUser } = require('../apis/apiStrapi');
const { uploadProfilePicture, getProfilePicture, generateAndSaveTokens, uploadCV, getCV, verifyToken, refreshAccessToken } = require('../apis/apiFirebase');
const router = express.Router();

/**
 * @swagger
 * /api/singin/singInEmail:
 *   post:
 *     summary: Sing In using email and password
 *     tags: [SingIn]
 *     requestBody:
 *       description: User data for Email Sign In
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               pass:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sign In successful
 *         content:
 *           application/json:
 *             example:
 *               user: { id: "123", name: "John",... }
 *               key: "abc123"
 *       400:
 *         description: Bad connection with DB
 *         content:
 *           application/json:
 *             example:
 *               error: Bad connection with DB
 */
router.post("/singInEmail", async (req, res) => {
    const email = req.body.email;
    const pass = req.body.pass;
  
    if (email && pass) {
      try {
        SingInPass(email, pass).then(async (userCredential) => {
          const user = userCredential.user;
  
          // Verificar si el correo electrónico está verificado
          if (!user.emailVerified) {
            res.status(401).send({ message: "Email not verified", status: false });
            return;
          }
  
          // Si el correo está verificado, proceder con la generación de tokens y otras operaciones
          console.log("Usuario autenticado correctamente");
  
          const { accessToken, refreshToken } = await generateAndSaveTokens(user.uid);
          
          // Obtener datos del usuario
          getUser2(user.uid).then(async (userData) => {
            // Procesar los datos del usuario y otras operaciones necesarias
            console.log("Datos del usuario:", userData);
  
            getAllUserCourses().then(async (coursesData) => {
              const allCourses = coursesData.data.filter(data => data.attributes.user_ID === userData.attributes.user_ID);
              userData.attributes.lms_user_courses = allCourses.length > 0 ? allCourses : [];
  
              getProfilePicture(userData.attributes.user_ID).then(url => {
                userData.attributes.profilePictureUrl = url;
                res.status(200).send({
                  data: userData,
                  accessToken,
                  refreshToken,
                  status: true,
                  message: "Inicio de sesión exitoso"
                });
              }).catch(error => {
                res.status(400).send({ error, status: false });
              });
            }).catch(error => {
              res.status(400).send({ error, status: false });
            });
          }).catch(error => {
            res.status(400).send({ message: "Wrong email or password", status: false });
          });
  
        }).catch(error => {
          res.status(400).send({ message: "Wrong email or password", status: false });
        });
      } catch (error) {
        res.status(400).send({ message: 'Wrong email or password', status: false });
      }
    } else {
      res.status(401).send({ message: "Missing data in the body", status: false });
    }
});

router.get("/getUserInfo", async (req, res) => {
    const user_ID = req.query.user_ID;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!user_ID || !token) {
        return res.status(401).send({ message: "Missing data in the body", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);
        // Si el token es válido, continuar con la lógica normal
        const user = await getUser2(user_ID);
        const allCourses = (await getAllUserCourses()).data.filter(data => data.attributes.user_ID === user_ID);
        user.attributes.lms_user_courses = allCourses.length > 0 ? allCourses : [];
        const profilePictureUrl = await getProfilePicture(user.attributes.user_ID);
        user.attributes.profilePictureUrl = profilePictureUrl;
        const pdfURL = await getCV(user_ID);
        user.pdfURL = pdfURL;
        res.status(200).send({ data: user, status: true, message: "successful" });

    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                // Intentar actualizar el token de acceso usando el refresh token
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);

                // Continuar con la lógica normal usando el nuevo token de acceso
                const user = await getUser2(user_ID);
                const allCourses = (await getAllUserCourses()).data.filter(data => data.attributes.user_ID === user_ID);
                user.attributes.lms_user_courses = allCourses.length > 0 ? allCourses : [];
                const profilePictureUrl = await getProfilePicture(user.attributes.user_ID);
                user.attributes.profilePictureUrl = profilePictureUrl;
                const pdfURL = await getCV(user_ID);
                user.pdfURL = pdfURL;

                res.status(200).send({ data: user, newAccessToken: newAccessToken, status: true, message: "Token refreshed and successful" });

            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        }  if (error.name === 'TokenExpiredError' && refreshToken) {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }else {
            res.status(400).send({ message: error.name, status: false });
        }
    }
});

/**
 * @swagger
 * /api/singin/singInWithId:
 *   post:
 *     summary: Sing In using user ID
 *     tags: [SingIn]
 *     requestBody:
 *       description: User data for ID Sign In
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               uid:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sign In successful
 *         content:
 *           application/json:
 *             example:
 *               user: { id: "123", name: "John" }
 *               key: "abc123"
 *       400:
 *         description: Bad connection with DB
 *         content:
 *           application/json:
 *             example:
 *               error: Bad connection with DB
 */
router.post("/singInWithId", async (req, res) => {
    const uid = req.body.uid;
    if(uid){
        getUser2(uid).then(user => {
            res.status(200).send({user, status: true, message: "login succefull"})
        }).catch(error => {res.status(400).send({message: "Wrong email or password", status: false})})
    }else{
        res.status(401).send({message: "missing uid", status: false})
    }
})

/**
 * @swagger
 * /api/singin/resetPass:
 *   post:
 *     summary: Reset your password.
 *     tags: [SingIn]
 *     requestBody:
 *       description: User email.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
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
router.post("/resetPass", async (req, res) => {
    const { email, user_ID } = req.body;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!email || !token || !user_ID) {
        return res.status(401).send({ message: "Missing data in the body", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);
        // Si el token es válido, proceder con la lógica normal
        await resetPass(email);
        res.status(200).send({ status: true, message: "ok" });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                // Intentar actualizar el token de acceso usando el refresh token
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                // Proceder con la lógica normal después de refrescar el token
                await resetPass(email);
                res.status(200).send({ newAccessToken: newAccessToken, status: true, message: "Token refreshed and password reset" });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } if (error.name === 'TokenExpiredError' && refreshToken) {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }else {
            res.status(400).send({ message: error.name, status: false });
        }
    }
});


router.post("/edit-profile-picture", async (req, res) => {
    const { user_ID, image1 } = req.body;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!user_ID || !image1 || !token) {
        return res.status(401).send({ message: "Missing data in the body", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);
        // Si el token es válido, proceder con la lógica normal
        const image1Buffer = Buffer.from(image1.split(",")[1], "base64");
        const url = await uploadProfilePicture(user_ID, image1Buffer);
        res.status(200).send({ data: url, status: true, message: "ok" });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                // Intentar actualizar el token de acceso usando el refresh token
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                // Proceder con la lógica normal después de refrescar el token
                const image1Buffer = Buffer.from(image1.split(",")[1], "base64");
                const url = await uploadProfilePicture(user_ID, image1Buffer);
                res.status(200).send({ data: url, newAccessToken: newAccessToken, status: true, message: "Token refreshed and profile picture updated" });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } if (error.name === 'TokenExpiredError' && refreshToken) {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }else {
            res.status(400).send({ message: error.name, status: false });
        }
    }
});


router.post("/upload-CV", async (req, res) => {
    const { user_ID, pdf } = req.body;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!user_ID || !pdf || !token) {
        return res.status(401).send({ message: "Missing data in the body", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);
        // Si el token es válido, proceder con la lógica normal
        const pdfBuffer = Buffer.from(pdf.split(",")[1], "base64");
        const url = await uploadCV(user_ID, pdfBuffer);
        res.status(200).send({ data: url, status: true, message: "ok" });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                // Intentar actualizar el token de acceso usando el refresh token
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                // Proceder con la lógica normal después de refrescar el token
                const pdfBuffer = Buffer.from(pdf.split(",")[1], "base64");
                const url = await uploadCV(user_ID, pdfBuffer);
                res.status(200).send({ data: url, newAccessToken: newAccessToken, status: true, message: "Token refreshed and upload successful" });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } if (error.name === 'TokenExpiredError' && refreshToken) {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }else {
            res.status(400).send({ message: error.name, status: false });
        }
    }
});


router.post("/edit-info-user", async (req, res) => {
    const { user_ID, name, lastName, birth, postal_code, city, province, country, street_name, academic, phone } = req.body;
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    const refreshToken = req.headers['refresh-token'];

    if (!user_ID || !name || !lastName || !birth || !postal_code || !city || !province || !country || !street_name || !academic || !phone || !token) {
        return res.status(401).send({ message: "Missing data in the body", status: false });
    }

    try {
        const tokenPayload = verifyToken(token);
        // Si el token es válido, proceder con la lógica normal
        const user = await getUser2(user_ID);
        const updatedUser = await editInfoUser(user.id, name, lastName, birth, postal_code, city, province, street_name, academic, country, phone);
        res.status(200).send({ data: updatedUser, status: true, message: "Update successful" });
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            try {
                // Intentar actualizar el token de acceso usando el refresh token
                const newAccessToken = await refreshAccessToken(user_ID, refreshToken);
                // Proceder con la lógica normal después de refrescar el token
                const user = await getUser2(user_ID);
                const updatedUser = await editInfoUser(user.id, name, lastName, birth, postal_code, city, province, street_name, academic, country, phone);
                res.status(200).send({ data: updatedUser, newAccessToken: newAccessToken, status: true, message: "Token refreshed and update successful" });
            } catch (refreshError) {
                res.status(401).send({ message: refreshError.message, status: false });
            }
        } if (error.name === 'TokenExpiredError' && refreshToken) {
            res.status(401).send({ message: 'Invalid or expired token', status: false });
        }else {
            res.status(400).send({ message: error.name, status: false });
        }
    }
});



module.exports = router;
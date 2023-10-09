const { DynamoDBClient, CreateTableCommand, UpdateItemCommand, GetItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDB } = require('@aws-sdk/client-dynamodb');
const { fromEnv } = require('@aws-sdk/credential-provider-env');
const dotenv = require('dotenv');
const { PutCommand, DynamoDBDocumentClient, GetCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");
const { fromIni } = require('@aws-sdk/credential-provider-ini');

// Carga las variables de entorno desde el archivo .env
dotenv.config();

/*async function main() {
  // Configura el cliente de DynamoDB con las credenciales desde las variables de entorno
  const dynamoDBClient = new DynamoDBClient({
    region: 'us-east-1', // Reemplaza con tu región deseada
    credentials: fromEnv(),
  });

  // Utiliza el cliente de DynamoDB para realizar operaciones en la base de datos
  const dynamoDB = new DynamoDB({ client: dynamoDBClient });

  // Resto del código para interactuar con DynamoDB
}*/

const dynamoDBClient = new DynamoDBClient({
    region: 'us-east-2', // Reemplaza con tu región deseada
    credentials: fromEnv(),
});

  // Utiliza el cliente de DynamoDB para realizar operaciones en la base de datos
const dynamoDB = new DynamoDB({ client: dynamoDBClient });

/*const dynamoDBClient = new DynamoDBClient({
    region: 'us-east-2', // Reemplaza con tu región deseada
    credentials: fromIni({ profile: "zing-zang-main" }),
});*/

const docClient = DynamoDBDocumentClient.from(dynamoDBClient);

  // Utiliza el cliente de DynamoDB para realizar operaciones en la base de datos
//const dynamoDB = new DynamoDB({ client: dynamoDBClient });

//main();

function generateAlphanumericCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < 16; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    return code;
}

function createID (uid) {
    return (
        new Promise (async (res, rej) => {
            const newCode = await generateAlphanumericCode();
            const command = await new PutCommand({
                TableName: "iox-LMS",
                Item: {
                    uid: uid,
                    id: newCode,
                }
            })
            docClient.send(command).then(response => {
                res(newCode)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function setPat (id, pat) {
    return (
        new Promise (async (res, rej) => {
            const command = await new PutCommand({
                TableName: "pat",
                Item: {
                    id: id,
                    pat: pat,
                }
            })
            docClient.send(command).then(response => {
                res()
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function getPat (id) {
    return(
        new Promise (async (res, rej) => {
            const command = await new GetCommand({
                TableName: "pat",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                res(result.Item.pat)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function verifyKey (id, key) {
    return(
        new Promise (async (res, rej) => {
            const newCode = await generateAlphanumericCode();
            const command = await new GetCommand({
                TableName: "keys-LMS",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                const lastKey = result.Item.key
                if(lastKey == key){
                    res(newCode)
                }else{
                    rej(1)
                }
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function getKey (id) {
    return(
        new Promise(async (res, rej) => {
            const command = await new GetCommand({
                TableName: "keys-LMS",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                res(result.Item.key)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function setNewKey(id, newKey) {
    return(
        new Promise (async (res, rej) => {
            const command = await new PutCommand({
                TableName: "keys-LMS",
                Item: {
                    id: id,
                    key: newKey
                }
            })
            docClient.send(command).then(result => {
                console.log(result)
                res(result)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function getID (uid) {
    return(
        new Promise (async (res, rej) => {
            const command = await new GetCommand({
                TableName: "iox-LMS",
                Key: {
                    uid: uid
                }
            })
            docClient.send(command).then(result => {
                if(result.Item === undefined){
                    rej(1)
                }else{
                    res(result.Item.id)
                }
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function setSubDate (id, date) {
    return(
        new Promise (async (res, rej) => {
            const command = await new PutCommand({
                TableName: "subsDate",
                Item: {
                    id: id,
                    date: date
                }
            })
        })
    )
}

function createUser (id, user, email, pass) {
    return(
        new Promise (async (res, rej) => {
                    const command = new PutCommand({
                        TableName: "users-LMS",
                        Item: {
                            id: id,
                            name: user.name,
                            email: email,
                            pass: pass,
                            subscription: false,
                            IAtrained: false,
                        }
                    })
                    docClient.send(command).then(response => {
                                console.log(response)
                                res(response)
            }).catch(error => {console.log(error), rej(error)})
        })
    )
}

function getUser (id) {
    return(
        new Promise (async (res, rej) => {
            const command = await new GetCommand({
                TableName: "users-LMS",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                res(result.Item)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function addTextSongToUser (id, tiitle) {
    return(
        new Promise (async (res, rej) => {
            const command = await new GetCommand({
                TableName: "test",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                const newUser = {...result.Item,
                    
                }
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function getTextSongs (id) {
    return (
        new Promise (async (res, rej) => {
            const command = await new GetCommand({
                TableName: "textSongs",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                res(result.Item)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function unSaveSong(id, ownerID, title) {
    return(
        new Promise(async (res, rej) => {
            const command = await new GetCommand({
                TableName: "textSongs",
                Key: {
                    id: ownerID
                }
            })
            docClient.send(command).then(result => {
                const songs = result.Item.songs
                const songToUpdate = songs.find((song) => song.title === title);
                if (songToUpdate) {
                    // Filtra los likes para eliminar el usuario específico
                    songToUpdate.saves = songToUpdate.saves.filter((userId) => userId !== id);
                  
                    // Encuentra el índice de la canción en el array principal
                    const songIndex = songs.findIndex((song) => song.title === title);
                  
                    // Actualiza la canción en el array principal
                    songs[songIndex] = songToUpdate;
                    const command = new PutCommand({
                        TableName: "textSongs",
                        Item: {
                            id: ownerID,
                            songs: songs
                        }
                    })
                    docClient.send(command).then(result => {
                        res(result)
                    })
                } else {
                    rej({error: "Not song found"})
                    console.log("No se encontró la canción especificada.");
                }
            })
        })
    )
}

function unLikeSong(id, ownerID, title) {
    return(
        new Promise(async (res, rej) => {
            const command = await new GetCommand({
                TableName: "textSongs",
                Key: {
                    id: ownerID
                }
            })
            docClient.send(command).then(result => {
                const songs = result.Item.songs
                const songToUpdate = songs.find((song) => song.title === title);
                if (songToUpdate) {
                    // Filtra los likes para eliminar el usuario específico
                    songToUpdate.likes = songToUpdate.likes.filter((userId) => userId !== id);
                  
                    // Encuentra el índice de la canción en el array principal
                    const songIndex = songs.findIndex((song) => song.title === title);
                  
                    // Actualiza la canción en el array principal
                    songs[songIndex] = songToUpdate;
                    const command = new PutCommand({
                        TableName: "textSongs",
                        Item: {
                            id: ownerID,
                            songs: songs
                        }
                    })
                    docClient.send(command).then(result => {
                        res(result)
                    })
                } else {
                    rej({error: "Not song found"})
                    console.log("No se encontró la canción especificada.");
                }
            })
        })
    )
}

function getIASongs(id) {
    return(
        new Promise (async (res, rej) => {
            const command = await new GetCommand({
                TableName: "IAsongs",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                res(result.Item.songs)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function addIAsong (id, title, albumCover, link){
    return(
        new Promise (async (res, rej) => {
            const command = await new GetCommand({
                TableName: "IAsongs",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                console.log(result.Item.songs)
                const newID = result.Item.songs.length + 1
                const newUser = {
                    songs :  [...result.Item.songs,
                        {
                            title: title,
                            id: newID.toString(),
                            link: link,
                            albumCover: albumCover,
                            likes: [],
                            ownerID: id,
                            saves: [],
                            type: "IA"
                        }
                    ]
                }
                const command = new PutCommand({
                    TableName: "IAsongs",
                    Item: {
                        id: id,
                        ...newUser
                    }
                })
                docClient.send(command).then(result => {
                    console.log(result)
                    res(result)
                }).catch(error => {
                    console.log(error);
                    rej(error)
                })
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function deleteSong (id, title) {
    return(
        new Promise (async (res, rej) => {
            const command = await new GetCommand({
                TableName: "textSongs",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(async (result) => {
                const SONGS = result.Item.songs;
                const filteredArray = await SONGS.filter((item) => item.title !== title);
                console.log(filteredArray);
                const songs = {songs: [...filteredArray]}
                const command = new PutCommand({
                    TableName: "textSongs",
                    Item: {
                        id: id,
                        ...songs
                    }
                })
                docClient.send(command).then(result => {
                    res(result)
                }).catch(error => {
                    console.log(error)
                    rej(error)
                })
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function addNewTextSong (id, id2, link, title, autor, duration, cover) {
    return(
        new Promise (async (res, rej) => {
            const command = await new GetCommand({
                TableName: "textSongs",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                console.log(result.Item.songs)
                const newID = result.Item.songs.length + 1
                const newUser = {
                    songs :  [...result.Item.songs,
                        {
                            title: title,
                            id: newID.toString(),
                            link: link,
                            artist: autor,
                            duration: duration,
                            albumCover: cover,
                            likes: [],
                            ownerID: id,
                            saves: [],
                            type: "textSong"
                        }
                    ]
                }
                const command = new PutCommand({
                    TableName: "textSongs",
                    Item: {
                        id: id,
                        ...newUser
                    }
                })
                docClient.send(command).then(result => {
                    console.log(result)
                    res(result)
                }).catch(error => {
                    console.log(error);
                    rej(error)
                })
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

async function addDataToObject(id, id2, tittle, link2) {
    return(
        new Promise (async (res, rej) => {
            const link = link2.replace(/[^a-zA-Z0-9-_]/g, '')
            const getItemParams = {
                TableName: 'test', // Reemplaza 'tu_tabla' por el nombre de tu tabla
                Key: {
                    id: { S: id }
                }
            };
        
            try {
                const { Item } = await docClient.send(new GetItemCommand(getItemParams));
        
                if (Item) {
                    // Objeto recuperado con éxito
                    const existingObject = Item;
        
                    // Crea el objeto que deseas agregar
                    const newObject = {
                        id: { S: id2 },
                        link: { S: link },
                        tittle: { S: tittle }
                    };
        
                    // Agrega el nuevo objeto al objeto existente
                    existingObject[tittle] = newObject[tittle];
        
                    // Ahora, actualiza el objeto modificado en DynamoDB
                    const updateParams = {
                        TableName: 'test',
                        Key: {
                            id: { S: id }
                        },
                        UpdateExpression: `SET ${tittle} = :value`,
                        ExpressionAttributeValues: {
                            ':value': newObject[tittle]
                        },
                        ReturnValues: 'ALL_NEW' // Esto devolverá el elemento actualizado
                    };
        
                    const updatedItem = await docClient.send(new UpdateItemCommand(updateParams));
                    console.log('Objeto actualizado con éxito:', updatedItem);
                    res()
                } else {
                    console.error('Objeto no encontrado.');
                }
            } catch (error) {
                console.error('Error al interactuar con DynamoDB:', error);
                rej()
            }
        })
    )
    
}

function getAllVideos () {
    return(
        new Promise (async (res, rej) => {
            const command = await new ScanCommand({TableName: "videos"})
            docClient.send(command).then(result => {
                res(result.Items)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function getUserVideos (id) {
    return(
        new Promise (async (res, rej) => {
            const command = await new GetCommand({
                TableName: "videos",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                res(result.Item)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function addVideo (id, videoID, link, description, postProfile, title, song) {
    return(
        new Promise (async (res, rej) => {
            const command = await new GetCommand({
                TableName: "videos",
                Key: {
                    id: id
                }
            })
            docClient.send(command).then(result => {
                console.log(result.Item.videos)
                const newID = result.Item.videos.length + 1
                const newUser = {
                    videos :  [...result.Item.videos,
                        {
                            id: newID.toString(),
                            link: link,
                            videoID: videoID,
                            likes: [],
                            ownerID: id,
                            postProfile: postProfile,
                            description: description,
                            title: title,
                            saves: []
                        }
                    ]
                }
                const command = new PutCommand({
                    TableName: "videos",
                    Item: {
                        id: id,
                        ...newUser
                    }
                })
                docClient.send(command).then(result => {
                    console.log(result)
                    res(result)
                }).catch(error => {
                    console.log(error);
                    rej(error)
                })
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function saveTextSong (id, ownerID, title) {
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "textSongs",
                Key: {
                    id: ownerID
                }
            })
            docClient.send(command).then((result) => {
                let newUser = result.Item
                const songIndex = newUser.songs.findIndex((song) => song.title === title);
                if (songIndex !== -1) {
                    // Suma un nuevo ID al arreglo likes del video encontrado
                    const newLikeID = id;
                    newUser.songs[songIndex].saves.push(newLikeID);
                    const command = new PutCommand({
                        TableName: "textSongs",
                        Item: {
                            id: ownerID,
                            ...newUser
                        }
                    })
                    docClient.send(command).then(result => {
                        res(result)
                    }).catch(error => {
                        console.log(error)
                        rej(error)
                    })
                } else {
                    rej("song not found")
                    console.log('song no encontrado'); // Maneja el caso en que el video no se encuentra
                }
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function likeTextSong (id, ownerID, title) {
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "textSongs",
                Key: {
                    id: ownerID
                }
            })
            docClient.send(command).then((result) => {
                let newUser = result.Item
                const songIndex = newUser.songs.findIndex((song) => song.title === title);
                if (songIndex !== -1) {
                    // Suma un nuevo ID al arreglo likes del video encontrado
                    const newLikeID = id;
                    newUser.songs[songIndex].likes.push(newLikeID);
                    const command = new PutCommand({
                        TableName: "textSongs",
                        Item: {
                            id: ownerID,
                            ...newUser
                        }
                    })
                    docClient.send(command).then(result => {
                        res(result)
                    }).catch(error => {
                        console.log(error)
                        rej(error)
                    })
                } else {
                    rej("Video not found")
                    console.log('Video no encontrado'); // Maneja el caso en que el video no se encuentra
                }
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function getSavedSongs (id) {
    return(
        new Promise (async (res, rej) => {
            const command = await new ScanCommand({TableName: "textSongs"})
            docClient.send(command).then(async (result) => {
                const allSongs = result.Items;
                const songs = await allSongs.flatMap(item => item.songs.L);
                console.log(songs)
                const cancionesConLikesEspecificos = songs.reduce((result, objeto) => {
                    if (objeto.M && objeto.M.saves && objeto.M.saves.L) {
                      // Si el objeto tiene una propiedad "M", "likes", y "L" que es un array
                      const saves = objeto.M.saves.L;
                      const tieneLikeEspecifico = saves.some((saves) => {
                        return saves.S === id;
                      });
                  
                      if (tieneLikeEspecifico) {
                        if (!Array.isArray(result)) {
                          result = []; // Inicializa result como un array si aún no lo es
                        }
                        result.push(objeto); // Agrega el objeto completo al nuevo array
                      }
                    }
                    return result;
                  }, []);
                console.log(cancionesConLikesEspecificos)
                res(cancionesConLikesEspecificos)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function unLikeVideo(id, ownerID, videoID) {
    return(
        new Promise(async (res, rej) => {
            const command = await new GetCommand({
                TableName: "videos",
                Key: {
                    id: ownerID
                }
            })
            docClient.send(command).then(result => {
                const videos = result.Item.videos
                const videoToUpdate = videos.find((video) => video.videoID === videoID);
                if (videoToUpdate) {
                    // Filtra los likes para eliminar el usuario específico
                    videoToUpdate.likes = videoToUpdate.likes.filter((userId) => userId !== id);
                  
                    // Encuentra el índice de la canción en el array principal
                    const songIndex = videos.findIndex((video) => video.videoID === videoID);
                  
                    // Actualiza la canción en el array principal
                    videos[songIndex] = videoToUpdate;
                    const command = new PutCommand({
                        TableName: "videos",
                        Item: {
                            id: ownerID,
                            videos: videos
                        }
                    })
                    docClient.send(command).then(result => {
                        res(result)
                    })
                } else {
                    rej({error: "Not song found"})
                    console.log("No se encontró la canción especificada.");
                }
            })
        })
    )
}

function likeVideo (ownerID, videoID, id) {
    return(
        new Promise (async (res, rej) => {
            console.log(ownerID)
            const command = new GetCommand({
                TableName: "videos",
                Key: {
                    id: ownerID
                }
            })
            docClient.send(command).then(result => {
                console.log(result.Item.videos)
                let newUser = result.Item
                const videoIndex = newUser.videos.findIndex((video) => video.videoID === videoID);
                if (videoIndex !== -1) {
                    // Suma un nuevo ID al arreglo likes del video encontrado
                    const newLikeID = id;
                    newUser.videos[videoIndex].likes.push(newLikeID);
                    const command = new PutCommand({
                        TableName: "videos",
                        Item: {
                            id: ownerID,
                            ...newUser
                        }
                    })
                    docClient.send(command).then(result => {
                        res(result)
                    }).catch(error => {
                        console.log(error)
                        rej(error)
                    })
                } else {
                    rej("Video not found")
                    console.log('Video no encontrado'); // Maneja el caso en que el video no se encuentra
                }
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function getSavedVideos (id){
    return(
        new Promise (async (res, rej) => {
            const command = await new ScanCommand({TableName: "videos"})
            docClient.send(command).then(async (result) => {
                const allVideos = result.Items;
                const videos = await allVideos.flatMap(item => item.videos.L);
                console.log(videos)
                const videosConSavesEspecificos = videos.reduce((result, objeto) => {
                    if (objeto.M && objeto.M.saves && objeto.M.saves.L) {
                      // Si el objeto tiene una propiedad "M", "likes", y "L" que es un array
                      const saves = objeto.M.saves.L;
                      const tieneLikeEspecifico = saves.some((save) => {
                        return save.S === id;
                      });
                      if (tieneLikeEspecifico) {
                        if (!Array.isArray(result)) {
                          result = []; // Inicializa result como un array si aún no lo es
                        }
                        result.push(objeto); // Agrega el objeto completo al nuevo array
                      }
                    }
                    return result;
                  }, []);
                console.log(videosConSavesEspecificos)
                res(videosConSavesEspecificos)
            }).catch(error => {
                console.log(error)
                rej(error)
            })

        })
    )
}

function unSaveVideo(id, ownerID, videoID) {
    return(
        new Promise(async (res, rej) => {
            const command = await new GetCommand({
                TableName: "videos",
                Key: {
                    id: ownerID
                }
            })
            docClient.send(command).then(result => {
                const videos = result.Item.videos
                const videoToUpdate = videos.find((video) => video.videoID === videoID);
                if (videoToUpdate) {
                    // Filtra los likes para eliminar el usuario específico
                    videoToUpdate.saves = videoToUpdate.saves.filter((userId) => userId !== id);
                  
                    // Encuentra el índice de la canción en el array principal
                    const videoIndex = videos.findIndex((video) => video.videoID === videoID);
                  
                    // Actualiza la canción en el array principal
                    videos[videoIndex] = videoToUpdate;
                    const command = new PutCommand({
                        TableName: "videos",
                        Item: {
                            id: ownerID,
                            videos: videos
                        }
                    })
                    docClient.send(command).then(result => {
                        res(result)
                    })
                } else {
                    rej({error: "Not song found"})
                    console.log("No se encontró la canción especificada.");
                }
            })
        })
    )
}

function saveVideo (id, videoID, ownerID) {
    return(
        new Promise (async (res, rej) => {
            const command = new GetCommand({
                TableName: "videos",
                Key: {
                    id: ownerID
                }
            })
            docClient.send(command).then(result => {
                console.log(result.Item.videos)
                let newUser = result.Item;
                const songIndex = newUser.videos.findIndex((video) => video.videoID === videoID);
                if (songIndex !== -1) {
                    // Suma un nuevo ID al arreglo likes del video encontrado
                    const newLikeID = id;
                    newUser.videos[songIndex].saves.push(newLikeID);
                    const command = new PutCommand({
                        TableName: "videos",
                        Item: {
                            id: ownerID,
                            ...newUser
                        }
                    })
                    docClient.send(command).then(result => {
                        res(result)
                    }).catch(error => {
                        console.log(error)
                        rej(error)
                    })
                } else {
                    rej("Video not found")
                    console.log('Video no encontrado'); // Maneja el caso en que el video no se encuentra
                }
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function editInfoUser (user) {

}

function createTable () {
    return (
        new Promise (async (res, rej) => {
            const command = await new CreateTableCommand({
                TableName: "test2",
                // For more information about data types,
                // see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes and
                // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html#Programming.LowLevelAPI.DataTypeDescriptors
                AttributeDefinitions: [
                {
                    AttributeName: "DrinkName",
                    AttributeType: "S",
                },
                ],
                KeySchema: [
                {
                    AttributeName: "DrinkName",
                    KeyType: "HASH",
                },
                ],
                ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
                },
            })
            await docClient.send(command).then(result => {
                console.log(result)
                res(result)
            }).catch(error => {console.log(error), rej(error)})
        })
    )
}



module.exports = {
    createUser,
    createTable,
    getUser,
    createID,
    getID,
    editInfoUser,
    verifyKey,
    setNewKey,
    setSubDate,
    generateAlphanumericCode,
    getKey,
    setPat,
    getPat,
    addNewTextSong,
    addDataToObject,
    getTextSongs,
    getAllVideos,
    addVideo,
    getUserVideos,
    saveVideo,
    likeVideo,
    getSavedVideos,
    likeTextSong,
    getSavedSongs,
    deleteSong,
    saveTextSong,
    unLikeSong,
    unSaveSong,
    addIAsong,
    getIASongs,
    unLikeVideo,
    unSaveVideo

}
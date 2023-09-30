const { SingUpEmail1 } = require("./apis/apiAuth");
const { createUser, createTable, getUser, createID, getID, getPat, addNewTextSong, addDataToObject, getTextSongs } = require("./apis/apiDynamoDB");
const { getFiles, test } = require("./apis/apiS3");
const { getRot, createSong, getCompanyStatus } = require("./apis/apiSpotify");

async function test18(){
    const data = {
        user : {
            name: "nicolas"
        },
        email : "lukas@thernloven.com",
        pass: "test12"
    }
    fetch("http://3.129.111.250:4242/api/singup/singUpEmail", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function test19(){
    const data = {
        user : {
            name: "nicolas"
        },
        email : "test1117@gmail.com",
        uid: "123dasasd3"
    }
    fetch("http://3.129.111.250:4242/api/singup/singUpGoogle", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function test20(){
    const data = {
        email : "lukas@thernloven.com",
        pass: "test@123"
    }
    fetch("http://3.129.111.250:4242/api/singin/singInEmail", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function test21(){
    const data = {
        uid: "123dasd3"
    }
    fetch("http://3.129.111.250:4242/api/singin/singInWithId", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function test22(){
    const data = {
        duration: "30",
        text: "a cool song",
        title: "mi super master 1232",
        id: "MjrK0Yx7O2UlkLqU"
    }
    fetch("http://3.129.111.250:4242/api/Spotify/createTextSong", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(data.status)
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function test23(){
    const data = {
        id: "MjrK0Yx7O2UlkLqU"
    }
    fetch("http://localhost:4242/api/Spotify/requestTextSongs", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        const data2 = await data.json()
        console.log(data2.data[0])
    }).catch(error => {
        console.log(error)
    })
}

async function test24(){
    const data = {
        id: "MjrK0Yx7O2UlkLqU",
        key: "1oovbp1z5ExvCf3o"
    }
    fetch("http://3.129.111.250:4242/api/security/verifyDemo", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function testGetAllVideos () {
    fetch("http://localhost:4242/api/tiktok/requestAllVideos", {
        method: "GET",
        headers: {
            "Content-Type" : "application/json"
            },
    }).then(async (data) => {
        const videos = await data.json()
        console.log(videos)
    }).catch(error => {
        console.log(error)
    })
}

async function addVideo () {
    const data = {
        id: "MjrK0Yx7O2UlkLqU",
        link: "outputs/MjrK0Yx7O2UlkLqU/apple.png",
        description: "asd",
        title: "asd",
        postProfile: "asd",
        path: "textSongs/MjrK0Yx7O2UlkLqU/mi master pice223.mp3"
    }
    fetch("http://3.129.111.250:4242/api/tiktok/addVideo", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function likeVideo() {
    const data = {
        id: "4",
        videoID: "qgR60RhjL1eIFaFE",
        ownerID: "MjrK0Yx7O2UlkLqU"
    }
    fetch("http://3.129.111.250:4242/api/tiktok/likevideo", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function saveVideo () {
    const data = {
        id: "RYVVmRs2G4GgoGY4",
        videoID: "qgR60RhjL1eIFaFE",
        ownerID: "MjrK0Yx7O2UlkLqU",
    }
    fetch("http://localhost:4242/api/tiktok/saveVideo", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    }) 
}

async function getSavedVideos () {
    const data = {
        id: "MjrK0Yx7O2UlkLqU",
    }
    fetch("http://3.129.111.250:4242/api/tiktok/requestSavedVideos", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function getLikedSongs () {
    const data = {
        id: "iqag02hi7VRQLwAG",
    }
    fetch("http://localhost:4242/api/Spotify/getAllLikedSongs", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function likeSong () {
    const data = {
        id: "iqag02hi7VRQLwAG",
        ownerID: "m56jBT1HlYaOtpn4",
        link: "https://static-eu.gcp.mubert.com/b2b/recorder/zingzanglab/e17d1c2de3a24affb69004f659295c1a.mp3"
    }
    fetch("http://localhost:4242/api/Spotify/likeSong", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function deleteSong () {
    const data = {
        id: "iqag02hi7VRQLwAG",
        title: "mi master pice3"
    }
    fetch("http://localhost:4242/api/Spotify/deleteSong", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function unlike () {
    const data = {
        id: "123",
        title: "NEw SON",
        ownerID: "iqag02hi7VRQLwAG"
    }
    fetch("http://localhost:4242/api/Spotify/unLikeSong", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function saveSong () {
    const data = {
        id: "123",
        title: "NEw SON",
        ownerID: "iqag02hi7VRQLwAG"
    }
    fetch("http://localhost:4242/api/Spotify/saveSong", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function getAllSavedSongs () {
    const data = {
        id: "123"
    }
    fetch("http://localhost:4242/api/Spotify/getAllSavedSongs", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function unSaveSong () {
    const data = {
        id: "123",
        title: "NEw SON",
        ownerID: "iqag02hi7VRQLwAG"
    }
    fetch("http://localhost:4242/api/Spotify/unSaveSong", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function addIAsong () {
    const data = {
        id: "MjrK0Yx7O2UlkLqU",
        title: "NEw SON",
        albumCover: "asdasd",
        link: "outputs/MjrK0Yx7O2UlkLqU/apple.png"
    }
    fetch("http://localhost:4242/api/IAsongs/addIAsong", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function getAllSongsUser () {
    const data = {
        id: "MjrK0Yx7O2UlkLqU",
    }
    fetch("http://localhost:4242/api/Spotify/getAllSongsUser", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        console.log(await data.json())
    }).catch(error => {
        console.log(error)
    })
}

async function createPat () {
    const data = {
        id: "MjrK0Yx7O2UlkLqU",
    }
    fetch("http://localhost:4242/api/tiktok/requestUserVideos", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        const videos = await data.json();
        console.log(videos.data)
    }).catch(error => {
        console.log(error)
    })
}

async function test50 () {
    const data = {
        path: "outputs/MjrK0Yx7O2UlkLqU/TicTock_videoMjrK0Yx7O2UlkLqU.mp4",
    }
    fetch("http://3.129.111.250:4242/api/security/requestDownloadLink", {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
            },
        body: await JSON.stringify(data),
    }).then(async (data) => {
        const videos = await data.json();
        console.log(videos.data)
    }).catch(error => {
        console.log(error)
    })
}

async function test51 () {

    fetch("http://3.129.111.250:4242/api/tiktok/requestAllVideos", {
        method: "GET",
        headers: {
            "Content-Type" : "application/json"
            },
    }).then(async (data) => {
        const videos = await data.json();
        console.log(videos.data[0].M)
    }).catch(error => {
        console.log(error)
    })
}

//getCompanyStatus()

//saveVideo()
//test23() // request text songs
//test22() //text song
//test50() //request dow link
//test51() // get all videos
//test20(); 
//getAllSongsUser();

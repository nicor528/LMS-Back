const dotenv = require('dotenv');
const { default: fetch } = require('node-fetch');


dotenv.config();

function getCompanyStatus() {
    return(
        new Promise (async (res, rej) => {
            fetch("https://api-b2b.mubert.com/v2/GetCompanyStat", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: await JSON.stringify({
                    method: "GetCompanyStat",
                    params: {
                        license:  process.env.license_spo,
                        token: process.env.token_spo,
                    }
                })
            }).then(async (result) => {
                console.log(result)
                const data = await result.json()
                console.log(data.data)
            })
        })
    )
}

function getRot (email) {
    return (
        new Promise (async (res, rej) => {
            console.log("asdasd")
            fetch('https://api-b2b.mubert.com/v2/GetServiceAccess', {
                method: 'POST', // Cambiar a 'GET' si es necesario
                headers: {
                    'Content-Type': 'application/json',
                },
                body: await JSON.stringify({
                    method: 'GetServiceAccess',
                        params: {
                        email: email, // Reemplaza con tu correo electrónico
                        phone: '+11234567890',   // Reemplaza con tu número de teléfono
                        license: process.env.license_spo,
                        token: process.env.token_spo,
                    },
                }),
            }).then(async (data) => {
                console.log(data)
                const x = await data.json()
                console.log(x.data.pat);
                res(x.data.pat)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function createSong (pat, mode, duration, bitrate, text) {
    return(
        new Promise (async (res, rej) => {
            fetch("https://api-b2b.mubert.com/v2/TTMRecordTrack", {
                method: 'POST', // Cambiar a 'POST' si es necesario
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: await JSON.stringify({
                    method:"TTMRecordTrack",
                    params: {
                        pat: pat,
                        mode: mode,
                        duration: duration,
                        bitrate: bitrate,
                        text: text
                    }
                })
            }).then(async (data) => {
                const x = await data.json()
                console.log(x)
                //console.log(x.data.tasks);
                res(x.data.tasks)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )
}

function getSongStatus (songID) {
    console.log("test1")
    return(
        new Promise (async (res, rej) => {
            console.log("test2")
            let finish = true;
            let allDone = false;
            do{
                console.log("test3")
                await fetch("https://api-b2b.mubert.com/v2/TrackStatus", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                      },
                    body: await JSON.stringify({
                        method: "TrackStatus",
                        params: {
                            pat: songID
                        }
                    })
                }).then(async (result) => {
                    console.log(result)
                    //console.log(await result.json())
                    const data = await result.json()
                    const tasks = data.data.tasks;
                    console.log(tasks)
                    allDone = tasks.every(task => task.task_status_code === 2);
                    //console.log(data.data.tasks)
                    console.log("all done" + allDone)
                    if (allDone) {
                        res();
                        finish = false;
                        return; // Salir de la función
                    }
                    await new Promise(resolve => setTimeout(resolve, 5000)); // Esperar 5 segundos
                }).catch(error => {
                    console.log(error);
                    rej(error)
                })
            }while (finish)
        })
    )
}





module.exports = {
    getRot,
    createSong,
    getSongStatus,
    getCompanyStatus

}
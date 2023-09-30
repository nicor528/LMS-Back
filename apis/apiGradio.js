/*const { client } = require("@gradio/client")




const app = client("https://voicemod-text-to-sing.hf.space/")

function createSongGradio(style, prompt) {
    return (
        new Promise (async (res, rej) => {
            app.predict(1, [
                style, prompt
            ]).then(result => {
                console.log(result)
                result(result)
            }).catch(error => {
                rej(error)
            })
        })
    )
}



module.exports = {
    createSongGradio,

}*/
const dotenv = require('dotenv');
const { default: fetch } = require('node-fetch');
dotenv.config();


// function singleUserNotificationfetch (id) {

//     return (
//         new Promise( (res, rej) => {
//             fetch(`https://cms.pragra.io/api/lms-user-courses/${id}?populate[lms_notification_services][populate]=*`, {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
//                     "Content-Type": 'application/json',
//                 }
//             }).then(async(response)=> {
//                 const data =await response.json()
//                 console.log(data, 222)
//                 res(data)
//             }).catch((err) => {
//                 console.error(err)
//                 rej(err)
//             })
//         })
//     )
// }


function usersNotificationfetch (query) {

    return (
        new Promise( (res, rej) => {
            fetch(`https://cms.pragra.io/api/lms-users?${query}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${process.env.STRAPI_TOKEN}`,
                    "Content-Type": 'application/json',
                },
            }).then(async (result) => {
                //console.log(result)
                const data = await result.json();
                // console.log(data)
                res(data.data)
                // return data;
            }).catch(error => {
                console.log(error)
                rej(error)
                // return error
            })
        })
    )


}

module.exports = { usersNotificationfetch}
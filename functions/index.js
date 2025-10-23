/* eslint-disable no-undef */

const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp() 
const cors = require('cors')({ origin: true })

exports.helloWorldCors = functions.https.onRequest((request, response) => {

    cors(request, response, () => {
        response.send('Hello from Firebase!')
    })
})

/**
 * Cloud Functions: Count the number of documents in a Firestore collection
 * Function: Count the number of documents in a Firestore collection
 * Method: GET
 * URL: https://<your-region>-<your-project-id>.cloudfunctions.net/countItems
 */
exports.countItems = functions.https.onRequest(async (req, res) => {
    cors(req, res, async () => {
        try {
            // Count using Firestore's count() method
            const countSnapshot = await admin.firestore().collection('items').count().get() // 注意：count() 后需调用 get() 触发查询

            const total = countSnapshot.data().count 
            res.status(200).json({ totalItems: total }) 
        } catch (error) {
            console.error('统计失败：', error)
            res.status(500).send('Internal Server Error') 
        }
    })
})

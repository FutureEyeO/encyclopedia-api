const router = require("express").Router()

const Conversation = require("../models/Conversation")
const User = require("../models/User")

const { format } = require("timeago.js")

const bcrypt = require("bcrypt")
const { v4 } = require("uuid");


// create conversation :
router.post("/", async (req, res) => {

    const salt = await bcrypt.genSalt(10)

    const { senderId, receiverId } = req.body
    const conversationDataCheck = [senderId, receiverId]
    const conversationDataCheckLength = conversationDataCheck.length

    try {

        const senderData = await User.findOne({ _id: senderId })
        const receiverData = await User.findOne({ _id: receiverId })

        const conversationUsers = await Promise.all(conversationDataCheck.map(async userId => {
            return await User.find({ _id: userId }, { _id: 1 })
        }))

        const coversationData = { members: [] }

        conversationUsers.map(user => {
            user = user[0]
            if (user && user._id && (user._id == senderId || user._id == receiverId)) {
                coversationData.members.push(String(user._id))
                return user._id
            }
        })



        if (conversationUsers.length != conversationDataCheckLength && coversationData.members != conversationDataCheckLength)
            return res.status(404).send("Somthing Error")


        const conversationFinds = await Conversation.find({
            members: { $in: [senderId] }
        })



        conversationFinds.forEach(conversation => {
            if (conversation.members.includes(senderId) && conversation.members.includes(receiverId))
                return res.status(400).send("this conversation is already exisit")
        })

        // const conversationPassword = await bcrypt.hash(
        //     String(
        //         (String(senderData._id).charCodeAt() * (new Date(senderData.createdAt).getTime()))
        //         +
        //         (String(receiverData._id).charCodeAt() * (new Date(receiverData.createdAt).getTime()))
        //     )
        //     , salt)

        // console.log(conversationPassword)

        // coversationData.password = conversationPassword

        
        const newConversation = new Conversation(coversationData)
        const saveConversation = await newConversation.save()

        res.status(200).json(saveConversation)
    } catch (err) {
        res.status(500).json(err)
    }
})

// get all conversation :
router.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params
        console.log(userId)

        const currentUser = await User.findOne({ _id: userId })

        if (!currentUser && !currentUser._id)
            return res.status(404).send("User is undefined !")
            

        const conversation = await Conversation.find({
            members: { $in: [userId] }
        })
        console.log(conversation)
        res.status(200).json(conversation)

    } catch (err) {
        res.status(500).json(err)
    }

})


// get conversation
router.get("/:currentUser/:secondUser", async (req, res) => {
    try {
        // const { conversationId } = req.params
        const { currentUser, secondUser } = req.params

        console.log(currentUser, secondUser)
        Array(currentUser, secondUser).forEach(async userId => {
            console.log(userId)
            const user = await User.findOne({ _id: userId })

            if (!user && !user._id)
                return res.status(404).send("User is undefined !")
        })


        const conversation = await Conversation.findOne({
            members: [currentUser, secondUser]
        })

        console.log(conversation)
        res.status(200).json(conversation)

    } catch (err) {
        res.status(500).json(err)
    }

})



router.post("/conv/:conversationId", async (req, res) => {
    try {
        const { conversationId } = req.params
        const { currentUser } = req.body

        Array(currentUser).forEach(async userId => {
            console.log(userId)
            const user = await User.findOne({ _id: userId })

            if (!user && !user._id)
                return res.status(404).send("User is undefined !")
        })


        const conversation = await Conversation.findOne({
            _id: conversationId,
            members: { $in: [String(currentUser)] }
        })

        console.log(conversation)
        res.status(200).json(conversation)

    } catch (err) {
        res.status(500).json(err)
    }

})




module.exports = router

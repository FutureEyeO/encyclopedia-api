const router = require("express").Router()


const Message = require("../models/Message")
const Conversation = require("../models/Conversation")
const User = require("../models/User")


// cteate message :
router.post("/", async (req, res) => {
    try {
        const { conversationId, senderId, text } = req.body
        if (text && text.length > 0) {
            const conversation = await Conversation.findOne({ _id: conversationId })
    
            // const receiver = conversation.members.filter(userId => userId != senderId)[0]
            // console.log(receiver)
    
            if (conversation && conversation._id && conversation.members.includes(senderId)) {
    
                const newMessage = new Message(req.body)
                const message = await newMessage.save()
    
                res.status(200).json(message)
            }
        } else {
            res.status(400).send("bad request")
        }

    } catch (err) {
        res.status(500).json(err)
    }
})

// get all message :
router.post("/:conversationId", async (req, res) => {
    try {

        const { conversationId } = req.params
        const { currentUser, secondUser } = req.body
        console.log(conversationId)

        console.log(currentUser, secondUser)
        // Array(currentUser, secondUser).forEach(async userId => {
        //     console.log(userId)
        //     const user = await User.findOne({ _id: userId })

        //     if (!user && !user._id)
        //         return res.status(404).send("User is undefined !")
        // })


        const messages = await Message.find({ conversationId: conversationId })

        console.log(messages)
        res.status(200).json(messages)

    } catch (err) {
        res.status(500).json(err)
    }
})



module.exports = router

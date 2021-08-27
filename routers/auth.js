const router = require("express").Router()
const bcrypt = require("bcrypt")
const { v4 } = require("uuid");

const User = require("../models/User")
const Login = require("../models/Login")

const Api = require("../functions/Api")

function getImp(obj) {
    const { _id, __v, updatedAt, createdAt, ...others } = obj
    return others
}

const returnUserData = async (data) => {
    try {
        if (data) {
            const { password, login_password, updatedAt, __v, ...userData } = data
            return { ...userData, ...await Api.checkVC(userData._id) }
        } else
            return {}

    } catch (err) {
        return {}
    }
}


// Register :
router.post("/register", async (req, res) => {
    try {
        // generate a hash password :
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)

        req.body["password"] = hashedPassword
        // create new user : 
        const { ip } = req.body

        if (ip) {
            const newUser = new User(req.body)
    
            // save user and return response :
            const user = await newUser.save()
            let userData = await returnUserData(user._doc)
            res.status(200).json(userData)
        } else {
            res.status(400).send("vaild input")
        }
    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }
})


router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user && !user._id) return res.status(404).send("user not found")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) return res.status(400).send("worng password")

        let userData = await returnUserData(user._doc)
        return res.status(200).json(userData)
    } catch (err) {
        console.error(err)
        return res.status(500).json(err)
    }

})


router.post("/save_login", async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email: email })
        if (!user && !user._id) return res.status(404).send("user not found")

        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(400).send("worng password")


        const createLogin = async () => {

            const salt = await bcrypt.genSalt(10)

            const impUser = await returnUserData(user._doc)

            console.log(impUser)
            let loginPassword = await bcrypt.hash(user._id + user.createdAt, salt)

            let loginData = {
                user_agent: req.get('user-agent'),
                user_id: user._id,
                login_time: new Date().getTime(),
                login_id: v4(),
                login_password: loginPassword
            }

            loginData = { ...loginData, ...impUser }
            console.log(loginData)
            const newLogin = new Login(loginData)

            // save user and return response :
            const login = await newLogin.save()

            const impLogin = await returnUserData(login._doc)

            console.log(impLogin)

            res.status(200).json(impLogin)
        }



        const loginCheck = await Login.findOne({ user_id: user._id })

        if (loginCheck && loginCheck._id) {

            let loginPassword = user._id + user.createdAt

            const validPassword = await bcrypt.compare(loginPassword, loginCheck.login_password)
            console.log(validPassword)
            if (!validPassword) res.status(400).send("worng password")

            let loginTimeHours = (Date.now() - loginCheck.login_time) / 3600000

            if (loginTimeHours > 44) {

                await loginCheck.deleteOne()
                await createLogin()

            } else {


                const impUser = await returnUserData(user._doc)

                let loginData = {
                    user_agent: req.get('user-agent'),
                    login_time: new Date().getTime(),
                    login_id: v4(),
                }

                loginData = { ...loginData, ...impUser }

                await loginCheck.updateOne(loginData)

                const loginUpdate = await Login.findOne({ _id: loginCheck._id })

                const impLogin = await returnUserData(loginUpdate._doc)

                console.log(impLogin)

                return res.status(200).json(impLogin)

            }


        } else {

            await createLogin()

        }
    } catch (err) {
        console.error(err)
        return res.status(500).json(err)
    }

})



router.put("/update_login", async (req, res) => {
    try {
        const { loginId, userId } = req.body
        const user_agent = req.get("user-agent")

        const user = await User.findOne({ _id: userId })
        if (!user && !user._id) return res.status(404).send("user not found")

        const login = await Login.findOne({ login_id: loginId })

        if (login && login._id && user_agent == login.user_agent) {

            let loginPassword = user._id + user.createdAt

            const validPassword = await bcrypt.compare(loginPassword, login.login_password)
            console.log(validPassword)
            if (!validPassword) return res.status(400).send("worng password")

            const impUser = await returnUserData(login._doc)

            await login.updateOne(impUser)

            const loginUpdate = await Login.findOne({ _id: login._id })

            const impLogin = await returnUserData(loginUpdate._doc)

            console.log(impLogin)

            return res.status(200).json(impLogin)
        }

    } catch (err) {
        console.error(err)
        res.status(500).json(err)
    }

})



router.delete("/delete_login", async (req, res) => {
    //
    try {
        const { loginId, userId } = req.query

        const user = await User.findOne({ _id: userId }, { _id: 1, createdAt: 1 })
        if (!user && !user._id) return res.status(404).send("user not found")

        const user_agent = req.get('user-agent')

        if (user && user._id) {

            const login = await Login.findOne({ login_id: loginId })
            if (!login && !login._id) return res.status(404).send("login not found")

            if (user_agent == login.user_agent) {

                let loginPassword = user._id + user.createdAt

                const validPassword = await bcrypt.compare(loginPassword, login.login_password)
                console.log(validPassword)
                if (!validPassword) return res.status(400).send("worng password")

                await login.deleteOne()
                return res.status(200).json("Login has deleted successfully")

            } else {
                return res.status(400).json("The login data is invalid")
            }
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json(err)
    }

})

router.post("/auto_login", async (req, res) => {
    //
    try {
        const { loginId, userId } = req.body

        const user = await User.findOne({ _id: userId }, { _id: 1, createdAt: 1 })
        if (!user && !user._id) return res.status(404).send("user not found")

        const user_agent = req.get('user-agent')

        if (user && user._id) {

            const login = await Login.findOne({ login_id: loginId })
            if (!login) return res.status(404).send("login not found")


            if (user_agent == login.user_agent) {

                let loginPassword = user._id + user.createdAt

                const validPassword = await bcrypt.compare(loginPassword, login.login_password)
                if (!validPassword) return res.status(400).send("worng password")

                let loginTimeHours = (Date.now() - login.login_time) / 3600000

                if (loginTimeHours > 44) {

                    login.deleteOne()
                    res.status(404).json("The login data is invalid")

                } else {

                    const impLogin = await returnUserData(login._doc)

                    return res.status(200).json(impLogin)

                }
            } else {
                return res.status(404).json("The login data is invalid")
            }
        }
    } catch (err) {
        console.error(err)
        return res.status(500).json(err)
    }

})


module.exports = router

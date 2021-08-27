const axios = require("axios").default
const uuid = require("uuid")

const constants = require("../constant/general")

const checkAdmin = async (_id) => {
    try {
        const admin = await axios.get(`${constants.proxy}/admin/${_id}`)
        if (admin.data == null)
            return false

        if (admin.data.userId == _id) {
            return true
        } else {
            return false
        }
    } catch (err) {
        return false
    }
}


const checkAuthor = async (_id) => {
    const author = await axios.get(`${constants.proxy}/author/${_id}`)
    if (author.data == null)
        return false

    if (author.data.userId == _id) {
        return true
    } else {
        return false
    }
}

const checkVC = async (_id) => {
    return {
        isAdmin: await checkAdmin(_id),
        isAuthor: await checkAuthor(_id)
    }
}

module.exports = {
    checkAdmin,
    checkAuthor,
    checkVC,
}
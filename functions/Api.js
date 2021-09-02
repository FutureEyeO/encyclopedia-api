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
    console.log(await checkAdmin(_id))
    return {
        isAdmin: await checkAdmin(_id),
        isAuthor: await checkAuthor(_id)
    }
}

// {
//     '$__': InternalCache {
//       strictMode: true,
//       selected: { _id: 1 },
//       shardval: undefined,
//       saveError: undefined,
//       validationError: undefined,
//       adhocPaths: undefined,
//       removing: undefined,
//       inserting: undefined,
//       saving: undefined,
//       version: undefined,
//       getters: {},
//       _id: 612725c8c683703f14888ddf,
//       populate: undefined,
//       populated: undefined,
//       wasPopulated: false,
//       scope: undefined,
//       activePaths: StateMachine {
//         paths: [Object],
//         states: [Object],
//         stateNames: [Array]
//       },
//       pathsToScopes: {},
//       cachedRequired: {},
//       session: null,
//       '$setCalled': Set(0) {},
//       ownerDocument: undefined,
//       fullPath: undefined,
//       emitter: EventEmitter {
//         _events: [Object: null prototype] {},
//         _eventsCount: 0,
//         _maxListeners: 0,
//         [Symbol(kCapture)]: false
//       },
//       '$options': { skipId: true, isNew: false, willInit: true, defaults: true }
//     },
//     isNew: false,
//     errors: undefined,
//     '$locals': {},
//     '$op': null,
//     _doc: { _id: 612725c8c683703f14888ddf },
//     '$init': true
//   }

const returnUserData = async (data) => {
    try {
        if (data) {
            const { password, updatedAt, __v, ...userData } = data
            
            const vc = await checkVC(userData._id)
            return { ...userData, ...vc }

        } else
            return {}

    } catch (err) {
        return {}
    }
}

module.exports = {
    checkAdmin,
    checkAuthor,
    checkVC,
    returnUserData
}
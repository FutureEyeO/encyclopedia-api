const router = require("express").Router()

const Visits = require("../models/Visits")

router.post("/", async (req, res) => {
    try {

        const { ip, userId, url } = req.body

        console.log(req.body)

        let findVisitByIp = await Visits.findOne({ ip, url })
        let findVisitById = await Visits.findOne({ userId, url })


        if (!findVisitByIp)
        findVisitByIp = {}

        if (!findVisitById)
        findVisitById = {}

        if (findVisitByIp._id || findVisitById._id) {
            let findVisit = Object()

            if (findVisitByIp._id)
            findVisit = findVisitByIp
            if (findVisitById._id)
            findVisit = findVisitById

            req.body.visitCount = findVisit.visitCount + 1

            findVisit.timeTaken > req.body.timeTaken ? req.body.timeTaken = findVisit.timeTaken : null

            const updatedVisit = await findVisit.updateOne(req.body)
            res.status(200).json(updatedVisit)
        } else {
            const newVisit = new Visits(req.body)
            const visit = await newVisit.save()
            res.status(200).json(visit)
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get("/visit_count", async (req, res) => {
    try {
        const { url } = req.query
        let visitCount = 0
        const visits = await Visits.find({ url })
        visits.forEach(visit => {
            visitCount += visit.visitCount
        })
        res.status(200).json(visitCount)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
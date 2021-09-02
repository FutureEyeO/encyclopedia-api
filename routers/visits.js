const router = require("express").Router()

const { Visits, VisitsLog } = require("../models/Visits")

router.post("/", async (req, res) => {
    try {

        const { ip, userId, url } = req.body

        let findVisitByIp = await Visits.findOne({ ip, url })
        let findVisitById = await Visits.findOne({ userId, url })


        if (!findVisitByIp)
            findVisitByIp = { }

        if (!findVisitById)
            findVisitById = { }

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


// visits log 


router.post("/log", async (req, res) => {
    try {

        const { visitors, url, date } = req.body

        let findVisitLog = await VisitsLog.findOne({ url, date })

        if (!findVisitLog)
            findVisitLog = { }

        console.log(findVisitLog)
        if (findVisitLog._id) {
            req.body.visitors = { ...findVisitLog.visitors, ...visitors }

            const updatedVisitsLog = await findVisitLog.updateOne(req.body)
            res.status(200).json(updatedVisitsLog)

        } else {
            // {
            //     _id: 612f37a4c89836362844272c,
            //     url: '/p/6129e7d95f4feb09b0e87684',
            //     date: '3-8-2021',
            //     visitors: {
            //       '37,40,110,95': { userId: '612725c8c683703f14888ddf', timeTaken: 4 }
            //     }
            //   }
            console.log(req.body)
            const newVisitsLog = new VisitsLog(req.body)
            console.log(newVisitsLog)
            const visitsLog = await newVisitsLog.save()
            console.log(visitsLog)
            res.status(200).json(visitsLog)
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
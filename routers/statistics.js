const router = require("express").Router()

const Statistic = require("../models/Statistic")

router.post("/", async (req, res) => {
    try {

        const { ip, userId, url } = req.body

        console.log(req.body)

        let findStatisticByIp = await Statistic.findOne({ ip, url })
        let findStatisticById = await Statistic.findOne({ userId, url })


        if (!findStatisticByIp)
            findStatisticByIp = {}

        if (!findStatisticById)
            findStatisticById = {}

        console.log(findStatisticById)

        if (findStatisticByIp._id || findStatisticById._id) {
            let findStatistic = Object()

            if (findStatisticByIp._id)
                findStatistic = findStatisticByIp
            if (findStatisticById._id)
                findStatistic = findStatisticById

            req.body.visitCount = findStatistic.visitCount + 1

            findStatistic.timeTaken > req.body.timeTaken ? req.body.timeTaken = findStatistic.timeTaken : null

            const updatedStatistic = await findStatistic.updateOne(req.body)
            res.status(200).json(updatedStatistic)
        } else {
            const newStatistic = new Statistic(req.body)
            const statistic = await newStatistic.save()
            res.status(200).json(statistic)
        }
    } catch (err) {
        res.status(500).json(err)
    }
})

router.get("/visit_count", async (req, res) => {
    try {
        const { url } = req.query
        let visitCount = 0
        const statistics = await Statistic.find({ url })
        statistics.forEach(statistic => {
            visitCount += statistic.visitCount
        })
        res.status(200).json(visitCount)
    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
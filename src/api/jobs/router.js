const { Router } = require('express');
const {payJob, getUnpaidUserJobs} = require("../../services/job");
const asyncHandler = require("express-async-handler");

const jobsRouter = new Router();

jobsRouter.get('/unpaid', asyncHandler(async (req, res) =>{
    const unpaidJobs = await getUnpaidUserJobs(req.profile.id);
    res.json(unpaidJobs)
}))

jobsRouter.post('/:job_id/pay', asyncHandler(async (req, res) =>{
    const {job_id} = req.params
    const job = await payJob(job_id, req.profile.id);
    res.json(job)
}))

module.exports = jobsRouter;
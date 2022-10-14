const { Router } = require('express');
const { getProfile } = require("../middleware/getProfile");
const contractsRouter = require("./contracts/router");
const jobsRouter = require("./jobs/router");

const router = new Router();

router.use(getProfile);
router.use('/contracts', contractsRouter);
router.use('/jobs', jobsRouter);

module.exports = router;
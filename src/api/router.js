const { Router } = require('express');
const { getProfile } = require("../middleware/getProfile");
const contractsRouter = require("./contracts/router");
const jobsRouter = require("./jobs/router");
const balancesRouter = require("./balances/router");
const adminRouter = require("./admin/router");

const router = new Router();

router.use(getProfile);
router.use('/contracts', contractsRouter);
router.use('/jobs', jobsRouter);
router.use('/balances', balancesRouter);
router.use('/admin', adminRouter);

module.exports = router;
import { Router } from "express";

import { healthcheck } from "../controllers/health.controller";

const router = Router();

router.route('/').get(healthcheck);

export default router;
import {Router} from "express";
import {getStats} from "../controller/statController.js";
import {protectedRoute, requireAdmin} from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", protectedRoute, requireAdmin, getStats)

export default router;
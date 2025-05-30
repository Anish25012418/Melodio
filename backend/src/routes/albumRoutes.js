import {Router} from "express";
import {getAlbumById, getAllAlbums} from "../controller/albumController.js";

const router = Router();

router.get("/", getAllAlbums)
router.get("/:id", getAlbumById)

export default router;
import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { upload } from "../config/multer";
import { getMe, searchUsers, updateProfile } from "./user.controller";

const router = Router();

router.get("/me", authenticate, getMe);

router.get("/search", authenticate, searchUsers);


router.put(
  "/profile",
  authenticate,
  upload.single("avatar"),
  updateProfile
);

export default router;

import express from "express";
const router = express.Router();
import { register, login, updateUser } from "../controller/authcontroller.js";
// import { DeleteJob } from "../controller/jobsController.js";
import authenticateUser from "../middleware/auth.js";
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/updateUser").patch(authenticateUser, updateUser);
router
  .route("/:id")
  // .delete(DeleteJob)
  .patch(updateUser);
export default router;

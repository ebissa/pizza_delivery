import express from "express";
const router = express.Router();
import {
  createJob,
  updateJob,
  getAllJobs,
  showStats,
  DeleteJob,
} from "../controller/jobsController.js";
import { get } from "mongoose";
router.route("/").get(getAllJobs).post(createJob);
router.route("/stats").get(showStats);
router.route("/:id").delete(DeleteJob).patch(updateJob);
export default router;

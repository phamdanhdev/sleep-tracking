import express from "express";
import auth from "../middleware/auth.js";
import {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
} from "../controllers/entries.js";

const router = express.Router();

router.get("/", auth, getEntries);
router.post("/", auth, createEntry);
router.patch("/:id", auth, updateEntry);
router.delete("/:id", deleteEntry);

export default router;

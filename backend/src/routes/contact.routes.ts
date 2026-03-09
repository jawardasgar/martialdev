import { Router } from "express";
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
} from "../controllers/contact.controller";
import { validateContact } from "../middleware/validation.middleware";

const router = Router();

// Public routes
router.post("/", validateContact, createContact);

// Admin routes (TODO: add authentication middleware)
router.get("/", getAllContacts);
router.get("/:id", getContactById);
router.patch("/:id/status", updateContactStatus);
router.delete("/:id", deleteContact);

export default router;

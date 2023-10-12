const express = require("express");
const router = express.Router();

const ctrl = require("../../controllers/contacts");

const authenticate = require("../../middlewares/authentificate");

router.get("/", authenticate, ctrl.getAll);
router.get("/:contactId", authenticate, ctrl.getById);
router.post("/", authenticate, ctrl.add);
router.delete("/:contactId", authenticate, ctrl.remove);
router.put("/:contactId", authenticate, ctrl.update);
router.patch("/:contactId/favorite", authenticate, ctrl.updateStatus);

module.exports = router;

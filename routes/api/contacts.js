const express = require("express");
const {
  getContactsList,
  getContactById,
  createContact,
  deleteContactById,
  updateContactById,
} = require("../../controllers/contacts");
const {
  checkId,
  checkData,
  validateData,
} = require("../../middlewares/contacts");

const router = express.Router();

router
  .route("/")
  .get(getContactsList)
  .post(checkData, validateData, createContact);

router.use("/:id", checkId);
router
  .route("/:id")
  .get(getContactById)
  .put(checkData, validateData, updateContactById)
  .delete(deleteContactById);

module.exports = router;

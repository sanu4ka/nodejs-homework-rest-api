const express = require("express");
const {
  getContactsList,
  getContactById,
  createContact,
  deleteContactById,
  updateContactById,
  updateStatusContact,
} = require("../../controllers/contacts");
const {
  checkId,
  checkData,
  validateData,
  checkFavoriteData,
} = require("../../middlewares/contacts");
const auth = require("../../middlewares/authorization");

const router = express.Router();

router.use("/", auth);
router
  .route("/")
  .get(getContactsList)
  .post(checkData, validateData, createContact);

router.use("/:id", auth, checkId);
router
  .route("/:id")
  .get(getContactById)
  .put(checkData, validateData, updateContactById)
  .delete(deleteContactById);
router
  .route("/:contactId/favorite")
  .patch(checkFavoriteData, updateStatusContact);

module.exports = router;

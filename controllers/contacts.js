const { nanoid } = require("nanoid");

const {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
} = require("../models/contacts");

const getContactsList = async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    const newUser = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    await addContact(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: "Missing required field" });
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await getById(id);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const updateContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await updateContact(id, req.body);
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const deleteContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await removeContact(id);
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getContactsList,
  createContact,
  getContactById,
  updateContactById,
  deleteContactById,
};

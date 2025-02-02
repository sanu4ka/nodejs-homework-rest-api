const Contact = require("../models/contactModel");

const getContactsList = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const contacts = await Contact.find({ owner });
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

const createContact = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const newContact = await Contact.create({ ...req.body, owner });
    res.status(201).json({ contact: newContact });
  } catch (error) {
    res.status(400).json({ message: "Missing required field" });
  }
};

const getContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findOne({ _id: id });
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

const updateContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Contact.findOneAndUpdate({ _id: id }, req.body);
    res.status(200).json(await Contact.findOne({ _id: id }));
  } catch (error) {
    next(error);
  }
};

const deleteContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Contact.findOneAndDelete({ _id: id });
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
};

const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    await Contact.findByIdAndUpdate({ _id: contactId }, req.body);

    res.status(200).json(await Contact.findOne({ _id: contactId }));
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
  updateStatusContact,
};

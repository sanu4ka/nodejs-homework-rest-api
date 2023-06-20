const fs = require("fs/promises");

const listContacts = async () => {
  return JSON.parse(await fs.readFile("./models/contacts.json"));
};

const getById = async (contactId) => {
  const contacts = await listContacts();
  const contact = contacts.find((item) => item.id === contactId);
  return contact;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const updatedContacts = contacts.filter((item) => item.id !== contactId);
  await fs.writeFile("./models/contacts.json", JSON.stringify(updatedContacts));
};

const addContact = async (body) => {
  const contacts = await listContacts();
  contacts.push(body);
  await fs.writeFile("./models/contacts.json", JSON.stringify(contacts));
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((item) => item.id === contactId);
  const { name, email, phone } = body;
  const id = contactId;
  contacts[contactIndex] = { id, name, email, phone };
  await fs.writeFile("./models/contacts.json", JSON.stringify(contacts));
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};

const fs = require("fs").promises;
const path = require("node:path");

const contactsPath = path.join(__dirname, "../db/contacts.json");

path.dirname("contacts.json");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.filter((elem) => elem.id === contactId);
  console.log(`result - `, result);
  return result;
};

const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex((elem) => elem.id === contactId);
  if (contactIndex === -1) {
    return [];
  } else {
    const removedContact = contacts.splice(contactIndex, 1);
    console.log(`contacts is - `, contacts);
    console.log(`removedContact is - `, removedContact);
    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return removedContact;
  }
};

const addContact = async (body) => {
  const contacts = await listContacts();
  const { id, name, email, phone } = body;
  console.log(body);

  const newContact = {
    id,
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();

  const contactIndex = contacts.findIndex((elem) => elem.id === contactId);
  if (contactIndex === -1) {
    return [];
  } else {
    contacts[contactIndex] = { ...contacts[contactIndex], ...body };
    fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[contactIndex];
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

const Contact = require("../models/contact");

const findContact = async (body) => {
  const data = await Contact.findOne(body);
  return data;
};

const listContacts = async (owner, params, skip, limit) => {
  const data = await Contact.find({ owner, ...params }, {}, { skip, limit });
  return data;
};

const getContactById = async (contactId) => {
  const data = await Contact.findOne({ _id: contactId });
  return data;
};

const removeContact = async (contactId) => {
  const data = await Contact.findByIdAndDelete(contactId);
  return data;
};

const addContact = async (body) => {
  const data = await Contact.create({
    name: body.name,
    email: body.email,
    phone: body.phone,
    favorite: body.favorite,
    owner: body.owner,
  });
  return data;
};

const updateContact = async (contactId, body) => {
  const data = await Contact.findByIdAndUpdate(contactId, body, { new: true });
  return data;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  findContact,
};

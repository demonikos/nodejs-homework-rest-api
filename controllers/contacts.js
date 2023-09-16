const { nanoid } = require("nanoid");
const Joi = require("joi");

const contactsActions = require("../utils/utils");
const HttpError = require("../helpers/HttpError");

const PostSchema = Joi.object({
  name: Joi.string().min(6).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .required(),
  favorite: Joi.boolean(),
});

const PutSchema = Joi.object({
  name: Joi.string().min(6).max(30),
  email: Joi.string().email(),
  phone: Joi.string().pattern(
    /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
  ),
  favorite: Joi.boolean(),
});

const getAll = async (req, res, next) => {
  try {
    const getAll = await contactsActions.listContacts();
    res.json({
      status: "success",
      code: 200,
      data: {
        getAll,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const getById = await contactsActions.getContactById(id);
    if (JSON.stringify(getById) === "[]") {
      throw HttpError(404, "Not found");
    } else {
      res.json({
        status: "success",
        code: 200,
        data: {
          getById,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const add = async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;

    const { error } = PostSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    if (!name || !email || !phone) {
      throw HttpError(400, "missing required name field");
    } else {
      const contact = {
        id: nanoid(),
        name: name,
        email: email,
        phone: phone,
        favorite: favorite,
      };

      const add = await contactsActions.addContact(contact);

      res.json({
        status: "created",
        code: 201,
        data: {
          add,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const id = req.params.contactId;
    const remove = await contactsActions.removeContact(id);
    if (remove === null) {
      throw HttpError(404, "Not found");
    } else {
      res.json({
        status: "contact deleted",
        code: 200,
        data: {
          remove,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.params.contactId;

    const { error } = PutSchema.validate(req.body);
    if (error) {
      throw HttpError(400, error.message);
    }

    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "missing required name field");
    } else {
      const update = await contactsActions.updateContact(id, req.body);
      if (JSON.stringify(update) === "[]") {
        throw HttpError(404, "Not found");
      } else {
        res.json({
          status: "success",
          code: 200,
          data: {
            update,
          },
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

const updateStatus = async (req, res, next) => {
  try {
    const id = req.params.contactId;

    if (Object.keys(req.body).length === 0) {
      throw HttpError(400, "missing required fields");
    } else if (
      Object.keys(req.body).length > 1 &&
      Object.keys(req.body).filter((elem) => elem !== "favorite")
    ) {
      throw HttpError(400, "missing field favorite");
    } else {
      const update = await contactsActions.updateContact(id, req.body);
      if (JSON.stringify(update) === "[]") {
        throw HttpError(404, "Not found");
      } else {
        res.json({
          status: "success",
          code: 200,
          data: {
            update,
          },
        });
      }
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  add,
  remove,
  update,
  updateStatus,
};
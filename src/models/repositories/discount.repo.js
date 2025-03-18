const { unGetSelectData, getSelectData } = require("../../utils");

const findDiscountsCodeUnselect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  unSelect,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };

  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(unGetSelectData(unSelect))
    .lean()
    .exec();

  return documents;
};

const findDiscountsCodeSelect = async ({
  limit = 50,
  page = 1,
  sort = "ctime",
  filter,
  select,
  model,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { createdAt: -1 } : { updatedAt: -1 };

  const documents = await model
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean()
    .exec();

  return documents;
};

const checkAccountExists = async ({ model, filter, lean = true }) => {
  return model.findOne(filter).lean(lean).exec();
};

module.exports = {
  findDiscountsCodeUnselect,
  findDiscountsCodeSelect,
  checkAccountExists,
};

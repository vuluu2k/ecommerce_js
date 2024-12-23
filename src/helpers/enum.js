const RoleShop = Object.freeze({
  SHOP: "00000",
  WRITER: "00001",
  EDITOR: "00002",
  ADMIN: "00003",
});

const StatusCode = Object.freeze({
  FORBIDDEN: 403,
  CONFLICT: 409,
  BAD_REQUEST: 400,
});

const ReasonStatusCode = Object.freeze({
  FORBIDDEN: "Forbidden error",
  CONFLICT: "Conflict error",
  BAD_REQUEST: "Bad request",
});

module.exports = { RoleShop, StatusCode, ReasonStatusCode };

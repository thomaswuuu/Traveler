const { User, UserAttraction } = require("../models/userModel");

const init = async (req, res) => {
  const user = req.user;
  return res.render("profile", { user });
};

module.exports = { init };

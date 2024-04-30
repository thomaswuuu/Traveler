const { User, UserAttraction } = require("../models/userModel");

const init = async (req, res) => {
  await User.sync();
  res.json({ message: "ok" });
};

module.exports = { init };

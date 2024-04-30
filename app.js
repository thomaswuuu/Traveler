const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
require("./config/passport");
const passport = require("passport");
const flash = require("connect-flash");
const indexRoutes = require("./routes/index");
const apiRoutes = require("./routes/api");
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  session({
    secret: "My cat",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 },
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// Router setting
app.use("/", indexRoutes);
app.use("/api", apiRoutes);
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const flash = require("connect-flash");
const indexRoutes = require("./routes/index");
const apiRoutes = require("./routes/api");

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

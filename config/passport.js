const passport = require("passport");
const LocalStrategy = require("passport-local");
const GoogleStrategy = require("passport-google-oauth20");
const bcrypt = require("bcrypt");
const { User } = require("../models/userModel");
const HOST = process.env.HOST;

passport.serializeUser((user, done) => {
  // console.log("Serialize user...", user);
  done(null, user.userId);
});

passport.deserializeUser(async (userId, done) => {
  // console.log("Deserialize user...", userId);
  let foundUser = await User.findOne({ where: { userId } });
  done(null, foundUser); //將req.user這個屬性設定為foundUser
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${HOST}/auth/google/redirect`,
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("進入Google Stratagy的區域");
      console.log("========================");
      // Make sure user table is created
      await User.sync();
      let foundUser = await User.findOne({
        where: { profileID: profile.id },
      });
      if (foundUser) {
        console.log("使用者已經註冊過了，無須存入資料庫內。");
        done(null, foundUser);
      } else {
        console.log("偵測到新用戶，須將存入資料庫內");
        let newUser = new User({
          username: profile.displayName,
          profileID: profile.id,
          thumbnail: profile.photos[0].value,
          email: profile.emails[0].value,
        });
        let savedUser = await newUser.save();
        console.log("成功創建新用戶");
        done(null, savedUser);
      }
    }
  )
);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    let foundUser = await User.findOne({ where: { email: username } });
    if (foundUser) {
      let result = await bcrypt.compare(password, foundUser.password);
      if (result) {
        done(null, foundUser);
      } else {
        done(null, false);
      }
    } else {
      done(null, false);
    }
  })
);

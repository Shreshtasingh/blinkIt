const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { userModel } = require("../models/user");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Replace with your Google Client ID
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Replace with your Google Client Secret
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
      let user = await userModel.findOne({ email: profile.emails[0].value });
      if (!user) {
        user = new userModel({
          name: profile.displayName,
          email: profile.emails[0].value,
        });
        await user.save();
      }
      cb(null, user);
    } catch (err) {
      cb(err, false);
    }
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user._id);
});

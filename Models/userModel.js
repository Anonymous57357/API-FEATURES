const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your name."],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  photo: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [8, "password length must be atleast 8 charcters"],
    maxlength: [30, "password length must not exceed more than 30 charcters"],
    select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "Password and Confirm Password does not match.",
    },
  },

  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

// mongoose middleware pre
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next;
  // encrypt the password before saving it
  this.password = await bcrypt.hash(this.password, 12);
  // not saving the confirmPassword
  this.confirmPassword = undefined;
  next();
});

// comparing the encrypted password
UserSchema.methods.comparePasswordInDb = async function (pswd, pswdDB) {
  return await bcrypt.compare(pswd, pswdDB);
};

UserSchema.methods.isPasswordChanged = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const pswdChangedTimestamps = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(this.passwordChangedAt, JWTTimestamp); // JWT to iat
    console.log(pswdChangedTimestamps); // data to timstamps
    return JWTTimestamp < pswdChangedTimestamps; // 1717286400 < 1717353631
  }
  return false;
};

UserSchema.methods.createResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex"); // plain token
  // SAVING THE RANDOM GENERATED TOKEN TO THE PASSWORDRESETTOKEN FIELD
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // STORING THE VALUE OF 10 MINUTES IN RESETTOKENEXPIRES FIELD
  this.passwordResetTokenExpires = Date.now() * 10 * 60 * 1000; // encrypted token

  console.log(resetToken, this.passwordResetToken);

  return resetToken;
};

// document middleware // targeting the document
UserSchema.pre("save", function (next) {
  // console.log(this);
  this.createdBy = "Mukesh";
  next();
});

// Post-save Middleware
UserSchema.post("save", function (doc, next) {
  console.log("A new user was created", doc);
  next();
});

// pre-remove Middleware
UserSchema.pre("remove", function (next) {
  console.log("A user is about to be romoved");
  next();
});

// post-remove Middleware
UserSchema.post("remove", function (doc, next) {
  console.log("User has been removed", doc);

  next();
});

const User = mongoose.model("User", UserSchema);
module.exports = User;

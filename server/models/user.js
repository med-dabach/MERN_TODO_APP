const mongoose = require("../db"),
  bcrypt = require("bcrypt"),
  userSchema = mongoose.Schema({
    userName: {
      type: String,
      required: [true, "userName required"],
      unique: [true, "this name already exists"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      validation: {
        validator: function (email) {
          // regex
          if (!email.match(/^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/)) {
            throw new Error("email is invalid");
          } else {
            return email;
          }
        },
        message: (props) => `${props.value} is not a valid email`,
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    passwordReset: {
      token: {
        type: String,
      },
      expires: {
        type: Date,
      },
    },

    loginAttempts: {
      trys: {
        type: Number,
        default: 0,
        max: process.env.MAX_FAILED_LOGIN_ATTEMPTS,
      },
      isBlocked: {
        type: Boolean,
        default: false,
      },
      blockTime: {
        type: Number,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  const salt = await bcrypt.genSalt(13);
  const hashpassword = await bcrypt.hash(user.password, salt);
  this.password = hashpassword;
  next();
});

userSchema.pre(/^find/, async function (next) {
  const update = this.getUpdate();
  if (update?.password) {
    const salt = await bcrypt.genSalt(13);
    const hashpassword = await bcrypt.hash(update.password, salt);
    this.getUpdate().password = hashpassword;
  }
  next();
});

// deselect fields
userSchema.pre(/^find/, function () {
  this.select("-__v");
});

module.exports = mongoose.model("user", userSchema);

const User = require("../models/user");
const { catchAsync } = require("./errorController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mongoose = require("../db");
const crypto = require("crypto");
const nodeMailer = require("nodemailer");

const createJwt = (user, res, statusCode) => {
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax", // Use 'lax' or 'strict' instead of 'none'
    secure: process.env.NODE_ENV === "production" ? true : false,
    credentials: true,
    expiresIn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  res.status(statusCode).json({
    status: "success",
    user: {
      id: user.id,
      userName: user.userName,
    },
  });
};

exports.auth = catchAsync(async (req, res, next) => {
  // httpOnly token
  const token = req.cookies?.token;

  if (!token || !(await jwt.verify(token, process.env.JWT_SECRET)))
    return res.status(401).json({
      status: "error",
      message: "unautorized",
    });

  // jwt{id,userName}
  const { id } = jwt.decode(token);

  // verify the id
  if (!id || !mongoose.isValidObjectId(id) || !(await User.findById(id)))
    return res.status(401).json({
      status: "error",
      message: "unautorized",
    });

  const user = await User.findById(id);
  // req.user = { id: user.id, userName: user.userName, email: user.email };
  req.user = user;
  next();
});

exports.addUser = catchAsync(async (req, res, next) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password)
    return res.status(400).json({
      status: "error",
      message: "Bad Request",
    });

  const user = await User.create({
    userName,
    email,
    password,
  });

  createJwt(user, res, 201);
});

exports.getUser = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.json({
    status: "success",
    users,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { userName, password } = req.body;

  if (!userName || !password)
    return res.status(400).json({
      status: "error",
      message: "Bad Request",
    });

  const user = await User.findOne({ userName });

  if (!user) return handleFaildLogin(res);

  const { isBlocked, trys, blockTime } = user.loginAttempts;

  if (isBlocked && blockTime > Date.now())
    return res.status(401).json({
      status: "unautorized",
      message: "Your account is locked please try again later",
    });

  await User.findByIdAndUpdate(user.id, {
    loginAttempts: {
      ...user.loginAttempts,
      isBlocked: false,
      trys: 0,
    },
  });

  if (!(await bcrypt.compare(password, user.password))) {
    if (user.loginAttempts.trys <= process.env.MAX_FAILED_LOGIN_ATTEMPTS) {
      await User.findByIdAndUpdate(user.id, {
        loginAttempts: {
          ...user.loginAttempts,
          trys: trys + 1,
        },
      });

      return handleFaildLogin(res);
    } else if (trys > process.env.MAX_FAILED_LOGIN_ATTEMPTS) {
      await User.findByIdAndUpdate(user.id, {
        loginAttempts: {
          ...user.loginAttempts,
          blockTime:
            Date.now() + parseInt(process.env.FAILED_LOGIN_ATTEMPTS_BLOCK_TIME),
          isBlocked: true,
        },
      });

      return handleFaildLogin(res);
    }
  } else {
    await User.findByIdAndUpdate(user.id, {
      loginAttempts: {
        blockTime,
        isBlocked: false,
        trys: 0,
      },
    });
    createJwt(user, res, 200);
  }
});

const handleFaildLogin = (res) => {
  return res.status(401).json({
    status: "unautorized",
    message: "Invalide User name or password",
  });
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    status: "success",
  });
};

exports.passwordResetToken = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ status: "error", message: "Bad Request" });

  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ status: "error", message: "Not Found" });

  // random token
  const token = crypto.randomBytes(32).toString("hex");

  const result = await User.findByIdAndUpdate(user?.id, {
    passwordReset: {
      token: await bcrypt.hash(token, 12),
      expires: Date.now() + 60 * 60 * 1000,
    },
  });

  if (!result) {
    return res.status(500).json({
      status: "error",
      message: "Couldn't generate passwordReset token for this user ",
    });
  }

  sendEmailNodeMailer(token, email, res);
});

exports.passwordResetTokenVerify = catchAsync(async (req, res, next) => {
  const { newPassword, token, email } = req.body;

  if (!token || !email || !newPassword)
    return res.status(400).json({ status: "error", message: "Bad Request" });

  const user = await User.findOne({ email });
  if (!user) res.status(404).json({ status: "error", message: "Not Found" });

  if (user.passwordReset.expires < Date.now())
    res.status(401).json({ status: "error", message: "Expired token" });

  if (!(await bcrypt.compare(token, user.passwordReset.token)))
    res.status(401).json({ status: "error", message: "Invalid token" });

  if (
    await User.findByIdAndUpdate(user.id, {
      password: newPassword,
      passwordReset: { token: null, expires: null },
    })
  )
    res.json({
      status: "success",
      message: "Password reset successful",
    });
  else
    res
      .status(500)
      .json({ status: "error", message: "Couldn't reset password" });
});

const sendEmailNodeMailer = async (token, email, res) => {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    port: 587,
    host: "smtp.gmail.com",
    subject: "Password Reset",
    // html template
    html: emailTempate(process.env.CLIENT_URL, token, email),
    secure: process.env.NODE_ENV === "production" ? true : false,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    if (result) res.json({ status: "success", message: "Email sent" });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ status: "error", error, message: "Couldn't send email" });
  }
};

const emailTempate = (host, token, email) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
          }
          .container {
              max-width: 600px;
              margin: 20px auto;
              padding: 20px;
              background-color: #fff;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          h2 {
              color: #333;
          }
          p {
              color: #666;
          }
          .btn {
              display: inline-block;
              background-color: #007bff;
              color: white !important;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 5px;
          }
          .btn:hover {
              background-color: #0056b3;
          }
          .font-bold {
            font-weight: 700;
        }
        .text-lg {
            font-size: 1.125rem;
        }
        .text-green-500 {
            color: #48bb78;
        }
        .text-gray-800 {
            color: #2d3748;
        }
        .logo {
            display: inline-block;
            width: 40px;
            height: 40px;
            background-image: url('path_to_your_logo.png');
            background-size: cover;
            margin-right: 5px;
        }
      </style>
  </head>
  <body>
      <div class="container">
      <h1 class="font-bold text-lg"><span class="text-green-500">Daily</span><span class="text-gray-800">Todo</span></h1>
          <h2>Password Reset</h2>
          <p>Click on the link below to reset your password:</p>
          <a class="btn" href="${host}/newpassword?token=${token}&email=${email}">Reset Password</a>
          <p>If you did not request a password reset, please ignore this email.</p>
          <p>Best regards,<br>DABACH</p>
      </div>
  </body>
  </html>
  `;
};

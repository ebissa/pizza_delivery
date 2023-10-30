import User from "../Models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnAuthenticatedError } from "../errors/index.js";
const register = async (req, res) => {
  const { email, name, password } = req.body;
  if (!name || !email || !password) {
    throw new BadRequestError("please provide all values");
  }
  const userAlreadyExists = await User.findOne({ email });
  if (userAlreadyExists) {
    throw new BadRequestError("Email already in use");
  }
  const user = await User.create({ name, email, password });
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
    },
    token,
  });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide all values");
  }
  const user = await User.findOne({ email }).select("+password");
  console.log(user);
  if (!user) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) {
    throw new UnAuthenticatedError("Invalid Credentials");
  }
  const token = user.createJWT();
  user.password = undefined;
  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};
const updateUser = async (req, res) => {
  const { email, name, location, lastName } = req.body;
  if (!email || !name || !lastName || !location) {
    throw new BadRequestError("please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;
  user.lastName = lastName;
  user.location = location;

  await user.save();
  const token = user.createJWT();

  res.status(StatusCodes.OK).json({ user, token, location: user.location });
};
export { register, login, updateUser };

// const nodemailer = require('nodemailer'); // You might need to install this package
// const crypto = require('crypto'); // Node.js built-in module

// const register = async (req, res) => {
//   const { email, name, password } = req.body;
//   if (!name || !email || !password) {
//     throw new BadRequestError("please provide all values");
//   }
//   const userAlreadyExists = await User.findOne({ email });
//   if (userAlreadyExists) {
//     throw new BadRequestError("Email already in use");
//   }

//   // Generate a random token
//   const verificationToken = crypto.randomBytes(20).toString('hex');

//   // Send an email to the user with the verification link
//   let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: 'your-email@gmail.com',
//       pass: 'your-password'
//     }
//   });

//   const verificationLink = `http://your-website.com/verify?token=${verificationToken}`;

//   let mailOptions = {
//     from: 'your-email@gmail.com',
//     to: email,
//     subject: 'Email Verification',
//     html: `<p>Please click the following link to verify your email:</p><p><a href="${verificationLink}">Verify</a></p>`
//   };

//   transporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//       console.log(error);
//       res.status(500).json({ error: 'Error sending verification email' });
//     } else {
//       console.log('Email sent: ' + info.response);
//       // Store the token and the email in your database only after email has been sent successfully
//       const user = await User.create({ name, email, password, verificationToken });

//       const token = user.createJWT();

//       res.status(StatusCodes.OK).json({
//         user: {
//           name: user.name,
//           lastName: user.lastName,
//           email: user.email,
//           location: user.location,
//         },
//         token,
//       });
//     }
//   });
// };

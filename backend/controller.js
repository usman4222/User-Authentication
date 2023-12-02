const User = require('./Model');
const ErrorHandler = require('./ErrorHandler');
const catchError = require('./catchError');

// register user
exports.registerUser = catchError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    user
  });
});

// login user
exports.loginUser = catchError(async (req, res, next) => {

    const { email, password } = req.body

    //checking user have email and password already
    if (!email || !password) {
        return next(new ErrorHandler("Please enter Email and Password", 400)) 
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new ErrorHandler("Invalid Credentials", 401)) 
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        console.error("Password comparison error:", "Invalid Credentials");
        return next(new ErrorHandler("Invalid Credentials", 401));
    }  

  res.status(200).json({
    success: true,
    message: "User Logged In Successfully"
  });
})
const mongoose = require("mongoose")
const validator = require('validator')
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter Your Name"],
        maxLength: [30, "Name should'nt exceed more than 30 characters"],
        minLength: [4, "Name Should be more than 4 character"]
    },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
        validate: [validator.isEmail, "Please Enter Valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minLength: [8, "Password should be more than 8 characters"],
        select: false
    },
    createdAt: { 
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

//compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
    try {
        const isPasswordMatched = await bcrypt.compare(enteredPassword, this.password);
        return isPasswordMatched;
    } catch (error) {
        throw new Error(error);
    }
};



module.exports = mongoose.model("User", userSchema)
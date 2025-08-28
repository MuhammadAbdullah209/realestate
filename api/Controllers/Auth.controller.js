const User = require('../Models/user.model');
const encrypted = require('bcrypt');
const { ErrorHandler } = require('../Utils/error');
const jwt = require('jsonwebtoken')
//Sign-Up Controller Function
const SignUp = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const hashedPass = encrypted.hashSync(password, 10)
        const newUser = new User({ username, email, password: hashedPass });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
        console.log("Received body:", req.body);
        res.send(req.body)
    } catch (error) {
        next(error)
    }
};
// Get user on the screen 
const GetAllUsers = async (req, res) => {
    try {
        const user = await User.find()
        res.json(user)
    }
    catch (error) {
        next(error)
    }
}



// SignIn Controller Function
const SignIn = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const ValidUser = await User.findOne({ email })
        if (!ValidUser) return next(ErrorHandler(404, 'User Not Found'))
        const ValidPassword = encrypted.compareSync(password, ValidUser.password)
        if (!ValidPassword) return next(ErrorHandler(401, 'Wrong Credential'))
        const token = jwt.sign({ id: ValidUser._id }, process.env.JWT_SECRETE)
        const { password: pass, ...rest } = ValidUser._doc
        res.cookie('Access_Token', token, { httpOnly: true }).status(200).json(rest)
    } catch (error) {
        next(error);
    }
}

// Google Auth Controller Function
const Google = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRETE);
            const { password: pass, ...rest } = user._doc;
            res
                .cookie('Access_Token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        } else {
            const GeneratedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = encrypted.hashSync(GeneratedPassword, 10);
            const newUser = new User({
                username:
                    req.body.name.split(' ').join('').toLowerCase() +
                    Math.random().toString(36).slice(-8),
                email: req.body.email,
                password: hashedPassword,
                avatar: req.body.photo,
            });
            await newUser.save();
            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRETE);
            const { password: pass, ...rest } = newUser._doc;
            res
                .cookie('Access_Token', token, { httpOnly: true })
                .status(200)
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};


// Update the User Controller Function
const Update = async (req, res, next) => {
    if (req.user.id !== req.params.id) return next(ErrorHandler(401, 'You can only update your own Account'))
    try {
        if (req.body.password) {
            req.body.password = encrypted.hashSync(req.body.password, 10)
        }
        const UpdatedUser = await User.findByIdAndUpdate(req.params.id, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                avatar: req.body.avatar,
            }
        }, { new: true })
        const { password, ...rest } = UpdatedUser._doc
        res.status(200).json(rest)
    } catch (error) {
        next(error)
    }
}

// Delete the User by Controller Function
const Delete = async (req, res, next) => {
    // if (req.user.id !== req.params.id) {
    //     return next( new ErrorHandler(401, 'You can only delete your own account'));
    // }
    try {
        await User.findByIdAndDelete(req.params.id);
        res.clearCookie('Access_Token')
        res.status(200).json({ message: 'The user has been successfully deleted from the database!' });
    } catch (error) {
        console.error(error.message);
        next(error);
    }
};
const SignOut = async (req, res, next) => {
    try {
        res.clearCookie('Access_Token')
        res.status(200).json('User Successfully has been Logged Out')
    } catch (error) {
        console.log(error.message);
        next(error);
    }
}


module.exports = { SignUp, GetAllUsers, SignIn, Google, Update, Delete, SignOut };








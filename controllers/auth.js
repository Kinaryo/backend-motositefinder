const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const Motor  = require('../models/motor');
module.exports.registerForm = async (req, res) => {
    res.status(200).json({ message: 'Render registration form' });
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password, name } = req.body;
        const user = new User({ email, username, name });
        const registerUser = await User.register(user, password);

        req.login(registerUser, (err) => {
            if (err) return next(err);
            req.flash('success_msg', 'Registrasi berhasil, Anda berhasil login');
            res.status(200).json({ success: true, message: 'Registrasi berhasil' });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports.loginForm = (req, res) => {
    res.status(200).json({ message: 'Render login form' });
}

// module.exports.login = (req, res) => {
//     res.status(200).json({ success: true, message: 'Login berhasil' });
// };


module.exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                status: "Failed",
                msg: `Username not registered`
            });
        }

        const isValidPassword = bcrypt.compareSync(password, user.password);

        if (isValidPassword) {
            const payload = {
                id: user.id,
                name: user.name,
                email: user.email,
                username: user.username,
            };

            const secretKey = 'motositefindr123';
            const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

            // Query Motor setelah berhasil login (contoh)
            const motors = await Motor.find({ userId: user.id }, { id: 1, title: 1 });

            res.status(200).json({
                success: true,
                message: 'Login berhasil',
                token,
                motors
            });
        } else {
            res.status(401).json({
                status: "Failed",
                msg: `Invalid password`
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};






module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success_msg', 'Anda berhasil logout');
        res.status(200).json({ success: true, message: 'Logout berhasil' });
    });
}

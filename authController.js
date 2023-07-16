const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('./config');
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles,
    };
    return jwt.sign(payload, secret, { expiresIn: '24h' });
};

class authController {
    async registration(req, res) {
        try {
            const { username, password } = req.body;
            const candidate = await User.findOne({ username });
            if (candidate) {
                return res.status(400).json({
                    message: 'User with such username already exists',
                });
            }
            const hashPassword = bcrypt.hashSync(password, 7);
            const userRole = await Role.findOne({ value: 'USER' });
            const user = new User({
                username,
                password: hashPassword,
                roles: [userRole.value],
            });
            await user.save();
            return res.json({
                message: 'User has been registered successfully',
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Registration error' });
        }
    }
    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                return res
                    .status(400)
                    .json({ message: `There's no user with such username` });
            }
            const hashedPassword = user.password;
            if (bcrypt.compareSync(password, hashedPassword)) {
                const token = generateAccessToken(user._id, user.roles);
                return res.json({
                    token,
                });
            } else {
                return res.status(400).json({ message: 'Incorrect password' });
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Login error' });
        }
    }
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json({ users });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Getting users error' });
        }
    }
}

module.exports = new authController();

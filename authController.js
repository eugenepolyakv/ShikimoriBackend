const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret } = require('./config');
const tokenService = require('./service/token-service');
// const generateAccessToken = (id, roles) => {
//     const payload = {
//         id,
//         roles,
//     };
//     return jwt.sign(payload, secret, { expiresIn: '24h' });
// };

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
            const { _id: identifier, roles } = user;
            const tokens = tokenService.generateTokens({ identifier, roles });
            await tokenService.saveToken(identifier, tokens.refreshToken);
            await res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json({
                ...tokens,
                user: { identifier, roles },
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
                const { _id: identifier, roles } = user;
                const tokens = tokenService.generateTokens({
                    identifier,
                    roles,
                });
                await tokenService.saveToken(identifier, tokens.refreshToken);
                await res.cookie('refreshToken', tokens.refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                });
                return res.json({
                    username,
                });
            } else {
                return res.status(400).json({ message: 'Incorrect password' });
            }
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Login error' });
        }
    }
    async logout(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const token = await tokenService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Logout error' });
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
    async refresh(req, res) {
        try {
            const { refreshToken } = req.cookies;
            const { userData, tokenFromDb } = await tokenService.refresh(
                refreshToken
            );
            if (!userData || !tokenFromDb) {
                res.status(400).json({ message: 'Unauthorized user' });
            }
            const { identifier, roles } = await User.findById(
                userData.identifier
            );
            const tokens = tokenService.generateTokens({
                identifier,
                roles,
            });
            await tokenService.saveToken(identifier, tokens.refreshToken);
            await res.cookie('refreshToken', tokens.refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.json({
                token: tokens.refreshToken,
            });
        } catch (e) {
            console.log(e);
            res.status(400).json({ message: 'Refresh error' });
        }
    }
}

module.exports = new authController();

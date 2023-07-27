require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRouter = require('../routes/authRouter');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://127.0.0.1:5173', credentials: true }));
app.use('/api', authRouter);
// app.use(
//     cors({
//         origin: '*',
//     })
// );

const PORT = process.env.PORT || 5000;
const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        app.listen(PORT, () => {
            console.log('Listening on port', PORT);
        });
    } catch (e) {
        console.log(e);
    }
};

// app.post('/access_token', (req, res) => {
//     const { value } = req.body;
//     switch (value) {
//         case 1:
//             jwt.sign(NORMAL_USER, SECRET, (err, token) => {
//                 res.json({ accessToken: token });
//             });
//         case 2:
//             jwt.sign(ADMIN_USER, SECRET, (err, token) => {
//                 res.json({ accessToken: token });
//             });
//         default:
//             // Send error message
//             return res;
//     }
// });

// const NORMAL_USER = {
//     name: 'kunal',
//     admin: false,
// };
// const ADMIN_USER = {
//     name: 'alex',
//     admin: true,
// };
// const SECRET = 'client-secret';
start();

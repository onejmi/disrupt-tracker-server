"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const auth_router_1 = require("./routes/auth-router");
const app = express();
const cors = require('cors');
const passportSetup = require('./config/passport-setup');
const port = 3000;
const frontendLocation = 'http://localhost:8080';
passportSetup.begin();
// app.options('*', cors(frontendLocation))
app.use(cors(frontendLocation));
app.use('/auth', auth_router_1.router);
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map
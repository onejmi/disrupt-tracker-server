"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
exports.router = express_1.Router();
const passport = require('passport');
exports.router.get('/google', passport.authenticate('google', {
    scope: ['profile']
}));
exports.router.get('/google/redirect', (req, res) => {
    res.send("You reached the callback URI!");
});
//# sourceMappingURL=auth-router.js.map
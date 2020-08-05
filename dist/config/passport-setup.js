"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.begin = void 0;
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys_1 = __importDefault(require("./keys"));
const googleOptions = {
    callbackURL: '/auth/google/redirect',
    clientID: keys_1.default.google.clientID,
    clientSecret: keys_1.default.google.clientSecret
};
function begin() {
    passport.use(new GoogleStrategy(googleOptions, () => {
        //passport callback function
    }));
}
exports.begin = begin;
//# sourceMappingURL=passport-setup.js.map
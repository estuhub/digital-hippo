"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthCredentialsValidator = void 0;
var zod_1 = __importDefault(require("zod"));
exports.AuthCredentialsValidator = zod_1.default.object({
    email: zod_1.default.string().email("Please enter a valid email address."),
    password: zod_1.default
        .string()
        .min(8, { message: "Password must be at least 8 characters long." }),
});

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = exports.io = void 0;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
/* ========================================
   EXPRESS APP
======================================== */
const app = (0, express_1.default)();
exports.app = app;
/* ========================================
   HTTP SERVER
======================================== */
const server = http_1.default.createServer(app);
exports.server = server;
/* ========================================
   SOCKET SERVER
======================================== */
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: [
            "GET",
            "POST",
        ],
    },
});
exports.io = io;
/* ========================================
   SOCKET CONNECTION
======================================== */
io.on("connection", (socket) => {
    console.log("User Connected:", socket.id);
    /* ========================================
       JOIN ROOM
    ======================================== */
    socket.on("joinRoom", (userId) => {
        socket.join(userId);
        console.log(`User joined room: ${userId}`);
    });
    /* ========================================
       SEND NOTIFICATION
    ======================================== */
    socket.on("sendNotification", (data) => {
        io.to(data.userId).emit("receiveNotification", {
            title: data.title,
            message: data.message,
        });
    });
    /* ========================================
       LIVE WALLET UPDATE
    ======================================== */
    socket.on("walletUpdate", (data) => {
        io.to(data.userId).emit("walletUpdated", {
            balance: data.balance,
        });
    });
    /* ========================================
       LIVE RECHARGE STATUS
    ======================================== */
    socket.on("rechargeUpdate", (data) => {
        io.to(data.userId).emit("rechargeStatus", {
            status: data.status,
            amount: data.amount,
        });
    });
    /* ========================================
       DISCONNECT
    ======================================== */
    socket.on("disconnect", () => {
        console.log("User Disconnected:", socket.id);
    });
});

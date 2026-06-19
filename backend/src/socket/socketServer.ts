import {

  Server,
  Socket,

} from "socket.io";

import http
from "http";

import express
from "express";


/* ========================================
   EXPRESS APP
======================================== */

const app =
  express();


/* ========================================
   HTTP SERVER
======================================== */

const server =
  http.createServer(app);


/* ========================================
   SOCKET SERVER
======================================== */

const io =
  new Server(server, {

    cors: {

      origin: "*",

      methods: [

        "GET",
        "POST",

      ],

    },

  });


/* ========================================
   SOCKET CONNECTION
======================================== */

io.on(

  "connection",

  (socket: Socket) => {

    console.log(

      "User Connected:",
      socket.id

    );

    /* ========================================
       JOIN ROOM
    ======================================== */

    socket.on(

      "joinRoom",

      (userId: string) => {

        socket.join(userId);

        console.log(

          `User joined room: ${userId}`

        );

      }

    );

    /* ========================================
       SEND NOTIFICATION
    ======================================== */

    socket.on(

      "sendNotification",

      (data: any) => {

        io.to(data.userId).emit(

          "receiveNotification",

          {

            title:
              data.title,

            message:
              data.message,

          }

        );

      }

    );

    /* ========================================
       LIVE WALLET UPDATE
    ======================================== */

    socket.on(

      "walletUpdate",

      (data: any) => {

        io.to(data.userId).emit(

          "walletUpdated",

          {

            balance:
              data.balance,

          }

        );

      }

    );

    /* ========================================
       LIVE RECHARGE STATUS
    ======================================== */

    socket.on(

      "rechargeUpdate",

      (data: any) => {

        io.to(data.userId).emit(

          "rechargeStatus",

          {

            status:
              data.status,

            amount:
              data.amount,

          }

        );

      }

    );

    /* ========================================
       DISCONNECT
    ======================================== */

    socket.on(

      "disconnect",

      () => {

        console.log(

          "User Disconnected:",
          socket.id

        );

      }

    );

  }

);


/* ========================================
   EXPORTS
======================================== */

export {

  io,
  app,
  server,

};
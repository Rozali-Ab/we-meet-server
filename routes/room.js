import express from "express";

export const roomRouter = express.Router();

/* GET users listing. */
roomRouter.get("/", function (req, res, next) {
  res.send("room");
});

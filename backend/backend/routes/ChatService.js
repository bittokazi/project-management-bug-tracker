import express from "express";
import { UserList } from "./../controllers/services/ChatServiceController";

const router = express.Router();

router.get("/tenant/users", UserList);

export default router;

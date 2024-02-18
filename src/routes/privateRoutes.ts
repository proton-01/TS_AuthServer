import  express  from "express";
import { privateRouteController } from "../controllers";
import { verifyToken } from "../utils/verifyToken";

const router = express.Router();

router.get("/api/private/getAllUsers",verifyToken,privateRouteController.getAllUser);

export {router as privateRouter};
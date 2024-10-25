import { Router } from "express";
import { signup, signin, refreshToken } from "../controllers/auth";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/refresh-token", refreshToken);

export default authRouter;

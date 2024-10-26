import { Router } from "express";
import { signup, signin, refreshToken } from "../controllers/auth";

const authRouter = Router();

authRouter.post("/signup", signup as any);
authRouter.post("/signin", signin as any);
authRouter.post("/refresh-token", refreshToken as any);

export default authRouter;

import { Router } from "express";
import {
  createOrganization,
  deleteOrganization,
  getAllOrganization,
  getOrganizationById,
  inviteUserToOrganization,
  updateOrganization,
} from "../controllers/organization";
import { authenticateToken } from "../middleware/authenticateJWT";

const organizationRouter = Router();

organizationRouter.use(authenticateToken as any);

organizationRouter.post("/", createOrganization as any);
organizationRouter.get("/:organization_id", getOrganizationById as any);
organizationRouter.get("/", getAllOrganization as any);
organizationRouter.put("/:organization_id", updateOrganization as any);
organizationRouter.delete("/:organization_id", deleteOrganization as any);
organizationRouter.post(
  "/:organization_id/invite",
  inviteUserToOrganization as any,
);

export default organizationRouter;

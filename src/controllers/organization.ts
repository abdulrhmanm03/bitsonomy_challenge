import { Response } from "express";
import { AuthenticatedRequest } from "../interfaces/helpers";
import {
  CreateOrganizationRequestBody,
  CreateOrganizationResponse,
  getAllOrganizationsResponse,
  getOrganizationByIdResponse,
  updateOrganizationRequestBody,
  updateOrganizationResponse,
} from "../interfaces/organizationRouter";
import { BaseResponse } from "../interfaces/helpers";
import { nanoid } from "nanoid";
import organizationModel from "../models/organization";
import UserModel from "../models/user";
import { getOrganizationData } from "../utils/helper_functions";

export async function createOrganization(
  req: AuthenticatedRequest<{}, CreateOrganizationRequestBody>,
  res: Response<CreateOrganizationResponse | BaseResponse>,
) {
  const user_id = req.user.id;
  console.log(user_id);
  const { name, description } = req.body;
  try {
    const newOrganization = await organizationModel.create({
      _id: nanoid(),
      ownerId: user_id,
      name,
      description,
      members: [user_id],
    });

    res.status(201).json({ organization_id: newOrganization._id });
  } catch (error) {
    res.status(500).json({ message: "Failed to create organization" });
  }
}

export async function getOrganizationById(
  req: AuthenticatedRequest<{ organization_id: string }>,
  res: Response<getOrganizationByIdResponse | BaseResponse>,
) {
  try {
    const { organization_id } = req.params;
    const organization_data = await getOrganizationData(organization_id);

    if (!organization_data) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    res.status(200).json(organization_data);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve organization" });
  }
}

export async function getAllOrganization(
  req: AuthenticatedRequest,
  res: Response<getAllOrganizationsResponse | BaseResponse>,
) {
  try {
    const organizations = await organizationModel.find().select("_id");

    if (!organizations || organizations.length === 0) {
      res.status(404).json({ message: "No organizations found" });
      return;
    }

    const organizationDataPromises = organizations.map(async (org) => {
      const organization_data = await getOrganizationData(org._id);
      return organization_data as getOrganizationByIdResponse;
    });

    const organizationDataArray = await Promise.all(organizationDataPromises);

    res.status(200).json(organizationDataArray);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve organizations" });
  }
}

export async function updateOrganization(
  req: AuthenticatedRequest<
    { organization_id: string },
    updateOrganizationRequestBody
  >,
  res: Response<updateOrganizationResponse | BaseResponse>,
) {
  try {
    const { organization_id } = req.params;
    const { name, description } = req.body;
    const sender_id = req.user.id;

    const organization = await organizationModel.findById(organization_id);

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    if (organization.ownerId.toString() !== sender_id) {
      res.status(403).json({
        message: "You are not authorized to update this organization",
      });
      return;
    }

    await organizationModel.findByIdAndUpdate(
      organization_id,
      { name, description },
      { new: true },
    );

    res.status(200).json({ organization_id, name, description });
  } catch (error) {
    res.status(500).json({ message: "Failed to update organization" });
  }
}

export async function deleteOrganization(
  req: AuthenticatedRequest<{ organization_id: string }>,
  res: Response<BaseResponse>,
) {
  try {
    const sender_id = req.user.id;
    const { organization_id } = req.params;

    const organization = await organizationModel.findById(organization_id);

    if (!organization) {
      res.status(404).json({ message: "Organization not found" });
      return;
    }

    if (organization.ownerId.toString() !== sender_id) {
      res.status(403).json({
        message: "You are not authorized to Delete this organization",
      });
      return;
    }

    await organizationModel.findByIdAndDelete(organization_id);

    res.status(200).json({ message: "Organization deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete organization" });
  }
}

export async function inviteUserToOrganization(
  req: AuthenticatedRequest<{ organization_id: string }>,
  res: Response<BaseResponse>,
) {
  try {
    const { organization_id } = req.params;
    const sender_id = req.user.id;
    const invited_user_email = req.body.email;

    const organization = await organizationModel.findById(organization_id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    if (organization.ownerId.toString() !== sender_id) {
      res.status(403).json({
        message: "You are not authorized to add members to this organizations",
      });
      return;
    }

    const invited_user = await UserModel.findOne({ email: invited_user_email });

    if (!invited_user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (organization.members.includes(invited_user._id)) {
      res.status(400).json({ message: "User is already a member" });
      return;
    }

    organization.members.push(invited_user._id);
    await organization.save();

    res.status(200).json({ message: "User invited successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to invite user to organization" });
  }
}

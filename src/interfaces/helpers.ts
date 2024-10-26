import { Request } from "express";

export interface BaseResponse {
  message: string;
}

export interface AuthenticatedRequest<
  Params = {},
  ResBody = any,
  ReqBody = any,
  Query = {},
> extends Request<Params, ResBody, ReqBody, Query> {
  user: { id: string };
}

export enum Access_Level {
  Owner = "owner",
  member = "Member",
}

export interface OrganizationMember {
  _id: string;
  name: string;
  email: string;
}

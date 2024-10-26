import { Access_Level } from "./helpers";

export interface CreateOrganizationRequestBody {
  name: string;
  description: string;
}

export interface CreateOrganizationResponse {
  organization_id: string;
}

interface organization_members {
  name: string;
  email: string;
  access_level: Access_Level;
}

export interface getOrganizationByIdResponse {
  organization_id: string;
  name: string;
  description: string;
  organization_members: organization_members[];
}

export type getAllOrganizationsResponse = getOrganizationByIdResponse[];

export interface updateOrganizationRequestBody {
  name: string;
  description: string;
}

export interface updateOrganizationResponse {
  organization_id: string;
  name: string;
  description: string;
}

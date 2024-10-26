import { Access_Level, OrganizationMember } from "../interfaces/helpers";
import organizationModel from "../models/organization";

export async function getOrganizationData(organization_id: string) {
  const organization = await organizationModel
    .findById(organization_id)
    .populate("members");

  if (!organization) {
    return null;
  }

  return {
    organization_id: organization._id.toString(),
    name: organization.name,
    description: organization.description,
    organization_members: organization.members.map((member) => ({
      name: (member.valueOf() as OrganizationMember).name,
      email: (member.valueOf() as OrganizationMember).email,
      access_level: getMemberAccessLevel(
        (member.valueOf() as OrganizationMember)._id,
        organization.ownerId.toString(),
      ),
    })),
  };
}

function getMemberAccessLevel(
  member_id: string,
  organization_owner_id: string,
): Access_Level {
  if (member_id == organization_owner_id) {
    return Access_Level.Owner;
  }
  return Access_Level.member;
}

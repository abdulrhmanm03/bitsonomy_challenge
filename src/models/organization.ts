import mongoose, { Document, Schema } from "mongoose";

interface Organization extends Document {
  _id: string;
  ownerId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  members: mongoose.Types.ObjectId[];
}

const organizationSchema = new Schema<Organization>({
  _id: { type: String, required: true },
  ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  members: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const organizationModel = mongoose.model<Organization>(
  "Organization",
  organizationSchema,
);

export default organizationModel;

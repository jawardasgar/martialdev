import mongoose, { Document, Schema } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  company?: string;
  budget: string;
  project: string;
  message: string;
  status: "new" | "contacted" | "in-progress" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

const contactSchema = new Schema<IContact>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },
    company: {
      type: String,
      trim: true,
    },
    budget: {
      type: String,
      required: [true, "Budget is required"],
      enum: ["< $10k", "$10k - $50k", "$50k - $100k", "$100k+", "Not sure yet"],
    },
    project: {
      type: String,
      required: [true, "Project type is required"],
      enum: [
        "Web Development",
        "Mobile App",
        "UI/UX Design",
        "Consulting",
        "Other",
      ],
    },
    message: {
      type: String,
      required: [true, "Message is required"],
      trim: true,
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [1000, "Message must not exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["new", "contacted", "in-progress", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Add indexes for better query performance
contactSchema.index({ email: 1 });
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });

export default mongoose.model<IContact>("Contact", contactSchema);

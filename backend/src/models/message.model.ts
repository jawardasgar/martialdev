import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  sessionId: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "assistant"],
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

// Create compound index for efficient querying
messageSchema.index({ sessionId: 1, timestamp: -1 });

export default mongoose.model<IMessage>("Message", messageSchema);

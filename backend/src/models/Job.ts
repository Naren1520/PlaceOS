import mongoose, { Schema, Document } from 'mongoose';

export interface IJob extends Document {
  title: string;
  description: string;
  skillsRequired: string[];
  deadline: Date;
  companyId: mongoose.Types.ObjectId;
  companyName: string;
}

const JobSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skillsRequired: [{ type: String }],
  deadline: { type: Date, required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model<IJob>('Job', JobSchema);
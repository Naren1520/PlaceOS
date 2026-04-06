import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  studentId: mongoose.Types.ObjectId;
  studentName: string;
  jobId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  matchScore: number;
  status: 'applied' | 'shortlisted' | 'rejected' | 'placed';
  appliedAt: Date;
}

const ApplicationSchema: Schema = new Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentName: { type: String, required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matchScore: { type: Number, required: true },
  status: { type: String, enum: ['applied', 'shortlisted', 'rejected', 'placed'], default: 'applied' },
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model<IApplication>('Application', ApplicationSchema);
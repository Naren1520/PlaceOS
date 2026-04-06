import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  userId: mongoose.Types.ObjectId;
  resumeUrl: string;
  skills: string[];
  github: string;
  githubScore: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const StudentSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  resumeUrl: { type: String, default: '' },
  skills: [{ type: String }],
  github: { type: String, default: '' },
  githubScore: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
}, { timestamps: true });

export default mongoose.model<IStudent>('Student', StudentSchema);
import { Schema, model, Document } from 'mongoose';

// Interfaccia TypeScript per il Post
export interface IPost extends Document {
  title: string;
  body: string;
  hashtags: string[];
  status: 'draft' | 'published';
  author: string;
  createdAt: Date;
}

const postSchema = new Schema<IPost>({
  title: { type: String, required: true },
  body: { type: String, required: true },
  hashtags: [{ type: String }],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  author: { type: String, default: 'Brian Fox' },
  createdAt: { type: Date, default: Date.now }
});

export const Post = model<IPost>('Post', postSchema);
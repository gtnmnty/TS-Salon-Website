import { Schema, model } from 'mongoose';

const reviewSchema = new Schema({
  initial: { type: String, required: true },
  name: { type: String, required: true },
  stars: { type: Number, required: true, min: 1, max: 5 },
  text: { type: String, required: true }
});

export const Review = model('Review', reviewSchema);
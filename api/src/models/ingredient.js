import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  category: String,
  description: String,
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number
  },
  seasonality: [String],
  storage: String
}, {
  collection: 'ingredients',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

ingredientSchema.index({ name: 'text', description: 'text', category: 'text' });

export const Ingredient = mongoose.models.Ingredient || mongoose.model('Ingredient', ingredientSchema);


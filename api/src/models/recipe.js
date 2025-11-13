import mongoose from 'mongoose';

const ingredientRefSchema = new mongoose.Schema({
  ingredientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient', required: true },
  name: { type: String, required: true },
  quantity: Number,
  unit: String,
  optional: { type: Boolean, default: false },
  notes: String
}, { _id: false });

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  cuisine: String,
  course: String,
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  servings: { type: Number, default: 2 },
  prepTimeMinutes: Number,
  cookTimeMinutes: Number,
  totalTimeMinutes: Number,
  tags: { type: [String], default: [] },
  ingredients: { type: [ingredientRefSchema], default: [] },
  instructions: { type: [String], default: [] },
  tips: { type: [String], default: [] },
  nutrition: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    sugar: Number
  },
  imageUrl: String,
  videoUrl: String,
  source: String,
  createdBy: String
}, {
  collection: 'recipes',
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

recipeSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  cuisine: 'text',
  course: 'text',
  'ingredients.name': 'text'
});

recipeSchema.pre('save', function preSave(next) {
  const prep = this.prepTimeMinutes ?? 0;
  const cook = this.cookTimeMinutes ?? 0;
  if (prep || cook) {
    this.totalTimeMinutes = prep + cook;
  }
  next();
});

recipeSchema.pre('findOneAndUpdate', function preFindOneAndUpdate(next) {
  const update = this.getUpdate();
  if (!update) {
    return next();
  }

  const $set = update.$set || update;
  if ($set.prepTimeMinutes != null && $set.cookTimeMinutes != null) {
    if (!update.$set) {
      update.$set = {};
    }
    update.$set.totalTimeMinutes = $set.prepTimeMinutes + $set.cookTimeMinutes;
  }

  this.setUpdate(update);
  next();
});

export const Recipe = mongoose.models.Recipe || mongoose.model('Recipe', recipeSchema);


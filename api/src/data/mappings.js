export const recipeIndexDefinition = {
  settings: {
    analysis: {
      analyzer: {
        multi_lang: {
          type: 'standard',
          stopwords: ['_spanish_', '_english_']
        }
      }
    }
  },
  mappings: {
    dynamic_templates: [
      {
        strings_as_keywords: {
          match_mapping_type: 'string',
          mapping: {
            type: 'keyword',
            ignore_above: 256
          }
        }
      }
    ],
    properties: {
      title: {
        type: 'search_as_you_type',
        analyzer: 'multi_lang'
      },
      description: { type: 'search_as_you_type', analyzer: 'multi_lang' },
      tags: { type: 'keyword' },
      cuisine: { type: 'keyword' },
      course: { type: 'keyword' },
      difficulty: { type: 'keyword' },
      servings: { type: 'integer' },
      prepTimeMinutes: { type: 'integer' },
      cookTimeMinutes: { type: 'integer' },
      totalTimeMinutes: { type: 'integer' },
      ingredients: {
        type: 'nested',
        properties: {
          name: {
            type: 'search_as_you_type',
            analyzer: 'multi_lang'
          },
          unit: { type: 'keyword' },
          quantity: { type: 'float' },
          optional: { type: 'boolean' },
          notes: { type: 'text', analyzer: 'multi_lang' },
          ingredientId: { type: 'keyword' }
        }
      },
      instructions: { type: 'text', analyzer: 'multi_lang' },
      tips: { type: 'text', analyzer: 'multi_lang' },
      nutrition: {
        properties: {
          calories: { type: 'float' },
          protein: { type: 'float' },
          carbs: { type: 'float' },
          fat: { type: 'float' },
          fiber: { type: 'float' },
          sugar: { type: 'float' }
        }
      },
      imageUrl: { type: 'keyword' },
      videoUrl: { type: 'keyword' },
      source: { type: 'keyword' },
      createdBy: { type: 'keyword' },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' }
    }
  }
};

export const ingredientIndexDefinition = {
  settings: {
    analysis: {
      analyzer: {
        multi_lang: {
          type: 'standard',
          stopwords: ['_spanish_', '_english_']
        }
      }
    }
  },
  mappings: {
    properties: {
      name: {
        type: 'text',
        analyzer: 'multi_lang',
        fields: { keyword: { type: 'keyword' } }
      },
      category: { type: 'keyword' },
      description: { type: 'text', analyzer: 'multi_lang' },
      seasonality: { type: 'keyword' },
      storage: { type: 'text', analyzer: 'multi_lang' },
      nutrition: {
        properties: {
          calories: { type: 'float' },
          protein: { type: 'float' },
          carbs: { type: 'float' },
          fat: { type: 'float' },
          fiber: { type: 'float' },
          sugar: { type: 'float' }
        }
      },
      createdAt: { type: 'date' },
      updatedAt: { type: 'date' }
    }
  }
};


const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let RecipeModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const RecipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  type: {
    type: String,
    trim: true,
    required: true,
  },
  ingredients: {
    type: String,
    trim: true,
    required: true,
  },
  instructions: {
    type: String,
    trim: true,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

RecipeSchema.statics.toAPI = (doc) => ({
  title: doc.title,
  type: doc.type,
  ingredients: doc.ingredients,
  instructions: doc.instructions,
  _id: doc._id,
});

RecipeSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return RecipeModel.find(search).select('title type ingredients instructions').lean().exec(callback);
};

// delete a recipe based on the mongo ID
RecipeSchema.statics.deleteByID = (recipeID, callback) => {
  const search = {
    _id: convertId(recipeID),
  };

  return RecipeModel.find(search).remove().exec(callback);
};

// edit a recipe based on the mongo ID
RecipeSchema.statics.editByID = (recipeID, data, callback) => {
  const search = {
    _id: recipeID,
  };

  return RecipeModel.findOneAndUpdate(
    search,
    {
      title: data.title,
      type: data.type,
      ingredients: data.ingredients,
      instructions: data.instructions,
    },
    callback,
  );
};

RecipeModel = mongoose.model('Recipe', RecipeSchema);

module.exports.RecipeModel = RecipeModel;
module.exports.RecipeSchema = RecipeSchema;

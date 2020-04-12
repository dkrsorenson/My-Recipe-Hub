const models = require('../models');

const { Recipe } = models;

const addRecipe = (req, res) => {
  if (!req.body.title || !req.body.type || !req.body.ingredients || !req.body.instructions) {
    return res.status(400).json({ error: 'Title, type, and description are required.' });
  }

  const recipeData = {
    title: req.body.title,
    type: req.body.type,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    owner: req.session.account._id,
  };

  const newRecipe = new Recipe.RecipeModel(recipeData);

  const recipePromise = newRecipe.save();

  recipePromise.then(() => res.json({ redirect: '/addRecipe' }));

  recipePromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Recipe already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return recipePromise;
};

const recipeBookPage = (req, res) => {
  Recipe.RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), recipes: docs });
  });
};

const getRecipes = (request, response) => {
  const req = request;
  const res = response;

  return Recipe.RecipeModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ csrfToken: req.csrfToken(), recipes: docs });
  });
};

const deleteRecipe = (request, response) => {
  const req = request;
  const res = response;

  return Recipe.RecipeModel.deleteByID(req.body._id, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.status(204).json();
  });
};

const editRecipe = (request, response) => {
  const req = request;
  const res = response;

  return Recipe.RecipeModel.editByID(req.body._id, req.body.recipe, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.status(204).json();
  });
};

module.exports.addRecipe = addRecipe;
module.exports.getRecipes = getRecipes;
module.exports.recipeBookPage = recipeBookPage;
module.exports.deleteRecipe = deleteRecipe;
module.exports.editRecipe = editRecipe;

const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getRecipes', mid.requiresLogin, controllers.Recipe.getRecipes);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.post('/addRecipe', mid.requiresLogin, controllers.Recipe.addRecipe);
  app.get('/recipeBook', mid.requiresLogin, controllers.Recipe.recipeBookPage);
  app.delete('/delete', mid.requiresLogin, controllers.Recipe.deleteRecipe);
  app.put('/editRecipe', mid.requiresLogin, controllers.Recipe.editRecipe);
  app.get('/getUser', mid.requiresSecure, mid.requiresLogin, controllers.Account.getUser);
  app.put('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;

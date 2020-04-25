"use strict";

// handles creating a new recipe
var handleRecipe = function handleRecipe(e) {
  e.preventDefault();

  if ($("#recipeTitle").val() == '' || $("#recipeType").val() == '' || $("#recipeIngredients").val() == '' || $("#recipeInstructions").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#recipeForm").attr("action"), $("#recipeForm").serialize(), function () {
    loadRecipesFromServer($("#csrfToken").val());
  });
  return false;
}; // handles deleting a recipe


var handleDelete = function handleDelete(e, id, csrf) {
  e.preventDefault();
  var data = {
    _id: id,
    _csrf: csrf
  };
  sendAjax('DELETE', $("#deleteRecipe").attr("action"), data, function () {
    loadRecipesFromServer(csrf);
  });
}; // handles an account password change


var handlePassChange = function handlePassChange(e) {
  e.preventDefault();

  if ($("#currentPass").val() == '' || $("#newPass1").val() == '' || $("#newPass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#newPass1").val() !== $("#newPass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('PUT', $("#accountForm").attr("action"), $("#accountForm").serialize(), function () {
    handleSuccess('Successfully changed password!');
  });
}; // handles an edit / change to a recipe


var handleEdit = function handleEdit(e, id, csrf) {
  e.preventDefault();
  var data = {
    _id: id,
    _csrf: csrf,
    recipe: {
      title: $("#recipeTitle").val(),
      type: $("#recipeType").val(),
      ingredients: $("#recipeIngredients").val(),
      instructions: $("#recipeInstructions").val()
    }
  };

  if ($("#recipeTitle").val() == '' || $("#recipeType").val() == '' || $("#recipeIngredients").val() == '' || $("#recipeInstructions").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('PUT', $("#editRecipeForm").attr("action"), data, function () {
    handleSuccess('Successfully updated recipe!');
  });
  return false;
}; // The form to add recipes


var RecipeForm = function RecipeForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "recipeForm",
      name: "recipeForm",
      onSubmit: handleRecipe,
      action: "/addRecipe",
      method: "POST",
      className: "recipeForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Title: "), /*#__PURE__*/React.createElement("input", {
      id: "recipeTitle",
      type: "text",
      name: "title",
      placeholder: "Recipe Title"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      htmlFor: "type"
    }, "Type: "), /*#__PURE__*/React.createElement("select", {
      id: "recipeType",
      name: "type"
    }, /*#__PURE__*/React.createElement("option", {
      value: "Appetizers"
    }, "Appetizers"), /*#__PURE__*/React.createElement("option", {
      value: "Side Dishes"
    }, "Side Dishes"), /*#__PURE__*/React.createElement("option", {
      value: "Breakfast"
    }, "Breakfast"), /*#__PURE__*/React.createElement("option", {
      value: "Lunch"
    }, "Lunch"), /*#__PURE__*/React.createElement("option", {
      value: "Soups and Salads"
    }, "Soups and Salads"), /*#__PURE__*/React.createElement("option", {
      value: "Sauces and Dressings"
    }, "Sauces and Dressings"), /*#__PURE__*/React.createElement("option", {
      value: "Meats"
    }, "Meats"), /*#__PURE__*/React.createElement("option", {
      value: "Seafood"
    }, "Seafood"), /*#__PURE__*/React.createElement("option", {
      value: "Pasta"
    }, "Pasta"), /*#__PURE__*/React.createElement("option", {
      value: "Sandwiches"
    }, "Sandwiches"), /*#__PURE__*/React.createElement("option", {
      value: "Drinks"
    }, "Drinks"), /*#__PURE__*/React.createElement("option", {
      value: "Desserts"
    }, "Desserts"), /*#__PURE__*/React.createElement("option", {
      value: "Miscellaneous"
    }, "Miscellaneous")), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      htmlFor: "recipeIngredients"
    }, "Ingredients: "), /*#__PURE__*/React.createElement("textarea", {
      id: "recipeIngredients",
      type: "text",
      name: "ingredients",
      placeholder: "Recipe Ingredients"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      htmlFor: "recipeInstructions"
    }, "Instructions: "), /*#__PURE__*/React.createElement("textarea", {
      id: "recipeInstructions",
      type: "text",
      name: "instructions",
      placeholder: "Recipe Instructions"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      id: "csrfToken",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeSubmit formSubmit",
      type: "submit",
      value: "Add Recipe"
    }))
  );
}; // The form to list recipes


var RecipeList = function RecipeList(props) {
  if (props.recipes.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "recipeList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyRecipe"
      }, "No recipes yet"))
    );
  }

  var recipes = props.recipes; // filter recipes if necessary

  if (props.selectedType !== "All") {
    recipes = recipes.filter(function (recipe) {
      return recipe.type === props.selectedType;
    });
  } // ensure filtered list isn't empty


  if (recipes.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "recipeList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyRecipe"
      }, "No recipes yet"))
    );
  }

  var recipeNodes = recipes.map(function (recipe) {
    return (/*#__PURE__*/React.createElement("div", {
        key: recipe._id,
        className: "recipe"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "recipeTitle"
      }, " Title: "), /*#__PURE__*/React.createElement("label", null, recipe.title), /*#__PURE__*/React.createElement("h3", {
        className: "recipeType"
      }, " Type: "), /*#__PURE__*/React.createElement("label", null, recipe.type), /*#__PURE__*/React.createElement("h3", {
        className: "recipeDescription"
      }, " Ingredients: "), /*#__PURE__*/React.createElement("label", null, recipe.ingredients), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("h3", {
        className: "recipeDescription"
      }, " Instructions: "), /*#__PURE__*/React.createElement("label", null, recipe.instructions), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("form", {
        id: "deleteRecipe",
        name: "deleteRecipe",
        onSubmit: function onSubmit(e) {
          return handleDelete(e, recipe._id, props.csrf);
        },
        action: "/delete",
        method: "DELETE"
      }, /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        name: "_id",
        value: recipe._id
      }), /*#__PURE__*/React.createElement("input", {
        type: "hidden",
        id: "csrfToken",
        name: "_csrf",
        value: props.csrf
      }), /*#__PURE__*/React.createElement("input", {
        className: "recipeDelete",
        type: "image",
        src: "/assets/img/trashcan.png"
      })), /*#__PURE__*/React.createElement("input", {
        className: "recipeEdit",
        type: "image",
        src: "/assets/img/edit-icon.png",
        onClick: function onClick(e) {
          createEditRecipeForm(props.csrf, recipe);
        }
      }), /*#__PURE__*/React.createElement("br", null))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "recipeList"
    }, recipeNodes)
  );
}; // side navigation for filtering recipes by type


var RecipeTypeSideNav = function RecipeTypeSideNav(props) {
  return (/*#__PURE__*/React.createElement("div", {
      id: "filterNav",
      className: "filterSideNav"
    }, /*#__PURE__*/React.createElement("h2", null, "Filter Type"), /*#__PURE__*/React.createElement("input", {
      className: "recipeFilter",
      type: "submit",
      onClick: function onClick(e) {
        createRecipeBook(props.csrf, "All");
      },
      value: "All"
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeFilter",
      type: "submit",
      onClick: function onClick(e) {
        createRecipeBook(props.csrf, "Appetizers");
      },
      value: "Appetizers"
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeFilter",
      type: "submit",
      onClick: function onClick(e) {
        createRecipeBook(props.csrf, "Side Dishes");
      },
      value: "Side Dishes"
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeFilter",
      type: "submit",
      onClick: function onClick(e) {
        createRecipeBook(props.csrf, "Breakfast");
      },
      value: "Breakfast"
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeFilter",
      type: "submit",
      onClick: function onClick(e) {
        createRecipeBook(props.csrf, "Lunch");
      },
      value: "Lunch"
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeFilter",
      type: "submit",
      onClick: function onClick(e) {
        createRecipeBook(props.csrf, "Soups and Salads");
      },
      value: "Soups and Salads"
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeFilter",
      type: "submit",
      onClick: function onClick(e) {
        createRecipeBook(props.csrf, "Sauces and Dressings");
      },
      value: "Sauces and Dressings"
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeFilter",
      type: "submit",
      onClick: function onClick(e) {
        createRecipeBook(props.csrf, "Meats");
      },
      value: "Meats"
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeFilter",
      type: "submit",
      onClick: function onClick(e) {
        createRecipeBook(props.csrf, "Seafood");
      },
      value: "Seafood"
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeFilter",
      type: "submit",
      onClick: function onClick(e) {
        createRecipeBook(props.csrf, "Pasta");
      },
      value: "Pasta"
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeFilter",
      type: "submit",
      onClick: function onClick(e) {
        createRecipeBook(props.csrf, "Sandwiches");
      },
      value: "Sandwiches"
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeFilter",
      type: "submit",
      onClick: function onClick(e) {
        createRecipeBook(props.csrf, "Drinks");
      },
      value: "Drinks"
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeFilter",
      type: "submit",
      onClick: function onClick(e) {
        createRecipeBook(props.csrf, "Desserts");
      },
      value: "Desserts"
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeFilter",
      type: "submit",
      onClick: function onClick(e) {
        createRecipeBook(props.csrf, "Miscellaneous");
      },
      value: "Miscellaneous"
    }))
  );
}; // displays hambuger icon for expanding the recipe types side nav


var RecipeTypeSpan = function RecipeTypeSpan() {
  return (/*#__PURE__*/React.createElement("span", {
      id: "hamburgerIcon",
      className: "hamburger",
      onClick: openNav
    }, "\u2630")
  );
}; // opens the recipe types menu


function openNav() {
  if (document.getElementById("hamburgerIcon").style.marginRight === "240px") {
    closeNav();
  } else {
    document.getElementById("filterNav").style.width = "250px";
    document.getElementById("hamburgerIcon").style.marginRight = "240px";
    document.getElementById("content").style.marginRight = "275px";
  }
} // closes the recipe types menu


function closeNav() {
  document.getElementById("filterNav").style.width = "0";
  document.getElementById("hamburgerIcon").style.marginRight = "15px";
  document.getElementById("content").style.marginRight = "50px";
} // the form to edit recipes


var EditRecipeForm = function EditRecipeForm(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "editRecipeForm",
      name: "editRecipeForm",
      onSubmit: function onSubmit(e) {
        return handleEdit(e, props.recipe._id, props.csrf);
      },
      action: "/editRecipe",
      method: "PUT",
      className: "editRecipeForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "name"
    }, "Title: "), /*#__PURE__*/React.createElement("input", {
      id: "recipeTitle",
      type: "text",
      name: "title",
      placeholder: "Recipe Title",
      defaultValue: props.recipe.title
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      htmlFor: "type"
    }, "Type: "), /*#__PURE__*/React.createElement("select", {
      id: "recipeType",
      name: "type",
      defaultValue: props.recipe.type
    }, /*#__PURE__*/React.createElement("option", {
      value: "Appetizers"
    }, "Appetizers"), /*#__PURE__*/React.createElement("option", {
      value: "Side Dishes"
    }, "Side Dishes"), /*#__PURE__*/React.createElement("option", {
      value: "Breakfast"
    }, "Breakfast"), /*#__PURE__*/React.createElement("option", {
      value: "Lunch"
    }, "Lunch"), /*#__PURE__*/React.createElement("option", {
      value: "Soups and Salads"
    }, "Soups and Salads"), /*#__PURE__*/React.createElement("option", {
      value: "Sauces and Dressings"
    }, "Sauces and Dressings"), /*#__PURE__*/React.createElement("option", {
      value: "Meats"
    }, "Meats"), /*#__PURE__*/React.createElement("option", {
      value: "Seafood"
    }, "Seafood"), /*#__PURE__*/React.createElement("option", {
      value: "Pasta"
    }, "Pasta"), /*#__PURE__*/React.createElement("option", {
      value: "Sandwiches"
    }, "Sandwiches"), /*#__PURE__*/React.createElement("option", {
      value: "Drinks"
    }, "Drinks"), /*#__PURE__*/React.createElement("option", {
      value: "Desserts"
    }, "Desserts"), /*#__PURE__*/React.createElement("option", {
      value: "Miscellaneous"
    }, "Miscellaneous")), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      htmlFor: "recipeIngredients"
    }, "Ingredients: "), /*#__PURE__*/React.createElement("textarea", {
      id: "recipeIngredients",
      type: "text",
      name: "ingredients",
      placeholder: "Recipe Ingredients"
    }, props.recipe.ingredients), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      htmlFor: "recipeInstructions"
    }, "Instructions: "), /*#__PURE__*/React.createElement("textarea", {
      id: "recipeInstructions",
      type: "text",
      name: "instructions",
      placeholder: "Recipe Instructions"
    }, props.recipe.instructions), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      id: "csrfToken",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "recipeSubmit formSubmit",
      type: "submit",
      value: "Edit Recipe"
    }))
  );
}; // the form to change the account password


var AccountForm = function AccountForm(props) {
  return (/*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
      id: "accountForm",
      name: "accountForm",
      onSubmit: handlePassChange,
      action: "/changePassword",
      method: "PUT",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username: ", props.user.username), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      htmlFor: "currentPass"
    }, "Old Password: "), /*#__PURE__*/React.createElement("input", {
      id: "currentPass",
      type: "password",
      name: "currentPass",
      placeholder: "Current Password"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      htmlFor: "newPass1"
    }, "New Password:      "), /*#__PURE__*/React.createElement("input", {
      id: "newPass1",
      type: "password",
      name: "newPass1",
      placeholder: "New Password"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      htmlFor: "newPass2"
    }, "New Password:     "), /*#__PURE__*/React.createElement("input", {
      id: "newPass2",
      type: "password",
      name: "newPass2",
      placeholder: "Confirm Password"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Change Password"
    })))
  );
}; // creates the form to edit recipes


var createEditRecipeForm = function createEditRecipeForm(csrf, recipe) {
  ReactDOM.render( /*#__PURE__*/React.createElement(EditRecipeForm, {
    csrf: csrf,
    recipe: recipe
  }), document.querySelector("#content"));
  document.getElementById('typeSpan').style.display = 'none';
}; // loads all recipes to the recipe list


var loadRecipesFromServer = function loadRecipesFromServer(csrf, type) {
  sendAjax('GET', '/getRecipes', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(RecipeList, {
      recipes: data.recipes,
      csrf: csrf,
      selectedType: type
    }), document.querySelector("#content"));
  });
}; // creates the recipe list 


var createRecipeBook = function createRecipeBook(csrf, type) {
  ReactDOM.render( /*#__PURE__*/React.createElement(RecipeList, {
    recipes: [],
    csrf: csrf,
    selectedType: type
  }), document.querySelector("#content"));
  ReactDOM.render( /*#__PURE__*/React.createElement(RecipeTypeSideNav, {
    csrf: csrf
  }), document.querySelector("#typeSideNav"));
  ReactDOM.render( /*#__PURE__*/React.createElement(RecipeTypeSpan, null), document.querySelector("#typeSpan"));
  var element = document.getElementById('typeSpan');

  if (typeof element != 'undefined' && element != null) {
    document.getElementById('typeSpan').style.display = 'block';
  }

  loadRecipesFromServer(csrf, type);
}; // creates the form to add recipes


var createRecipeForm = function createRecipeForm(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(RecipeForm, {
    csrf: csrf
  }), document.querySelector("#content"));
  document.getElementById('typeSpan').style.display = 'none';
}; // creates the form for account data / password changes


var createAccountForm = function createAccountForm(csrf, account) {
  ReactDOM.render( /*#__PURE__*/React.createElement(AccountForm, {
    csrf: csrf,
    user: account
  }), document.querySelector("#content"));
  document.getElementById('typeSpan').style.display = 'none';
}; // sets up the events and page


var setup = function setup(csrf) {
  var homeButton = document.querySelector("#homeButton");
  var recipeBookButton = document.querySelector("#recipeBookButton");
  var addRecipeButton = document.querySelector("#addRecipeButton");
  var accountButton = document.querySelector("#accountButton");
  homeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createRecipeBook(csrf, "All");
    return false;
  });
  recipeBookButton.addEventListener("click", function (e) {
    e.preventDefault();
    createRecipeBook(csrf, "All");
    return false;
  });
  addRecipeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createRecipeForm(csrf);
    return false;
  });
  accountButton.addEventListener("click", function (e) {
    e.preventDefault();
    sendAjax('GET', '/getUser', null, function (data) {
      createAccountForm(csrf, data.user);
    });
    return false;
  });
  createRecipeBook(csrf, "All"); // default view
}; // gets the CSRF token


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; // start by getting the token


$(document).ready(function () {
  getToken();
});
"use strict";

// handle an error message pop up
var handleError = function handleError(message) {
  ReactDOM.render( /*#__PURE__*/React.createElement(ErrorMessage, {
    message: message
  }), document.querySelector("#message"));
  $("div.failure").fadeIn(300).delay(1500).fadeOut(400);
  console.log(message);
}; // handle a success message pop up


var handleSuccess = function handleSuccess(message) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SuccessMessage, {
    message: message
  }), document.querySelector("#message"));
  $("div.success").fadeIn(300).delay(1500).fadeOut(400);
  console.log(message);
};

var ErrorMessage = function ErrorMessage(props) {
  return (/*#__PURE__*/React.createElement("div", {
      id: "error",
      className: "alert-box failure"
    }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("span", {
      id: "errorMessage"
    }, props.message)))
  );
};

var SuccessMessage = function SuccessMessage(props) {
  return (/*#__PURE__*/React.createElement("div", {
      id: "success",
      className: "alert-box success"
    }, /*#__PURE__*/React.createElement("h3", null, /*#__PURE__*/React.createElement("span", {
      id: "successMessage"
    }, props.message)))
  );
};

var redirect = function redirect(response) {
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

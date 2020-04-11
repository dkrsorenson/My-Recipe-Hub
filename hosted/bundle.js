"use strict";

var handleRecipe = function handleRecipe(e) {
  e.preventDefault();

  if ($("#recipeTitle").val() == '' || $("#recipeType").val() == '' || $("#recipeIngredients").val() == '' || $("#recipeIunstructions").val() == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#recipeForm").attr("action"), $("#recipeForm").serialize(), function () {
    loadRecipesFromServer($("#csrfToken").val());
  });
  return false;
};

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
      value: "Soups & Salads"
    }, "Soups & Salads"), /*#__PURE__*/React.createElement("option", {
      value: "Sauces & Dressings"
    }, "Sauces & Dressings"), /*#__PURE__*/React.createElement("option", {
      value: "Meats"
    }, "Meats"), /*#__PURE__*/React.createElement("option", {
      value: "Meats"
    }, "Seafood"), /*#__PURE__*/React.createElement("option", {
      value: "Meats"
    }, "Pasta"), /*#__PURE__*/React.createElement("option", {
      value: "Drinks"
    }, "Drinks"), /*#__PURE__*/React.createElement("option", {
      value: "Desserts"
    }, "Desserts")), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
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
};

var handleDelete = function handleDelete(e, id, csrf) {
  e.preventDefault();
  var data = {
    _id: id,
    _csrf: csrf
  };
  sendAjax('DELETE', $("#deleteRecipe").attr("action"), data, function () {
    loadRecipesFromServer(csrf);
  });
};

var handleRecipeEdit = function handleRecipeEdit(e, id, csrf) {
  e.preventDefault();
  var data = {
    _id: id,
    _csrf: csrf
  };
  sendAjax('PUT', $("#editRecipe").attr("action"), data, function () {
    loadRecipesFromServer(csrf);
  });
};

var RecipeList = function RecipeList(props) {
  if (props.recipes.length === 0) {
    return (/*#__PURE__*/React.createElement("div", {
        className: "recipeList"
      }, /*#__PURE__*/React.createElement("h3", {
        className: "emptyRecipe"
      }, "No recipes yet"))
    );
  }

  var recipeNodes = props.recipes.map(function (recipe) {
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
      })), /*#__PURE__*/React.createElement("form", {
        id: "editRecipe",
        name: "editRecipe",
        onSubmit: function onSubmit(e) {
          return handleRecipeEdit(e, recipe._id, props.csrf);
        },
        action: "/editRecipe",
        method: "PUT"
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
        className: "recipeEdit",
        type: "image",
        src: "/assets/img/edit-icon.png"
      })), /*#__PURE__*/React.createElement("br", null))
    );
  });
  return (/*#__PURE__*/React.createElement("div", {
      className: "recipeList"
    }, recipeNodes)
  );
};

var loadRecipesFromServer = function loadRecipesFromServer(csrf) {
  sendAjax('GET', '/getRecipes', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(RecipeList, {
      recipes: data.recipes,
      csrf: csrf
    }), document.querySelector("#content"));
  });
};

var createRecipeBook = function createRecipeBook(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(RecipeList, {
    recipes: [],
    csrf: csrf
  }), document.querySelector("#content"));
  loadRecipesFromServer(csrf);
};

var createRecipeForm = function createRecipeForm(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(RecipeForm, {
    csrf: csrf
  }), document.querySelector("#content"));
};

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
};

var AccountForm = function AccountForm(props) {
  return (/*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("form", {
      id: "accountForm",
      name: "accountForm",
      onSubmit: handlePassChange,
      action: "/changePassword",
      method: "POST",
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
};

var createAccountForm = function createAccountForm(csrf, account) {
  ReactDOM.render( /*#__PURE__*/React.createElement(AccountForm, {
    csrf: csrf,
    user: account
  }), document.querySelector("#content"));
};

var setup = function setup(csrf) {
  var homeButton = document.querySelector("#homeButton");
  var recipeBookButton = document.querySelector("#recipeBookButton");
  var addRecipeButton = document.querySelector("#addRecipeButton");
  var accountButton = document.querySelector("#accountButton");
  homeButton.addEventListener("click", function (e) {
    e.preventDefault();
    createRecipeBook(csrf);
    return false;
  });
  recipeBookButton.addEventListener("click", function (e) {
    e.preventDefault();
    createRecipeBook(csrf);
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
  createRecipeBook(csrf); // default view
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

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

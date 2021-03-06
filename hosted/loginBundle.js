"use strict";

// Handles login
var handleLogin = function handleLogin(e) {
  e.preventDefault();
  $("#errorMessageBox").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '') {
    handleError("Username or password is empty");
    return false;
  }

  sendAjax('POST', $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);
  return false;
}; // Handles creating an account on sign up


var handleSignup = function handleSignup(e) {
  e.preventDefault();
  $("#errorMessageBox").animate({
    width: 'hide'
  }, 350);

  if ($("#user").val() == '' || $("#pass").val() == '' || $("#pass2").val() == '') {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax('POST', $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
}; // Login form


var LoginWindow = function LoginWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "loginForm",
      name: "loginForm",
      onSubmit: handleLogin,
      action: "/login",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username: "), /*#__PURE__*/React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "username"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "password"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Sign in"
    }))
  );
}; // Sign up form


var SignupWindow = function SignupWindow(props) {
  return (/*#__PURE__*/React.createElement("form", {
      id: "signupForm",
      name: "signupForm",
      onSubmit: handleSignup,
      action: "/signup",
      method: "POST",
      className: "mainForm"
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "username"
    }, "Username: "), /*#__PURE__*/React.createElement("input", {
      id: "user",
      type: "text",
      name: "username",
      placeholder: "username"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass"
    }, "Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass",
      type: "password",
      name: "pass",
      placeholder: "password"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("label", {
      htmlFor: "pass2"
    }, "Password: "), /*#__PURE__*/React.createElement("input", {
      id: "pass2",
      type: "password",
      name: "pass2",
      placeholder: "confirm password"
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
      id: "recaptcha",
      "class": "g-recaptcha",
      "data-sitekey": "6Lch6uwUAAAAAOvqglgMnvkmqxuOBnU8l1hnDRE_"
    }), /*#__PURE__*/React.createElement("input", {
      type: "hidden",
      name: "_csrf",
      value: props.csrf
    }), /*#__PURE__*/React.createElement("input", {
      className: "formSubmit",
      type: "submit",
      value: "Sign in"
    }))
  );
}; // Renders the login window


var createLoginWindow = function createLoginWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LoginWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
}; // Renders the sign up window


var createSignupWindow = function createSignupWindow(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(SignupWindow, {
    csrf: csrf
  }), document.querySelector("#content"));
  grecaptcha.render("recaptcha", {
    sitekey: '6Lch6uwUAAAAAOvqglgMnvkmqxuOBnU8l1hnDRE_'
  });
};

var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");
  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    createSignupWindow(csrf);
    return false;
  });
  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    createLoginWindow(csrf);
    return false;
  });
  createLoginWindow(csrf); // default view
}; // gets the CSRF token and starts app setup


var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
}; // starts the app by getting the token


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

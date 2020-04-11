// handle an error message pop up
const handleError = (message) => {
    ReactDOM.render(
        <ErrorMessage message={message} />, document.querySelector("#message")
    );

    $( "div.failure" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );

    console.log(message);
};

// handle a success message pop up
const handleSuccess = (message) => {
    ReactDOM.render(
        <SuccessMessage message={message} />, document.querySelector("#message")
    );

    $( "div.success" ).fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );

    console.log(message);
};

const ErrorMessage = (props) => {
    return(
        <div id="error" className="alert-box failure">
            <h3><span id="errorMessage">{props.message}</span></h3>
        </div>
    );
};

const SuccessMessage = (props) => {
    return(
        <div id="success" className="alert-box success">
            <h3><span id="successMessage">{props.message}</span></h3>
        </div>
    );
};

const redirect = (response) => {
    window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
    $.ajax({
        cache: false,
        type: type,
        url: action,
        data: data,
        dataType: "json",
        success: success,
        error: function(xhr, status, error) {
            var messageObj = JSON.parse(xhr.responseText);
            handleError(messageObj.error);
        }
    });
};
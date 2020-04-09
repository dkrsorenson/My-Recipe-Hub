const handleRecipe = (e) => {
    e.preventDefault();
    
    $("#message").animate({ width:'hide' }, 350);

    if($("#recipeTitle").val() == '' || $("#recipeType").val() == '' || $("#recipeIngredients").val() == '' || $("#recipeIunstructions").val() == ''){
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#recipeForm").attr("action"), $("#recipeForm").serialize(), function() {
        loadRecipesFromServer($("#csrfToken").val());
    });

    return false;
};

const RecipeForm = (props) => {
    return (
        <form id="recipeForm" name="recipeForm" onSubmit={handleRecipe} action="/addRecipe" method="POST" className="recipeForm">
            <label htmlFor="name">Title: </label>
            <input id="recipeTitle" type="text" name="title" placeholder="Recipe Title"/><br/>
            <label htmlFor="type">Type: </label>  
            <select id="recipeType" name="type">
                <option value="Appetizers">Appetizers</option>
                <option value="Soups & Salads">Soups & Salads</option>
                <option value="Sauces & Dressings">Sauces & Dressings</option>
                <option value="Meats">Meats</option>
                <option value="Meats">Seafood</option>
                <option value="Meats">Pasta</option>
                <option value="Drinks">Drinks</option>
                <option value="Desserts">Desserts</option>
            </select><br/>
            <label htmlFor="recipeIngredients">Ingredients: </label>
            <textarea id="recipeIngredients" type="text" name="ingredients" placeholder="Recipe Ingredients"></textarea><br/><br/>
            <label htmlFor="recipeInstructions">Instructions: </label>
            <textarea id="recipeInstructions" type="text" name="instructions" placeholder="Recipe Instructions"></textarea><br/>
            <input type="hidden" name="_csrf" id="csrfToken" value={props.csrf} />
            <input className="recipeSubmit formSubmit" type="submit" value="Add Recipe" />
        </form>
    );
};

const handleDelete = (e, id, csrf) => {
    e.preventDefault();

    $("#message").animate({ width:'hide' },350);

    const data = {
        _id: id,
        _csrf: csrf,
    };

    sendAjax('DELETE', $("#deleteRecipe").attr("action"), data, function(){
        loadRecipesFromServer(csrf);
    });
};

const handleRecipeEdit = (e, id, csrf) => {
    e.preventDefault();
  
    $("#message").animate({ width:'hide' },350);

    const data = {
        _id: id,
        _csrf: csrf,
    };

    sendAjax('PUT', $("#editRecipe").attr("action"), data, function(){
        loadRecipesFromServer(csrf);
    });
};


const RecipeList = function(props) {
    if(props.recipes.length === 0) {
        return (
            <div className="recipeList">
                <h3 className="emptyRecipe">No recipes yet</h3>
            </div>
        );
    }

    const recipeNodes = props.recipes.map(function(recipe) {
        return (
            <div key={recipe._id} className="recipe">
                <h3 className="recipeTitle"> Title: </h3>
                <label>{recipe.title}</label>
                <h3 className="recipeType"> Type: </h3>
                <label>{recipe.type}</label>
                <h3 className="recipeDescription"> Ingredients: </h3>
                <label>{recipe.ingredients}</label><br/>
                <h3 className="recipeDescription"> Instructions: </h3>
                <label>{recipe.instructions}</label><br/><br/><br/>
                <form id="deleteRecipe" name="deleteRecipe" onSubmit={(e) => handleDelete(e, recipe._id, props.csrf)} action="/delete" method="DELETE" >
                    <input type="hidden" name="_id" value={recipe._id}/>
                    <input type="hidden" id="csrfToken" name="_csrf" value={props.csrf}/>
                    <input className="recipeDelete" type="image" src="/assets/img/trashcan.png" />
                </form>
                <form id="editRecipe" name="editRecipe" onSubmit={(e) => handleRecipeEdit(e, recipe._id, props.csrf)} action="/editRecipe" method="PUT" >
                    <input type="hidden" name="_id" value={recipe._id}/>
                    <input type="hidden" id="csrfToken" name="_csrf" value={props.csrf}/>
                    <input className="recipeEdit" type="image" src="/assets/img/edit-icon.png" />
                </form>
            <br/>
            </div>
        );
    });

    return (
        <div className="recipeList">
            {recipeNodes}
        </div>
    );
};

const loadRecipesFromServer = (csrf) => {
    sendAjax('GET', '/getRecipes', null, (data) => {
        ReactDOM.render(
            <RecipeList recipes={data.recipes} csrf={csrf} />, document.querySelector("#content")
        );
    });
};

const createRecipeBook = (csrf) => {
    ReactDOM.render(
        <RecipeList recipes={[]} csrf={csrf} />, document.querySelector("#content")
    );

    loadRecipesFromServer(csrf);
};

const createRecipeForm = (csrf) => {
    ReactDOM.render(
        <RecipeForm csrf={csrf} />, document.querySelector("#content")
    );
};

const handlePassChange = (e) => {
    e.preventDefault();

    if($("#currentPass").val() == '' || $("#newPass1").val() == '' || $("#newPass2").val() == ''){
        handleError("All fields are required");
        return false;
    }

    sendAjax('PUT', $("#accountForm").attr("action"), $("#accountForm").serialize(), function() {
        createSuccessMessage("Successfully updated")
        $("#message").animate({ width:'hide' },350);
    });
};

const AccountForm = (props) => {
    return(
        <div>
            <form id="accountForm" name="accountForm" onSubmit={handlePassChange} action="/changePassword" method="POST" className="mainForm">
                <label htmlFor="username">Username: {props.user.username}</label><br/><br/>
                <label htmlFor="currentPass">Old Password: </label>
                <input id="currentPass" type="password" name="currentPass" placeholder="Current Password"/><br/>
                <label htmlFor="newPass1">New Password:      </label>
                <input id="newPass1" type="password" name="newPass1" placeholder="New Password"/><br/>
                <label htmlFor="newPass2">New Password:     </label>
                <input id="newPass2" type="password" name="newPass2" placeholder="Confirm Password"/><br/>
                <input type="hidden" name="_csrf" value={props.csrf}/>
                <input className="formSubmit" type="submit" value="Change Password"/>
            </form>
        </div>
    );
};

const createAccountForm = (csrf, account) => {
    ReactDOM.render(
        <AccountForm csrf={csrf} user={account} />, document.querySelector("#content")
    );
};

const ErrorMessage = (props) => {
    return(
        <div class="alert-box error">
            <h3>{props.message}</h3>
        </div>
    );
};

const createErrorMessage = (message) => {
    ReactDOM.render(
        <ErrorMessage message={message} />, document.querySelector("#message")
    );
};

const SuccessMessage = (props) => {
    return(
        <div class="alert-box success">
            <h3>{props.message}</h3>
        </div>
    );
};

const createSuccessMessage = (message) => {
    ReactDOM.render(
        <SuccessMessage message={message} />, document.querySelector("#message") 
    );
};

const setup = function(csrf) {
    const homeButton = document.querySelector("#homeButton");
    const recipeBookButton = document.querySelector("#recipeBookButton");
    const addRecipeButton = document.querySelector("#addRecipeButton");
    const accountButton = document.querySelector("#accountButton");

    homeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createRecipeBook(csrf);
        return false;
    });

    recipeBookButton.addEventListener("click", (e) => {
        e.preventDefault();
        createRecipeBook(csrf);
        return false;
    });

    addRecipeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createRecipeForm(csrf);
        return false;
    });

    accountButton.addEventListener("click", (e) => {
        e.preventDefault();
        sendAjax('GET', '/getUser', null, (data) =>{
            createAccountForm(csrf, data.user);
        });
        return false;
    });

    createRecipeBook(csrf); // default view
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

$(document).ready(function() {
    getToken();
});
const handleRecipe = (e) => {
    e.preventDefault();

    if($("#recipeTitle").val() == '' || $("#recipeType").val() == '' || $("#recipeIngredients").val() == '' || $("#recipeInstructions").val() == ''){
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
                <option value="Soups and Salads">Soups and Salads</option>
                <option value="Sauces and Dressings">Sauces and Dressings</option>
                <option value="Meats">Meats</option>
                <option value="Seafood">Seafood</option>
                <option value="Pasta">Pasta</option>
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

    const data = {
        _id: id,
        _csrf: csrf,
    };

    sendAjax('DELETE', $("#deleteRecipe").attr("action"), data, function(){
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
                <input className="recipeEdit" type="image" src="/assets/img/edit-icon.png" onClick={(e) => {createEditRecipeForm(props.csrf, recipe)}} />
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

const handleEdit = (e, id, csrf) => {
    e.preventDefault();

    const data = {
        _id: id,
        _csrf: csrf,
        recipe: {
            title: $("#recipeTitle").val(),
            type: $("#recipeType").val(),
            ingredients: $("#recipeIngredients").val(),
            instructions: $("#recipeInstructions").val(),
        },
    };

    if($("#recipeTitle").val() == '' || $("#recipeType").val() == '' || $("#recipeIngredients").val() == '' || $("#recipeInstructions").val() == ''){
        handleError("All fields are required");
        return false;
    }

    sendAjax('PUT', $("#editRecipeForm").attr("action"), data, function() {
        handleSuccess('Successfully updated recipe!');
    });

    return false;
};

const EditRecipeForm = (props) => {
    console.log(props.recipe);
    console.log(props.csrf);
    return (
        <form id="editRecipeForm" name="editRecipeForm" onSubmit={(e) => handleEdit(e, props.recipe._id, props.csrf)} action="/editRecipe" method="PUT" className="editRecipeForm">
            <label htmlFor="name">Title: </label>
            <input id="recipeTitle" type="text" name="title" placeholder="Recipe Title" defaultValue={props.recipe.title} /><br/>
            <label htmlFor="type">Type: </label>  
            <select id="recipeType" name="type" defaultValue={props.recipe.type}>
                <option value="Appetizers">Appetizers</option>
                <option value="Soups and Salads">Soups and Salads</option>
                <option value="Sauces and Dressings">Sauces and Dressings</option>
                <option value="Meats">Meats</option>
                <option value="Seafood">Seafood</option>
                <option value="Pasta">Pasta</option>
                <option value="Drinks">Drinks</option>
                <option value="Desserts">Desserts</option>
            </select><br/>
            <label htmlFor="recipeIngredients">Ingredients: </label>
            <textarea id="recipeIngredients" type="text" name="ingredients" placeholder="Recipe Ingredients">{props.recipe.ingredients}</textarea><br/><br/>
            <label htmlFor="recipeInstructions">Instructions: </label>
            <textarea id="recipeInstructions" type="text" name="instructions" placeholder="Recipe Instructions">{props.recipe.instructions}</textarea><br/>
            <input type="hidden" name="_csrf" id="csrfToken" value={props.csrf} />
            <input className="recipeSubmit formSubmit" type="submit" value="Edit Recipe" />
        </form>
    );
};

const createEditRecipeForm = (csrf, recipe) => {
    ReactDOM.render(
        <EditRecipeForm csrf={csrf} recipe={recipe} />, document.querySelector("#content")
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

    if($("#newPass1").val() !== $("#newPass2").val()) {
        handleError("Passwords do not match");
        return false;
    }

    sendAjax('PUT', $("#accountForm").attr("action"), $("#accountForm").serialize(), function() {
        handleSuccess('Successfully changed password!');
    });
};

const AccountForm = (props) => {
    return(
        <div>
            <form id="accountForm" name="accountForm" onSubmit={handlePassChange} action="/changePassword" method="PUT" className="mainForm">
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
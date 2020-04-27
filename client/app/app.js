let currentType = "All"; 

// handles creating a new recipe
const handleRecipe = (e) => {
    e.preventDefault();

    if($("#recipeTitle").val() == '' || $("#recipeType").val() == '' || $("#recipeIngredients").val() == '' || $("#recipeInstructions").val() == ''){
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#recipeForm").attr("action"), $("#recipeForm").serialize(), function() {
        loadRecipesFromServer($("#csrfToken").val(), "All");
    });

    return false;
};

// handles deleting a recipe
const handleDelete = (e, id, csrf) => {
    e.preventDefault();

    const data = {
        _id: id,
        _csrf: csrf,
    };

    sendAjax('DELETE', $("#deleteRecipe").attr("action"), data, function(){
        loadRecipesFromServer(csrf, currentType);
    });
};

// handles an account password change
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

// handles an edit / change to a recipe
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

// The form to add recipes
const RecipeForm = (props) => {
    return (
        <form id="recipeForm" name="recipeForm" onSubmit={handleRecipe} action="/addRecipe" method="POST" className="recipeForm">
            <label htmlFor="name">Title: </label>
            <input id="recipeTitle" type="text" name="title" placeholder="Recipe Title"/><br/>
            <label htmlFor="type">Type: </label>  
            <select id="recipeType" name="type">
                <option value="Appetizers">Appetizers</option>
                <option value="Side Dishes">Side Dishes</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Soups and Salads">Soups and Salads</option>
                <option value="Sauces and Dressings">Sauces and Dressings</option>
                <option value="Meats">Meats</option>
                <option value="Seafood">Seafood</option>
                <option value="Pasta">Pasta</option>
                <option value="Sandwiches">Sandwiches</option>
                <option value="Drinks">Drinks</option>
                <option value="Desserts">Desserts</option>
                <option value="Miscellaneous">Miscellaneous</option>
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

// The form to list recipes
const RecipeList = function(props) {
    if(props.recipes.length === 0) {
        return (
            <div className="recipeList">
                <h3 className="emptyRecipe">No recipes yet</h3>
            </div>
        );
    }

    let recipes = props.recipes;
    
    // filter recipes if necessary
    if(props.selectedType !== "All")
    {
        recipes = recipes.filter(function(recipe) {
            return recipe.type === props.selectedType;
        });
    }

    // ensure filtered list isn't empty
    if(recipes.length === 0) {
        return (
            <div className="recipeList">
                <h3 className="emptyRecipe">No recipes yet</h3>
            </div>
        );
    }

    const recipeNodes = recipes.map(function(recipe) {
        return (
            <div className="column col">
                <div key={recipe._id} className="recipe">
                    <h3 className="recipeTitle"> Title: </h3>
                    <label>{recipe.title}</label>
                    <h3 className="recipeType"> Type: </h3>
                    <label>{recipe.type}</label>
                    <div className="recipeRow">
                        <div id="ingredients" className="recipeColumn">
                            <h3 className="recipeIngredients"> Ingredients: </h3>
                            <label>{recipe.ingredients}</label>
                        </div>
                        <div id="instructions" className="recipeColumn">
                            <h3 className="recipeInstructions"> Instructions: </h3>
                            <label>{recipe.instructions}</label>
                        </div>
                    </div>
                    <form id="deleteRecipe" name="deleteRecipe" onSubmit={(e) => handleDelete(e, recipe._id, props.csrf)} action="/delete" method="DELETE" >
                        <input type="hidden" name="_id" value={recipe._id}/>
                        <input type="hidden" id="csrfToken" name="_csrf" value={props.csrf}/>
                        <input className="recipeDelete" type="image" src="/assets/img/trashcan.png" />
                    </form>
                    <input className="recipeEdit" type="image" src="/assets/img/edit-icon.png" onClick={(e) => {createEditRecipeForm(props.csrf, recipe)}} />
                    <br/>
                </div>
            </div>
        );
    });

    return (
        <div className="recipeList">
            <div className="row wrap">
                {recipeNodes}
            </div>
        </div>
    );
};

// side navigation for filtering recipes by type
const RecipeTypeSideNav = function(props) {
    return (
        <div id="filterNav" className="filterSideNav">
            <h2>Filter Type</h2>
            <input className="recipeFilter" type="submit" onClick={(e) => {createRecipeBook(props.csrf, "All")}} value="All"/>
            <input className="recipeFilter" type="submit" onClick={(e) => {createRecipeBook(props.csrf, "Appetizers")}} value="Appetizers"/>
            <input className="recipeFilter" type="submit" onClick={(e) => {createRecipeBook(props.csrf, "Side Dishes")}} value="Side Dishes"/>
            <input className="recipeFilter" type="submit" onClick={(e) => {createRecipeBook(props.csrf, "Breakfast")}} value="Breakfast"/>
            <input className="recipeFilter" type="submit" onClick={(e) => {createRecipeBook(props.csrf, "Lunch")}} value="Lunch"/>
            <input className="recipeFilter" type="submit" onClick={(e) => {createRecipeBook(props.csrf, "Soups and Salads")}} value="Soups and Salads"/>
            <input className="recipeFilter" type="submit" onClick={(e) => {createRecipeBook(props.csrf, "Sauces and Dressings")}} value="Sauces and Dressings"/>
            <input className="recipeFilter" type="submit" onClick={(e) => {createRecipeBook(props.csrf, "Meats")}} value="Meats"/>
            <input className="recipeFilter" type="submit" onClick={(e) => {createRecipeBook(props.csrf, "Seafood")}} value="Seafood"/>
            <input className="recipeFilter" type="submit" onClick={(e) => {createRecipeBook(props.csrf, "Pasta")}} value="Pasta"/>
            <input className="recipeFilter" type="submit" onClick={(e) => {createRecipeBook(props.csrf, "Sandwiches")}} value="Sandwiches"/>
            <input className="recipeFilter" type="submit" onClick={(e) => {createRecipeBook(props.csrf, "Drinks")}} value="Drinks"/>
            <input className="recipeFilter" type="submit" onClick={(e) => {createRecipeBook(props.csrf, "Desserts")}} value="Desserts"/>
            <input className="recipeFilter" type="submit" onClick={(e) => {createRecipeBook(props.csrf, "Miscellaneous")}} value="Miscellaneous"/>
        </div>
    );
};

// displays hambuger icon for expanding the recipe types side nav
const RecipeTypeSpan = function() {
    return (
        <span id="hamburgerIcon" className="hamburger" onClick={openNav}>&#9776;</span>
    );
}

// opens the recipe types menu
function openNav() {
    if (document.getElementById("hamburgerIcon").style.marginRight === "240px")
    {
        closeNav();
    }
    else {
        document.getElementById("filterNav").style.width = "250px";
        document.getElementById("hamburgerIcon").style.marginRight = "240px";
        document.getElementById("content").style.marginRight = "275px";
    }
}

// closes the recipe types menu
function closeNav() {
    document.getElementById("filterNav").style.width = "0";
    document.getElementById("hamburgerIcon").style.marginRight= "15px";
    document.getElementById("content").style.marginRight= "50px";
}

// the form to edit recipes
const EditRecipeForm = (props) => {
    return (
        <form id="editRecipeForm" name="editRecipeForm" onSubmit={(e) => handleEdit(e, props.recipe._id, props.csrf)} action="/editRecipe" method="PUT" className="editRecipeForm">
            <label htmlFor="name">Title: </label>
            <input id="recipeTitle" type="text" name="title" placeholder="Recipe Title" defaultValue={props.recipe.title} /><br/>
            <label htmlFor="type">Type: </label>  
            <select id="recipeType" name="type" defaultValue={props.recipe.type}>
                <option value="Appetizers">Appetizers</option>
                <option value="Side Dishes">Side Dishes</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Soups and Salads">Soups and Salads</option>
                <option value="Sauces and Dressings">Sauces and Dressings</option>
                <option value="Meats">Meats</option>
                <option value="Seafood">Seafood</option>
                <option value="Pasta">Pasta</option>
                <option value="Sandwiches">Sandwiches</option>
                <option value="Drinks">Drinks</option>
                <option value="Desserts">Desserts</option>
                <option value="Miscellaneous">Miscellaneous</option>
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

// the form to change the account password
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

// creates the form to edit recipes
const createEditRecipeForm = (csrf, recipe) => {
    ReactDOM.render(
        <EditRecipeForm csrf={csrf} recipe={recipe} />, document.querySelector("#content")
    );

    if (document.getElementById("hamburgerIcon").style.marginRight === "240px")
    {
        closeNav();
    }

    document.getElementById('typeSpan').style.display = 'none';
    document.getElementById('typeSideNav').style.display = 'none';
};

// loads all recipes to the recipe list
const loadRecipesFromServer = (csrf, type) => {
    var element = document.getElementById('typeSpan');

    if (typeof(element) != 'undefined' && element != null)
    {
        document.getElementById('typeSpan').style.display = 'block';
        document.getElementById('typeSideNav').style.display = 'block';
    }

    sendAjax('GET', '/getRecipes', null, (data) => {
        ReactDOM.render(
            <RecipeList recipes={data.recipes} csrf={csrf} selectedType={type} />, document.querySelector("#content")
        );
    });
};

// creates the recipe list 
const createRecipeBook = (csrf, type) => {
    ReactDOM.render(
        <RecipeList recipes={[]} csrf={csrf} selectedType={type} />, document.querySelector("#content")
    );

    ReactDOM.render(
        <RecipeTypeSideNav csrf={csrf} />, document.querySelector("#typeSideNav")
    );
    
    ReactDOM.render(
        <RecipeTypeSpan />, document.querySelector("#typeSpan")
    );

    currentType = type;

    loadRecipesFromServer(csrf, type);
};

// creates the form to add recipes
const createRecipeForm = (csrf) => {
    ReactDOM.render(
        <RecipeForm csrf={csrf} />, document.querySelector("#content")
    );

    if (document.getElementById("hamburgerIcon").style.marginRight === "240px")
    {
        closeNav();
    }

    document.getElementById('typeSpan').style.display = 'none';
    document.getElementById('typeSideNav').style.display = 'none';
};

// creates the form for account data / password changes
const createAccountForm = (csrf, account) => {
    ReactDOM.render(
        <AccountForm csrf={csrf} user={account} />, document.querySelector("#content")
    );
    
    if (document.getElementById("hamburgerIcon").style.marginRight === "240px")
    {
        closeNav();
    }

    document.getElementById('typeSpan').style.display = 'none';
    document.getElementById('typeSideNav').style.display = 'none';
};

// sets up the events and page
const setup = function(csrf) {
    const homeButton = document.querySelector("#homeButton");
    const recipeBookButton = document.querySelector("#recipeBookButton");
    const addRecipeButton = document.querySelector("#addRecipeButton");
    const accountButton = document.querySelector("#accountButton");

    homeButton.addEventListener("click", (e) => {
        e.preventDefault();
        createRecipeBook(csrf, "All");
        return false;
    });

    recipeBookButton.addEventListener("click", (e) => {
        e.preventDefault();
        createRecipeBook(csrf, "All");
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

    createRecipeBook(csrf, "All"); // default view
};

// gets the CSRF token
const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

// start by getting the token
$(document).ready(function() {
    getToken();
});
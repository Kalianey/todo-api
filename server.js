var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

//TODO Collection
var todos = [];
//not safe, just for this example
var todoNextId = 1;

// ROOT
app.get('/', function(req, res) {
    res.send('Todo API Root');
});


// GET /todos
app.get('/todos', function(req, res) {
    var queryParams = req.query;
    var filteredTodos = todos;

    if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
        filteredTodos = _.where(filteredTodos, {completed: true});
    } 
    else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
        filteredTodos = _.where(filteredTodos, {completed: false});
    }

    //our todos collection is converted into json and sent to the API
    res.json(filteredTodos);
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
    //res.send('Asking for todo with id of ' + req.params.id); 
    var todoId = parseInt(req.params.id, 10);
    //find our todo using Underscore lib
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }

});


// POST /todos --- Add a TODO
app.post('/todos', function(req, res) {
    //Underscore method to accept only the set arguments
    var todo = _.pick(req.body, 'description', 'completed');

    if (!_.isBoolean(todo.completed) || !_.isString(todo.description) || todo.description.trim().length === 0) {
        return res.status(400).send();
    }

    //Trim body.description
    todo.description = todo.description.trim();

    //first set todoNextid to body.id, then increment it
    todo.id = todoNextId++;

    todos.push(todo);

    res.json(todo);
});

// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });

    if (!matchedTodo) {
        res.status(404).json({
            "error": "no todo found with that id"
        });
    } else {
        todos = _.without(todos, matchedTodo);
        res.json(matchedTodo);
    }

});


// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
    var todoId = parseInt(req.params.id, 10);
    var matchedTodo = _.findWhere(todos, {
        id: todoId
    });
    var todo = _.pick(req.body, 'description', 'completed');
    var validAttributes = {};

    if (todo.hasOwnProperty('completed') && _.isBoolean(todo.completed)) {
        validAttributes.completed = todo.completed;
    } else if (todo.hasOwnProperty('completed')) {
        //the property exists but it's not a boolean
        return res.status(400).send();
    }

    if (todo.hasOwnProperty('description') && _.isString(todo.completed) && todo.description.trim().length() > 0) {
        validAttributes.completed = todo.description;
    } else if (todo.hasOwnProperty('description')) {
        //the property exists but it's not a boolean
        return res.status(400).send();
    }

    // Copy properties from one obj to another, as obj in javascript are passed by ref and not by value
    _.extend(matchedTodo, validAttributes);
    res.json(matchedTodo);
});


app.listen(PORT, function() {
    console.log('Express listening on port ' + PORT + '!');
});
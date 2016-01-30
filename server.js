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
app.get('/', function (req, res) {
    res.send('Todo API Root');
});


// GET /todos
app.get('/todos', function (req, res) {
    //our todos collection is converted into json and sent to the API
    res.json(todos); 
});

// GET /todos/:id
app.get('/todos/:id', function (req, res) {
    //res.send('Asking for todo with id of ' + req.params.id); 
    var todoId = parseInt(req.params.id, 10);
    //find our todo using Underscore lib
    var matchedTodo = _.findWhere(todos, {id: todoId});
    
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
    
});


// POST /todos --- Add a TODO
app.post('/todos', function (req, res) {
    //Underscore method to accept only the set arguments
    var todo = _.pick(req.body, 'description', 'completed');
    
    if(!_.isBoolean(todo.completed) || !_.isString(todo.description) || todo.description.trim().length === 0 ) {
        return res.status(400).send();   
    } 
    
    //Trim body.description
    todo.description = todo.description.trim();
    
    //first set todoNextid to body.id, then increment it
    todo.id = todoNextId++;
    
    todos.push(todo);
    
    res.json(todo);
});


app.listen(PORT, function () {
    console.log('Express listening on port '+PORT+'!');
});


//TODO Model
//    {
//    id: 1,
//    description : 'Learn Angular.js',
//    completed: false
//    }, 
//    {
//    id: 2,
//    description : 'Do Mean Stack course',
//    completed: false  
//    }


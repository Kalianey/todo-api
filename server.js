var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

//TODO Collection
var todos = [
    //TODO Model
    {
    id: 1,
    description : 'Learn Angular.js',
    completed: false
    }, 
    {
    id: 2,
    description : 'Do Mean Stack course',
    completed: false  
    }
];

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
    var matchedTodo;
    
//    for (var i=0; i < todos.length; i++) {
//        if (todos[i].id === todoId) {
//            matchedTodo = todos[i];
//        }
//    }
    
    todos.forEach(function (todo) {
        if (todoId === todo.id) {
            matchedTodo = todo;
        }
    });
    
    if (matchedTodo) {
        res.json(matchedTodo);
    } else {
        res.status(404).send();
    }
    
});


app.listen(PORT, function () {
    console.log('Express listening on port '+PORT+'!');
});
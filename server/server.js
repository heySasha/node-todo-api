const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });

    todo.save().then(doc => {
        res.send(doc);
    }, err => {
        res.status(400).send(err);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then(todos => {
        res.send({ todos });
    }, err => {
        return res.status(400).send(err);
    })
});

app.patch('/todos/:id', (req, res) => {
    const { id } = req.params;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo })
    }, err => {
        return res.status(400).send(err);
    })
});

app.listen(PORT, () => {
    console.log(`Started on port ${PORT}`);
});

module.exports = { app };
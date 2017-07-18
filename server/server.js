require('./config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const PORT = process.env.PORT;

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
        return res.status(400).send();
    })
});

app.get('/todos/:id', (req, res) => {
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
        return res.status(400).send();
    })
});

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo })
    }, err => {
        return res.status(400).send();
    })
});

app.patch('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { text, completed } = req.body;
    const body = Object.create(null);
    if (text) {
        body.text = text;
    }
    if (completed) {
        body.completed = completed;
    }

    if(!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (typeof(completed) === 'boolean' && completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, {
        new: true
    }).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({ todo });
    }, err => {
        res.status(400).send();
    })
});

app.listen(PORT, () => {
    console.log(`Started on port ${PORT}`);
});

module.exports = { app };
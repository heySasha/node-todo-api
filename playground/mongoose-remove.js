const { ObjectID } = require('mongodb');

const { mongoose } = require('../server/db/mongoose');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const id = '596def52967cdb1a58c77555';

// Todo.remove({}).then(result => {
//     console.log(result);
// });

// Todo.findOneAndRemove({ _id : id }).then(todo => {
//     console.log(todo)
// });

Todo.findByIdAndRemove(id).then(todo => {
    console.log(todo);
});
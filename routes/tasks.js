const express = require('express');
const router = express.Router();
const pool = require('../database');
/* 
    BASE URL /tasks
    GET / - Get all tasks
    POST / - Create a new task
    GET /:id - Get a task by id
    PUT /:id - Update a task by id
    DELETE /:id - Delete a task by id
*/
router.get('/', async (req, res, next) => {
    let errors;
    if (req.session.errors) {
        errors = req.session.errors;
        req.session.errors = null;
    }
    await pool.promise()
        .query('SELECT * FROM tasks ORDER BY updated_at DESC')
        .then(([rows, fields]) => {
            res.render('tasks.njk', {
                errors: errors,
                tasks: rows,
                title: 'Tasks',
                layout: 'layout.njk',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                tasks: {
                    error: 'Error getting tasks'
                }
            })
        });
});

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    if (isNaN(req.params.id)) {
        res.status(400).json({
            task: {
                error: 'Bad request'
            }
        });
    }
    await pool.promise()
        .query('SELECT * FROM tasks WHERE id = ?', [id])
        .then(([rows, fields]) => {
            res.json({
                task: {
                    data: rows
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                task: {
                    error: 'Error getting tasks'
                }
            })
        });
});

router.get('/:id/delete', async (req, res, next) => {
    const id = req.params.id;
    // res.json(`deleting task ${id}`);
    if (isNaN(req.params.id)) {
        res.status(400).json({
            task: {
                error: 'Bad request'
            }
        });
    }
    await pool.promise()
    .query('DELETE FROM tasks WHERE id = ?', [id])
    .then((response) => {
        if (response[0].affectedRows === 1) {
            res.redirect('/tasks');
        } else {
            res.status(400).json({
                task: {
                    error: 'Task does not exist'
                }
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            task: {
                error: 'Error getting tasks'
            }
        })
    });
});

router.post('/', async (req, res, next) => {
    // { "task": "koda post" }
    const task = req.body.task;

    if (task.length < 3) {
        // res.status(400).json({
        //     task: {
        //         error: 'A task must have at least 3 characters'
        //     }
        // });
        req.session.errors = { 
            task: {
                error: 'A task must have at least 3 characters',
                value: task
            },
        };
        return res.status(400).redirect('/tasks');
    }

    await pool.promise()
    .query('INSERT INTO tasks (task) VALUES (?)', [task])
    .then((response) => {
        console.log(response[0].affectedRows);
        if (response[0].affectedRows === 1) {
            res.redirect('/tasks');
        } else {
            res.status(400).json({
                task: {
                    error: 'Invalid task'
                }
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            task: {
                error: 'Error getting tasks'
            }
        })
    });
    
    
    // res.json(req.body);

});


module.exports = router;



/*

    await pool
    .promise()
    .query('SELECT * FROM users')
    .then(([rows, fields]) => {
        res.json({
            data: rows,
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
            error: 'Database error',
        });
    });

    */
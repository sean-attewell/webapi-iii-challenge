const express = require('express');
const routes = express.Router();
const Posts = require('./data/helpers/postDb');

routes.use(express.json());


routes.post('/', async (req, res) => {
    if (!req.body.text || !req.body.user_id) {
        res.status(400).json({ errorMessage: "Please provide text and user_id for the post." });
    } else {
    try {
        const post = await Posts.insert(req.body);
        res.status(201).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "There was an error while saving the post to the database" });
    }
}});


routes.get('/', (req, res) => {
    Posts.get()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        });
})

routes.get('/:id', async (req, res) => {
    try {
        const post = await Posts.getById(req.params.id);

        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The post information could not be retrieved." });
    }
});

routes.delete('/:id', async (req, res) => {
    try {
        const numberDeleted = await Posts.remove(req.params.id);
        if (numberDeleted > 0) {
            res.status(200).json({ message: `Post ${req.params.id} has been deleted.` });
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The post could not be removed" });
    }
});


routes.put('/:id', async (req, res) => {
    const { id } = req.params; // rather than write req.params.id each time
    if (!req.body.text || !req.body.user_id) {
        res.status(400).json({ errorMessage: "Please provide text and user_id for the post." });
    } else {
    try {
        const numberUpdated = await Posts.update(id, req.body);
        if (numberUpdated > 0) {
            const updatedPost = await Posts.getById(id)
            res.status(200).json(updatedPost);
        } else {
            res.status(404).json({ message: `The post with ID ${id} does not exist.` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The post information could not be modified." });
    }
}});

module.exports = routes;
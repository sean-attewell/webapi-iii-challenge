const express = require('express');
const routes = express.Router();
const Users = require('./data/helpers/userDb');
const Posts = require('./data/helpers/postDb');

routes.use(express.json());


routes.post('/', async (req, res) => {
    if (!req.body.name) {
        res.status(400).json({ errorMessage: "Please provide name for the user." });
    } else {
    try {
        const post = await Users.insert(req.body);
        res.status(201).json(post);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "There was an error while saving the user to the database" });
    }
}});

routes.get('/', (req, res) => {
    Users.get()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(err => {
            res.status(500).json({ error: "The users information could not be retrieved." })
        });
})

routes.get('/:id', async (req, res) => {
    try {
        const user = await Users.getById(req.params.id);

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The user information could not be retrieved." });
    }
});

routes.delete('/:id', async (req, res) => {
    // need to delete the posts first
    const posts = await Users.getUserPosts(req.params.id)
    await posts.forEach( async (post) => {
        await Posts.remove(post.id)
    });

    try {
        const numberDeleted = await Users.remove(req.params.id);
        if (numberDeleted > 0) {
            res.status(200).json({ message: `User ${req.params.id} has been deleted.` });
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The user could not be removed" });
    }
});

routes.put('/:id', async (req, res) => {
    const { id } = req.params; // rather than write req.params.id each time
    if (!req.body.name) {
        res.status(400).json({ errorMessage: "Please provide name for the user." });
    } else {
    try {
        const numberUpdated = await Users.update(id, req.body);
        if (numberUpdated > 0) {
            const updatedPost = await Users.getById(id)
            res.status(200).json(updatedPost);
        } else {
            res.status(404).json({ message: `The post with ID ${id} does not exist.` });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The post information could not be modified." });
    }
}});

// list of posts for a user
routes.get('/:id/corpus', async (req, res) => {
    try {
        const posts = await Users.getUserPosts(req.params.id)

        if (posts.length > 0) {
            res.status(200).json(posts);
        } else {
            res.status(404).json({ message: "The user with the specified ID does not exist, or has no posts." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "The user information could not be retrieved." });
    }
});

module.exports = routes;
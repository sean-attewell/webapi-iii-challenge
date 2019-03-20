const express = require('express');
const postsRoutes = require('./postsRoutes')
const usersRoutes = require('./usersRoutes')

const server = express();

server.use('/api/posts', postsRoutes);
server.use('/api/users', usersRoutes);

module.exports = server;

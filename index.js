const express = require('express');
const bodyParser = require('body-parser');
const { posts, comments } = require('./posts');
const app = express();



app.use(bodyParser.json());

app.get('/api/posts', (req, res) => {
    res.send({data: posts});
});

app.get('/api/posts/:id', (req, res) => {
    const postId = req.params.id;
    console.log('postId:', postId)

    const postObj = posts.find(obj => obj.id == postId);

    res.send({data: postObj});
});

app.get('/api/posts/:id/comments', (req, res) => {
    const postId = req.params.id;
    console.log('postId:', postId);

    const commentsArray = comments.filter(cm => cm.post == postId);

    res.send({data: commentsArray});
});

app.get('/api/tags/:name', (req, res) => {
    const name = req.params.name;
    console.log('name:', name);

    let response = [];

    for (const postObj of posts) {
        if (postObj.tags?.includes(name)) {
            response.push(postObj);
        }
        
    }
    res.send(response);
});


app.use(express.static('public'));

app.use('/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

app.get('/api/*', (req, res) => {
    res.status(400).send('An error occurred!');
});

app.listen(3000);
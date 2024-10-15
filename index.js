const express = require('express');
const bodyParser = require('body-parser');
const { posts, comments } = require('./posts');
const app = express();

const PORT = 3000;

app.use(bodyParser.json());

app.get('/api/posts', (req, res) => {
    res.send({data: posts});
});

const postMiddleware = (req, res, next) => {
    const postId = req.params.id;
    const postObj = posts.find(obj => obj.id == postId);
    if (postObj) {
        req.postObj = postObj;
        next()
    } else {
        res.status(404).send(`There's no post with id ${postId}`);
    }
};

app.get('/api/posts/:id', postMiddleware, (req, res) => {
    const postId = req.params.id;
    const postObj = req.postObj

    if (postObj) {
        res.send({data: postObj});
    } else {
        res.status(404).send(`There's no post with id ${postId}`);
    }
    
});

app.get('/api/posts/:id/comments', postMiddleware, (req, res) => {
    const postId = req.params.id;
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

app.use('/api/*', (req, res) => {
    res.status(400).send('An error occurred!');
});

app.use('/*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
});

app.listen(PORT, () => {
    console.log(`Application is listening on port ${PORT}`);
    
});
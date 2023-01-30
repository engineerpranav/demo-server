require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan=require('morgan');
const authRouter = require('./routes/auth');
const connectDatabase = require('./database/connectDatabase');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');

const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

function logRequest(req, res, next) {
    next();
    console.log(new Date(), req.method, req.url); // 1
}

app.use(logRequest);

 
console.log(1);

app.use('/api/auth', authRouter);
app.use('/api/post', postRouter);
app.use('/api/comment', commentRouter);



// app.use('/', express.static('static')); 

const port = process.argv[2] || 3035;

connectDatabase()
.then(() => {
    app.listen(port, () => {
        console.log(`Server listening to http requests on http://localhost:${port}`)
    })
})
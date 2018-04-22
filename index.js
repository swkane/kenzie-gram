const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();

app.use(express.static('./public'));
app.use(express.json());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const uploaded_files = [];

const uploads = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, path.join(__dirname, 'public', 'uploads')),
        filename: (req, file, cb) => cb(null, file.originalname)
    })
});

const uploadDir = path.join(__dirname, "public", "uploads");

app.get('/', (req, res) => {
    let feed = ``;
    let files = fs.readdir(uploadDir, function(err, files) {
        console.log(files);
        for (let i = 0; i < files.length; i++) {
            var modified = fs.statSync(path.join(uploadDir, files[i])).mtimeMs;
            console.log(modified);
        }
        res.render("index", { files });
    });
});

app.post('/latest', (req, res) => {
    let response = {
        images: [],
        timestamp: 0
    };
    let files = fs.readdir(uploadDir, function(err, files) {
        console.log(files);
        for (let i = 0; i < files.length; i++) {
            var modified = fs.statSync(path.join(uploadDir, files[i])).mtimeMs;
            if (modified > req.body.after) {
                response.images.push(files[i]);
                if (modified > response.timestamp) {
                    response.timestamp = modified;
                }
            }
        }
        res.send(response);
    });
});

app.post('/upload', uploads.single('image'), function(req, res, next) {
    console.log(`Uploaded: ${req.file.filename}`);
    uploaded_files.push(req.file.filename);
    res.send(`
        <h1>Uploaded File</h1>
        <a href="/"><button>Back<button></a><br />
        <img src=uploads/${req.file.filename} height=100px>
    `);
});


app.listen(3000, () => {
    console.log("oh this server is running alright");
});
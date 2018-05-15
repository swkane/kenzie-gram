const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();

app.use(express.static('./public'));
app.use(express.json());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

let PORT = process.env.PORT || 3000;

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
        console.log("all files", files);
        for (let i = 0; i < files.length; i++) {
            var modified = fs.statSync(path.join(uploadDir, files[i])).mtimeMs;
            console.log(modified);
        }
        res.render("index", { files });
    });
});

let latestResponse = {
    images: [],
    timestamp: 0
};

app.post('/latest', (req, res) => {
    // the reason we have to pull latestResponse out of the request handler but reset images, is because we do not want to reset the timestamp every time, but we do want to clear out the images
    latestResponse.images = [];
    let files = fs.readdir(uploadDir, function(err, files) {
        // could also use forEach or filter
        for (let i = 0; i < files.length; i++) {
            var modified = fs.statSync(path.join(uploadDir, files[i])).mtimeMs;
            if (modified > req.body.after) {
                latestResponse.images.push(files[i]);
                if (modified > latestResponse.timestamp) {
                    latestResponse.timestamp = modified;
                }
            }
        }
        console.log("response: ", latestResponse);
        res.send(latestResponse);
    });
});

app.post('/upload', uploads.single('image'), function(req, res, next) {
    console.log(`Uploaded: ${req.file.filename}`);
    uploaded_files.push(req.file.filename);
    res.send(`
        <h1>Uploaded File</h1>
        <a href="/"><button>Back<button></a><br />
        <img src=uploads/${req.file.filename} height=150px>
    `);
});


app.listen(PORT, () => {
    console.log("oh this server is running alright");
});
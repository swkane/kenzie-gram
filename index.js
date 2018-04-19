const express = require('express');
const fs = require('fs');
const multer = require('multer');

const app = express();
const upload = multer({ dest: 'public/uploads/' });
app.set('views', './views');
app.set('view engine', 'pug');

const uploaded_files = [];

app.use(express.static('./public'));

app.get('/', (req, res) => {
    const path = './public/uploads';
    let feed = ``;
    fs.readdir(path, function(err, items) {
        console.log(items);
        for (let i = 0; i < items.length; i++) {
            feed += `<img src=/uploads/${items[i]} height=150px><br />`;
        }
        res.send(
            `<h1>Welcome to Kenziegram</h1>
            <form action="/upload" method="post" enctype="multipart/form-data">
                <input type="file" name="image" />
                <input type="submit" />
            </form>
            ${feed} 
            `
        );
    })
});

app.post('/upload', upload.single('image'), function(req, res, next) {
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
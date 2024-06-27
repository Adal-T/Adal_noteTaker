const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(express.static('public'));

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const parsedData = JSON.parse(data);
        req.body.id = Math.floor(Math.random()*1000000).toString();
        parsedData.push(req.body);
        fs.writeFile('./db/db.json', JSON.stringify(parsedData), (err) => {
            if (err) throw err;
            res.json(parsedData);
        });
    })
});

app.delete('/api/notes/:id', (req, res) => {
    console.log(req.params.id);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) throw err;
        const parsedData = JSON.parse(data);
        const filteredNotes = parsedData.filter(note => note.id !== req.params.id);
        console.log(filteredNotes);
        fs.writeFile('./db/db.json', JSON.stringify(filteredNotes), (err) => {
            if (err) throw err;
            res.json(filteredNotes);
        });
    })
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
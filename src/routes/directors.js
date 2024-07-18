const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const directorsFilePath = path.join(__dirname, "../../data/directors.json");

// Leer directores

const readDirectors = () => {
    const directorsData = fs.readFileSync(directorsFilePath);
    return JSON.parse(directorsData);
};

// Escribir directores en el archivo

const writeDirectors = (directors) => {
    fs.writeFileSync(directorsFilePath, JSON.stringify(directors, null, 2));
};

// Crear un nuevo director
router.post("/", (req, res) => {
    const directors = readDirectors();
    const newDirector = {
        id: directors.length + 1,
        name: req.body.name,
    };
    directors.push(newDirector);
    writeDirectors(directors);
    res.status(201).json({ message: "Director creado satisfactoriamente.", director: newDirector });
});

// Obtener todos los directores
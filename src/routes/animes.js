const express = require("express");
const fs = require("fs");
const path = require("path");


const router = express.Router();
const animesFilePath = path.join(__dirname, "../../data/animes.json");

// Leer animes

const readAnimes = () => {
    const animesData = fs.readFileSync(animesFilePath);
    return JSON.parse(animesData);
};

// Escribir animes en el archivo

const writeAnimes = (animes) => {
    fs.writeFileSync(animesFilePath, JSON.stringify(animes, null, 2));
};

// Crear un nuevo anime
router.post("/", (req, res) => {
    const animes = readAnimes();
    // console.log(animes)
    const newAnime = {
        id: animes.length + 1,
        title: req.body.title,
        genre: req.body.genre,
        studioId: req.body.studioId,
    };
    animes.push(newAnime);
    writeAnimes(animes);
    res.status(201).json({ message: "Anime creado exitosamente.", anime: newAnime });
});

// Obtener todos los animes
router.get("/", (req, res) => {
    const animes = readAnimes();
    res.json(animes);
});

// Obtener anime por ID
router.get("/:id", (req, res) => {
    const animes = readAnimes();
    const anime = animes.find((a) => a.id === parseInt(req.params.id));
    if (!anime) {
        return res.status(404).json({ message: "Anime no encontrado" });
    }
    res.json(anime);
});

// Actualizar un anime por ID
router.put("/:id", (req, res) => {
    const animes = readAnimes();
    const animeIndex = animes.findIndex((a) => a.id === parseInt(req.params.id));
    if (animeIndex === -1) {
        return res.status(404).json({ message: "Anime no encontrado." });
    }
    const updateAnime = {
        ...animes[animeIndex],
        title: req.body.title,
        genre: req.body.genre,
        studioId: req.body.studioId,
    };
    animes[animeIndex] = updateAnime;
    writeAnimes(animes);
    res.json({ message: "Anime actualizado exitosamente", anime: updateAnime });
});

// Eliminar un anime por ID
router.delete("/:id", (req, res) => {
    const animes = readAnimes();
    const newAnimes = animes.filter((a) => a.id !== parseInt(req.params.id));
    if (animes.length === newAnimes.length) {
        return res.status(404).json({ message: "Anime no encontrado" });
    }
    writeAnimes(newAnimes);
    res.json({ message: "Anime eliminado exitosamente" });
});

module.exports = router;
const express = require("express");
const fs = require("fs");
const path = require("path");


const router = express.Router();
const charactersFilePath = path.join(__dirname, "../../data/characters.json");

// Leer personajes

const readCharacters = () => {
    const charactersData = fs.readFileSync(charactersFilePath);
    return JSON.parse(charactersData);
};

// Escribir personajes en el archivo

const writeCharacters = (characters) => {
    fs.writeFileSync(charactersFilePath, JSON.stringify(characters, null, 2));
};

// Crear un nuevo personaje
router.post("/", (req, res) => {
    const characters = readCharacters();
    // console.log(characters)
    const newCharacter = {
        id: characters.length + 1,
        name: req.body.name,
        animeId: req.body.animeId,
    };
    characters.push(newCharacter);
    writeCharacters(characters);
    res.status(201).json({ message: "Personaje creado exitosamente.", character: newCharacter });
});

// Obtener todos los personajes
router.get("/", (req, res) => {
    const characters = readCharacters();
    res.json(characters);
});

// Obtener personaje por ID
router.get("/:id", (req, res) => {
    const characters = readCharacters();
    const character = characters.find((c) => c.id === parseInt(req.params.id));
    if (!character) {
        return res.status(404).json({ message: "Personaje no encontrado" });
    }
    res.json(character);
});

// Actualizar un personaje por ID
router.put("/:id", (req, res) => {
    const characters = readCharacters();
    const characterIndex = characters.findIndex((c) => c.id === parseInt(req.params.id));
    if (characterIndex === -1) {
        return res.status(404).json({ message: "Personaje no encontrado." });
    }
    const updateCharacter = {
        ...characters[characterIndex],
        name: req.body.name,
        animeId: req.body.animeId,
    };
    characters[characterIndex] = updateCharacter;
    writeCharacters(characters);
    res.json({ message: "Personaje actualizado exitosamente", character: updateCharacter });
});

// Eliminar un personaje por ID
router.delete("/:id", (req, res) => {
    const characters = readCharacters();
    const newCharacters = characters.filter((c) => c.id !== parseInt(req.params.id));
    if (characters.length === newCharacters.length) {
        return res.status(404).json({ message: "Personaje no encontrado" });
    }
    writeCharacters(newCharacters);
    res.json({ message: "Personaje eliminado exitosamente" });
});

module.exports = router;
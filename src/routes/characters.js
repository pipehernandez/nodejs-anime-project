import { Router } from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";


const routerCharacter = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const charactersFilePath = path.join(_dirname, "../../data/characters.json");

// Leer personajes

const readCharacters = async () => {
    const charactersData = await fs.readFile(charactersFilePath);
    return JSON.parse(charactersData);
};

// Escribir personajes en el archivo

const writeCharacters = async (characters) => {
    await fs.writeFile(charactersFilePath, JSON.stringify(characters, null, 2));
};

// Crear un nuevo personaje
routerCharacter.post("/", async (req, res) => {
    const characters = await readCharacters();
    // console.log(characters)
    const newCharacter = {
        id: characters.length + 1,
        name: req.body.name,
        animeId: req.body.animeId,
    };
    characters.push(newCharacter);
    await writeCharacters(characters);
    res.status(201).json({ message: "Personaje creado exitosamente.", character: newCharacter });
});

// Obtener todos los personajes
routerCharacter.get("/", async (req, res) => {
    const characters = await readCharacters();
    res.status(200).json(characters);
});

// Obtener personaje por ID
routerCharacter.get("/:id", async (req, res) => {
    const characters = await readCharacters();
    const character = characters.find((c) => c.id === parseInt(req.params.id));
    if (!character) {
        return res.status(404).json({ message: "Personaje no encontrado" });
    }
    res.json(character);
});

// Actualizar un personaje por ID
routerCharacter.put("/:id", async (req, res) => {
    const characters = await readCharacters();
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
    await writeCharacters(characters);
    res.json({ message: "Personaje actualizado exitosamente", character: updateCharacter });
});

// Eliminar un personaje por ID
routerCharacter.delete("/:id", async (req, res) => {
    const characters = await readCharacters();
    const newCharacters = characters.filter((c) => c.id !== parseInt(req.params.id));
    if (characters.length === newCharacters.length) {
        return res.status(404).json({ message: "Personaje no encontrado" });
    }
    await writeCharacters(newCharacters);
    res.json({ message: "Personaje eliminado exitosamente" });
});

export default routerCharacter;
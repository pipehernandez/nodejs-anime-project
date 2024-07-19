import { Router } from "express";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";


const routerAnime = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const animesFilePath = path.join(_dirname, "../../data/animes.json");

// Leer animes

const readAnimes = async () => {
    const animesData = await fs.readFile(animesFilePath);
    return JSON.parse(animesData);
};

// Escribir animes en el archivo

const writeAnimes = async (animes) => {
    await fs.writeFile(animesFilePath, JSON.stringify(animes, null, 2));
};

// Crear un nuevo anime

routerAnime.post("/", async (req, res) => {
    const animes = await readAnimes();
    // console.log(animes)
    const newAnime = {
        id: animes.length + 1,
        title: req.body.title,
        genre: req.body.genre,
        studioId: req.body.studioId,
    };
    animes.push(newAnime);
    await writeAnimes(animes);
    res.status(201).json({ message: "Anime creado exitosamente.", anime: newAnime });
});

// Obtener todos los animes
routerAnime.get("/", async (req, res) => {
    const animes = await readAnimes();
    res.json(animes);
});

// Obtener anime por ID
routerAnime.get("/:id", async (req, res) => {
    const animes = await readAnimes();
    const anime = animes.find((a) => a.id === parseInt(req.params.id));
    if (!anime) {
        return res.status(404).json({ message: "Anime no encontrado" });
    }
    res.status(200).json(anime);
});

// Actualizar un anime por ID
routerAnime.put("/:id", async (req, res) => {
    const animes = await readAnimes();
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
    await writeAnimes(animes);
    res.status(201).json({ message: "Anime actualizado exitosamente", anime: updateAnime });
});

// Eliminar un anime por ID
routerAnime.delete("/:id", async (req, res) => {
    const animes = await readAnimes();
    const newAnimes = animes.filter((a) => a.id !== parseInt(req.params.id));
    if (animes.length === newAnimes.length) {
        return res.status(404).json({ message: "Anime no encontrado" });
    }
    await writeAnimes(newAnimes);
    res.json({ message: "Anime eliminado exitosamente." });
});

export default routerAnime;
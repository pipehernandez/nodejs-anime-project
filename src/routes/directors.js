import { Router } from "express";
import { promises as fs, read } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const routerDirector = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const directorsFilePath = path.join(_dirname, "../../data/directors.json");

// Leer directores

const readDirectors = async () => {
    const directorsData = await fs.readFile(directorsFilePath);
    return JSON.parse(directorsData);
};

// Escribir directores en el archivo

const writeDirectors = async (directors) => {
    await fs.writeFile(directorsFilePath, JSON.stringify(directors, null, 2));
};

// Crear un nuevo director
routerDirector.post("/", async (req, res) => {
    const directors = await readDirectors();
    const newDirector = {
        id: directors.length + 1,
        name: req.body.name,
    };
    directors.push(newDirector);
    await writeDirectors(directors);
    res.status(201).json({ message: "Director creado satisfactoriamente.", director: newDirector });
});

// Obtener todos los director
routerDirector.get("/", async (req, res) => {
    const directors = await readDirectors();
    res.status(200).json(directors);
});

// Obtener director por ID
routerDirector.get("/:id", async (req, res) => {
    const directors = await readDirectors();
    const director = directors.find((d) => d.id === parseInt(req.params.id));
    if(!director){
        return res.status(404).json({ message: "Director no encontrado." });
    }
    res.json(director);
});

// Actualizar director por ID
routerDirector.put("/:id", async (req, res) => {
    const directors = await readDirectors();
    const directorIndex = directors.findIndex((d) => d.id === parseInt(req.params.id));
    if(directorIndex === -1){
        return res.status(404).json({ message: "Director no encontrado." });
    }
    const updateDirector = {
        ...directors[directorIndex],
        name: req.body.name,
    }
    directors[directorIndex] = updateDirector;
    await writeDirectors(directors);
    res.status(200).json({ message: "Director actualizado satisfactoriamente.", director: updateDirector });
});

// Eliminar director por ID
routerDirector.delete("/:id", async (req, res) => {
    const directors = await readDirectors();
    const newDirectors = directors.filter((d) => d.id !== parseInt(req.params.id));
    if(directors.length === newDirectors.length){
        return res.status(404).json({ message: "Director no encontrado." });
    }
    await writeDirectors(newDirectors);
    res.status(200).json({ message: "Director eliminado satisfactoriamente." })
});

export default routerDirector;
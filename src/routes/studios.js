import { Router } from "express";
import { promises as fs } from "fs"
import { fileURLToPath } from "url";
import path from "path";


const routerStudio = Router();
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const studiosFilePath = path.join(_dirname, "../../data/studios.json");

// Leer estudios

const readStudios = async () => {
    const studiosData = await fs.readFile(studiosFilePath);
    return JSON.parse(studiosData);
};

// Escribir estudios

const writeStudios = async (studios) => {
    await fs.writeFile(studiosFilePath, JSON.stringify(studios, null, 2));
};

// Crear nuevo estudio

routerStudio.post("/", async (req, res) => {
    const studios = await readStudios();
    const newStudio = {
        id: studios.length +1,
        name: req.body.name,
    };
    studios.push(newStudio);
    await writeStudios(studios);
    res.status(201).json({ message: "Estudio creado satisfactoriamente.", studio: newStudio });
});

// Obtener todos los estudios
routerStudio.get("/", async(req, res) => {
    const studios = await readStudios();
    res.status(200).json(studios);
});

// Obtener estudio por ID
routerStudio.get("/:id", async (req, res) => {
    const studios = await readStudios();
    const studio = studios.find((s) => s.id === parseInt(req.params.id));
    if(!studio){
        return res.status(404).json({ message: "Estudio no encontrado" });
    }
    res.json(studio);
});

// Actualizar estudio por ID
routerStudio.put("/:id", async (req, res) => {
    const studios = await readStudios();
    const studioIndex = studios.findIndex((s) => s.id === parseInt(req.params.id));
    if(studioIndex === -1) return res.status(404).json({ message: "Estudio no encontrado." });
    const updateStudio = {
        ...studios[studioIndex],
        name: req.body.name,
    };
    studios[studioIndex] = updateStudio;
    await writeStudios(studios);
    res.status(201).json({ message: "Estudio actualizado satosfactoriamente.", studio: updateStudio})
});

// Eliminar estudios por ID
routerStudio.delete("/:id", async (req, res) => {
    const studios = await readStudios();
    const newStudios = studios.filter((s) => s.id !== parseInt(req.params.id));
    if(studios.length === newStudios.length){
        return res.status(404).json({ message: "Estudio no encontrado. "});
    }
    await writeStudios(newStudios);
    res.status(200).json({ message: "Estudio eliminado satisfactoriamente." });
});

export default routerStudio;
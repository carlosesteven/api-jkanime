import express from "express";
import jkanime from "jkanime-v2"; // Importar el objeto `default`

const app = express();
const PORT = 3000;

const {
  byAlphabet,
  filter,
  getAnimeServers,
  getExtraInfo,
  latestAnimeAdded,
  schedule,
  search,
  top
} = jkanime; // Extraer las funciones del objeto `default`

app.use(express.json());

/**
 * @route GET /api/latest
 * @description Obtiene la lista de los animes más recientes añadidos al catálogo.
 * @returns {Array} Lista de animes recientes con información básica (slug, título, imagen, tipo, estado).
 */
app.get("/api/latest", async (req, res) => {
  try {
    const data = await latestAnimeAdded();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route POST /api/filter
 * @description Filtra los animes según los parámetros proporcionados.
 * @body {Object} query - Objeto con los filtros a aplicar (género, año, temporada, etc.).
 * @returns {Array} Lista de animes que cumplen con los filtros.
 */
app.post("/api/filter", async (req, res) => {
  try {
    const { query } = req.body;
    const data = await filter({ query });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/alphabet/:letter
 * @description Obtiene animes cuyo título comienza con una letra específica.
 * @param {string} letter - Letra inicial para filtrar los animes.
 * @returns {Array} Lista de animes que cumplen con el criterio.
 */
app.get("/api/alphabet/:letter", async (req, res) => {
  try {
    const { letter } = req.params;
    const data = await byAlphabet(letter);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/anime/:slug
 * @description Obtiene información adicional de un anime específico.
 * @param {string} slug - Slug único del anime.
 * @returns {Object} Información detallada del anime (géneros, demografía, episodios, estudio, etc.).
 */
app.get("/api/anime/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const data = await getExtraInfo(slug);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/top
 * @description Obtiene los animes más populares según la temporada y el año.
 * @query {string} season - Temporada a filtrar (Primavera, Verano, Otoño, Invierno, Actual).
 * @query {string} year - Año a filtrar (opcional si la temporada es "Actual").
 * @returns {Array} Lista de animes populares.
 */
app.get("/api/top", async (req, res) => {
  try {
    const { season, year } = req.query;
    const data = await top(season, year);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/search
 * @description Busca animes por un término específico.
 * @query {string} q - Término de búsqueda.
 * @returns {Array} Lista de animes que coinciden con el término.
 */
app.get("/api/search", async (req, res) => {
  try {
    const { q } = req.query;
    const data = await search(q);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/servers/:slug/:chapter
 * @description Obtiene las URLs de los servidores donde se puede reproducir un episodio específico.
 * @param {string} slug - Slug único del anime.
 * @param {number} chapter - Número del episodio.
 * @returns {Array} Lista de URLs de los servidores disponibles.
 */
app.get("/api/servers/:slug/:chapter", async (req, res) => {
  try {
    const { slug, chapter } = req.params;
    const data = await getAnimeServers(slug, parseInt(chapter));
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * @route GET /api/schedule
 * @description Obtiene la programación semanal de animes.
 * @returns {Array} Lista de animes organizados por día de emisión.
 */
app.get("/api/schedule", async (req, res) => {
  try {
    const data = await schedule();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
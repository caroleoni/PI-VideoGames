const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const routesVideoGames = require('./videogames');
const routesGenres = require('./genres');
require("dotenv").config();

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/videogames', routesVideoGames);
router.use('/genres', routesGenres);


module.exports = router;

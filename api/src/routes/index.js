const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const routesVideoGames = require('./routesVideoGames');
const routesGenres = require('./routesGenres');
require("dotenv").config();

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use('/routesVideoGames', routesVideoGames);
router.use('/routesGenres', routesGenres);


module.exports = router;

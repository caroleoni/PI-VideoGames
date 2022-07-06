const { Router } = require('express');
const {API_KEY} = process.env;
const axios = require('axios');
const { Videogame, Genre } = require('../db');
require("dotenv").config();

const router = Router();

router.get('/', async (req, res) => {
    try {
        let apiGenre = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`)
        //destructuring de objeto
        const { results } = apiGenre.data;
        for(let i = 0; i < results.length; i ++) {
            const { name } = results[i];
            console.log(results[i])
            await Genre.findOrCreate({
                where: { name : name } 
            })
        }
        let allGenre = await Genre.findAll()
        res.status(200).json(allGenre)

    }  catch (error) {
        console.log(error) 
          
    }
})






module.exports = router;
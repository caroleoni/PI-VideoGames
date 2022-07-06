const { Router } = require('express');
const axios = require('axios');
const { Videogame, Genre } = require('../db');
const {API_KEY} = process.env;
const { Op } = require("sequelize")
require("dotenv").config();

const router = Router();

const getApiInfo = async () => {
    let result = []; //agrego al array uno por uno de la info
    let pageArray = []; //agrego 5 paginas de 50 c/U : 100 videos juegos
    let page = [1, 2, 3, 4, 5];

    page.forEach(e => {
        pageArray.push(
            axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=${e}`)
        );
    });

    await Promise.all(pageArray)
        .then((e) => {
            e.forEach((e) => {
                let res = e.data;
                result.push(
                    ...res.results.map((e) => {
                        const objInfo = {
                            id: e.id,
                            image: e.background_image,
                            name: e.name,
                            released: e.released,
                            rating: e.rating,
                            platforms: e.platforms.map(e => e.platform.name),
                            genres: e.genres.map( e => e.name),
                            description: e.description,
                        }
                        return objInfo;
                    })
                )
            })
        })

        .then(() => result)
        .catch((error) => console.log(error));
        return result;
}

const getDbInfo = async () => {
    let infoDb = await Videogame.findAll({
        include: {
            model: Genre, //si no incluyo al genero nunca voy a poder crear nuevos videos games
            attributes: ['name'], //traeme el modelo de Genre mediante este attribute.
            through: {
                attributes: [], // mediante los atributtos.
            }

        }
    });
    //retorno solo los datos que quiero de los videos juegos para la db
    infoDb = infoDb.map(({ id, name, released, rating, platforms, genres, image, createdInDb }) => ({
        id,
        image,
        name,
        released,
        rating,
        platforms,
        createdInDb,
        genres: genres.map((e) => e.name),
    }))
    return infoDb;
} 

const getGamesAll = async () => {
    const [allApiInfo, allDbInfo] = await Promise.all([getApiInfo(), getDbInfo()]);
    const allApiDb = allApiInfo.concat(allDbInfo);
    return allApiDb;
}

router.get('/', async (req, res) => {
    const { name } = req.query;
    try {
        let allNameApi = await axios.get(`https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`)
    if(name) {
        let nameApi = allNameApi.data.results.filter(e => e.name.toLowerCase().includes(name.toLowerCase()))
        nameApi = nameApi.slice(0,15)

        nameApi = nameApi.map(e => {
            return {
                id: e.id,
                image: e.background_image,
                name: e.name,
                released: e.released,
                rating: e.rating,
                platforms: e.platforms?.map(e => e.platform.name),
                genres: e.genres.map( e => e.name),
                description: e.description,
            }
        });

        let nameDb = await Videogame.findAll({
            where: {
                name: {
                    [Op.iLike]: "%" + name + "%"
                },
            },
            include: Genre
        });
        nameDb = nameDb.map(({id, name, released, rating, platforms, genres, image}) => ({
            id,
            name,
            released,
            rating,
            platforms,
            genres: genres.map((genre) => genre.name),
            image
        }));

        let allName = nameApi.concat(nameDb);

        allName.length > 0 ?  res.status(200).json(allName) : res.status(404).json({err:"No existe ese videojuego"})


    }else {
        let allVideoGames = await getGamesAll();
        res.status(200).json(allVideoGames);
    }
    } catch (error) {
        console.log(error)
    }
});

router.get('/:id', async (req, res) => {
    try {
            const { id } = req.params;

        if(id.length > 9) {
            let dbId = await Videogame.findOne({
                where: {
                     id: id
                },
                include: Genre
            })
            let dbGames = {
                image: dbId.image,
                name: dbId.name,
                released: dbId.released,
                rating: dbId.rating,
                platforms: dbId.platforms,
                genres: dbId.genres?.map(e => e.name),
                description: dbId.description
            }
            res.status(200).json(dbGames)
        } else {
            let apiGames = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`)
            let gamesDetail = {
                image: apiGames.data.background_image,
                name: apiGames.data.name,
                released: apiGames.data.released,
                rating: apiGames.data.rating,
                platforms: apiGames.data.platforms.map(e => e.platform.name),
                genres: apiGames.data.genres.map(e => e.name),
                description: apiGames.data.description,
            }
            res.status(200).json(gamesDetail)
        }
    } catch (error) {
        console.log(error)
    }
});

router.post('/', async (req, res) => {
    try {
        const { id, name, image, description, released, rating, genres, platforms, createdInDb } = req.body

        let newVideoGames = await Videogame.create({
            id, 
            name, 
            image, 
            description, 
            released, 
            rating, 
            platforms, 
            createdInDb
        })
        let genre = await Genre.findAll({
            where: {
                name: genres
            }
        });
            newVideoGames.addGenres(genre);
            res.json('VideoGame Created Successfully')

    } catch (error) {
        console.log(error)
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params
    const { name, image, description, released, rating } = req.body;

    let errores = [];
    if(name) {
        if(!/^[a-zA-Z\s]+$/.test(name)) {
            errores.push('name')
        } else {
            await Videogame.update({
                    name: name
                },{
                    where: { id: id }
                }
            
            )
        }
    };
    if(image){
        await Videogame.update({
                image: image
            },{
                where: { id: id }
            }
            
        )
    };
    if(description) {
        await Videogame.update({
                description: description
            }, {
                where: { id: id }
            }
        )
    };
    if(released) {
        if(!/^([0-9]){4}-([0-9]){2}-([0-9]){2}$/.test(released)) {
            errores.push('released')
        } else {
            await Videogame.update({
                    released: released
                }, {
                    where: { id: id }
                }
            )
        }
    };
    if(rating) {
        await Videogame.update({
                rating: rating
            }, {
                where: { id: id }
            }
        )
    };

})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        let deleteGame = await Videogame.findByPk(id);
        if(deleteGame) {
            await deleteGame.destroy()
            return res.status(200).json('video game removed')
        }
        res.status(404).json('video game not found')
    } catch (error) {
        console.log(error)
    }
});

module.exports = router;
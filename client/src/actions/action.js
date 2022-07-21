import axios from 'axios';

export const GET_VIDEOGAMES = 'GET_VIDEOGAMES';

export const getVideoGames = () => {
    return async function(dispatch) {
        let json = await axios('/videogames');
        return ({
            type: 'GET_VIDEOGAMES',
            payload: json.data
        });
    }
};


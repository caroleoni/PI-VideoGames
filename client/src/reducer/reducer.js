import { GET_VIDEOGAMES } from '../actions/action.js';

const initialState = {
  videoGames: []
}

export default function reducer(state = initialState, { type, payload }) {
    switch(type) {
      case GET_VIDEOGAMES: {
        return {
          ...state,
          videoGames: payload
        }
      }
        
      default: return state  
    }
}
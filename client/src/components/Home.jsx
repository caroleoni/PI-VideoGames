import React from 'react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import{ getVideoGames } from '../actions/action';

export default function Home () {
    
    const dispatch = useDispatch(); //traigo todo el estado de videogames
    const allVideoGames = useSelector ((state) => state.videoGames);

    useEffect(() =>{
        dispatch(getVideoGames())
    }, [dispatch])




}
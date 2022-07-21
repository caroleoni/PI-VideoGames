import React from 'react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
    return (
        <section className='container-landing'>
            <div className='info-landing'>
                <h1 className='titulo-landing'>¡Welcome to VideoGames!</h1>
                <Link to='/home'>
                    <button className='btn-landing'>Press Start</button>
                </Link>
                <h5 className='footer-landing'>App developed by Carolina Leoni, Full-Stack Developer Student</h5>
            </div>
        </section>
    )
}
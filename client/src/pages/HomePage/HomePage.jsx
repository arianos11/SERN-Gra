import React from 'react';
import { Link } from 'react-router-dom';

import './HomePage.scss';

const HomePage = () => {

    return(
        <div className="homepage">
            <h1>Witaj w grze na SQL, Express, React, Node.js</h1>
            <Link to="/sign-in">Zaloguj się</Link>
            <Link to="/sign-up">Zarejestruj się</Link>
        </div>
    )
};

export default HomePage;
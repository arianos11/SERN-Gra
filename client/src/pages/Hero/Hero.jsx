import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Alert from '../../components/Alert/Alert';

import './Hero.scss';

const Hero = () => {

    const [user, setUser] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        axios.get('/api/auth').then((data) => setUser(data)).catch(err => {setError(err.response.data.msg); console.log(err.response.data.msg)});
    }, [])

    return(
        <div className="hero">
            <h1>Postac</h1>
            {user ? <h2>{JSON.stringify(user.data[0])}</h2> : null}
            {error ? <Alert messages={[{ text: error, type: 'fail'}]} /> : null}
        </div>
    )
}

export default Hero;
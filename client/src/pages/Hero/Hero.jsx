import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Alert from '../../components/Alert/Alert';

import './Hero.scss';

const Hero = () => {

    const [user, setUser] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        axios.get('/api/auth').then((data) => setUser(data.data[0])).catch(err => {setError(err.response.data.msg); console.log(err.response.data.msg)});
    }, [])

    return(
        <div className="hero">
            <h1>Postac</h1>
            {user ? (
            <div className="hero">
                <p>{JSON.stringify(user)}</p>
                <h2>{user.username}</h2>
                <img src={`https://robohash.org/${user.image}`} alt={`user-${user.username}`} />
            </div>
            ) : null}
            {error ? <Alert messages={[{ text: error, type: 'fail'}]} /> : null}
        </div>
    )
}

export default Hero;
import React, { useState } from 'react';

import { NavLink } from 'react-router-dom';

import TopHeader from './TopHeader';
import { LoggedIn } from '../routes';

const Header = () => {
    const logged = LoggedIn;
    const [loggedIn, setLoggedIn] = useState(logged);
    return (
        <header className={loggedIn ? 'header header_2' : 'header'}>

            <TopHeader />

            {
                !loggedIn && (
                    <div className='content hero_content'>
                        <div className='hero'>
                            <h1>Welcome to a platform dedicated to delivering the freshest, most affordable produce directly from farmers to you.</h1>
                            <NavLink to='/getstarted'><button className='btn'>Get Started</button></NavLink>
                        </div>
                    </div>
                )
            }



        </header>


    );
}

export default Header;
import React, { useEffect } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';

import Footer from '../components/Footer';
import TopHeader from '../components/TopHeader';


const GetStarted = () => {
    const navigate = useNavigate();
    useEffect(() => {
        //check if user already logged in
        if (localStorage.length !== 0) {
            if (JSON.parse(localStorage.getItem("sessions")).role === "farmer") {
                navigate("/farmerHome");
            } else {
                navigate("/");
            }
        } else {
            navigate("/getstarted")
        }

    }, []);
    return (
        <>

            <header className='header header_2'>
                <TopHeader />
            </header>

            <section className='get_started'>
                <div className='content'>
                    <div className='box box2'>
                        <div className='title_part'>
                            <h1>For <span>Farmers:</span></h1>
                        </div>

                        <div className='txt_part'>
                            <p>Easily showcase and sell your fresh produce to a wider market. Connect directly with consumers and grow your business.</p>
                        </div>

                        <div className='btn_part'>
                            <NavLink to='/signupfarmer'><button className='btn'>SignUp</button></NavLink>
                        </div>

                        <div className='txt_part small'>
                            <p>Already have an account? <NavLink to='/login'>Login</NavLink></p>
                        </div>
                    </div>

                    <div className='box box2 transparent'>
                        <div className='title_part'>
                            <h1>For <span>Consumers:</span></h1>
                        </div>

                        <div className='txt_part'>
                            <p>Find and buy fresh, high-quality farm produce directly from local farmers. Enjoy convenience and fair prices.</p>
                        </div>

                        <div className='btn_part'>
                            <NavLink to='/signupconsumer'><button className='btn btn4 normal'>SignUp</button></NavLink>
                        </div>

                        <div className='txt_part small'>
                            <p>Already have an account? <NavLink to='/login'>Login</NavLink></p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />

        </>
    )
}

export default GetStarted;
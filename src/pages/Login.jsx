import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import axios from "axios";

import Footer from '../components/Footer';
import TopHeader from '../components/TopHeader';


import { api_url } from "../routes";
import CryptoJS from "crypto-js";

const Login = () => {

    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        username: "",
        password: "",
        response: "",
    });

    const sessions = { loggedIn: 0, username: "", user_id: "", role: "", status: "" };

    const username_ref = useRef(),
        psk_ref = useRef(),
        login_btn = useRef();

    const handlePassword = () => {
        let psk_length = psk_ref.current.value.length,
            show_btn = document.querySelector(".show_psk");

        if (psk_length >= 1) {
            show_btn.style.display = "block";
        } else {
            show_btn.style.display = "none";
        }
    };

    const handleViewpsk = (elem) => {
        const iconElement = elem.currentTarget.querySelector("i");

        if (psk_ref.current.type === "password") {
            psk_ref.current.type = "text";
            iconElement.className = "fa-solid fa-eye";
        } else {
            psk_ref.current.type = "password";
            iconElement.className = "fa-solid fa-eye-slash";
        }
    };

    const handleLogin = () => {
        //Validate the input fields

        const errors = {};

        if (username_ref.current.value === "") {
            errors.username = "Username/Email Required";
        }

        if (psk_ref.current.value === "") {
            errors.password = "Password Required";
        }

        setErrors(errors);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("username", username_ref.current.value);
        formData.append("password", psk_ref.current.value);

        axios({
            method: "post",
            url: api_url + "/login.php",
            data: formData,

            config: {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        })
            .then((response) => {
                if (Array.isArray(response.data)) {
                    //response will be an array only on success
                    // console.log(response.data[0]);

                    login_btn.current.innerText = "Loading...";
                    login_btn.current.disabled = true;


                    let sessions = {}

                    sessions.loggedIn = 1; //Update the sessions object array
                    sessions.user_id = response.data[0].user_id;
                    sessions.username = response.data[0].username;
                    sessions.role = response.data[0].role;
                    sessions.status = response.data[0].status;

                    localStorage.setItem("sessions", JSON.stringify(sessions)); //Store in local storage


                    toast.success("Welcome Back", {
                        position: "top-center",
                        autoClose: 2000,
                    });

                    setTimeout(() => {
                        if (response.data[0].role === "farmer") {
                            navigate("/farmerHome");
                        } else {
                            navigate("/");
                        }

                        window.location.reload(); //Reload to remove any router bugs
                    }, 3000);
                } else {
                    setErrors({
                        username: "",
                        password: "",
                        response: response.data,
                    });

                    toast.error(response.data, {
                        position: "top-center",
                        autoClose: 3000,
                    });
                    localStorage.setItem("sessions", JSON.stringify(sessions)); //Store in local storage
                }
            })
            .catch(e => {
                setErrors({ username: "", password: "", response: "Login failed!" });
                toast.error("Login failed!", { position: "top-center", autoClose: 3000 });
            })

    };


    useEffect(() => {
        //check if user already logged in
        if (localStorage.length !== 0 && JSON.parse(localStorage.getItem("sessions")).role === "farmer") {
            if (JSON.parse(localStorage.getItem("sessions")).role === "farmer") {
                navigate("/farmerHome");
            } else {
                navigate("/");
            }
        } else {
            navigate("/login")
        }

    }, []);



    return (
        <>

            <header className='header header_2'>
                <TopHeader />
            </header>

            <section className='get_started login_container'>
                <div className='content'>
                    <div className='box box2 form_box'>
                        <div className='title_part'>
                            <h1>Welcome Back!</h1>
                            <h2>Login to your account</h2>
                        </div>

                        <div className='form_part'>
                            {errors.response !== "" ? (
                                <span className="error_msg response_text">{errors.response}</span>
                            ) : null}
                            <form action="" method='post' onSubmit={(e) => handleSubmit(e)}>

                                <div className="input_group">
                                    <label htmlFor="username">Username or Email</label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        placeholder="Enter username or email"
                                        required
                                        ref={username_ref}
                                    // {...formik.getFieldProps("username")}
                                    />
                                    {errors.username !== "" ? (
                                        <span className="error_msg">{errors.username}</span>
                                    ) : null}
                                </div>

                                <div className="input_group">
                                    <label htmlFor="psk">Password</label>
                                    <input
                                        type="password"
                                        name="psk"
                                        id="psk"
                                        placeholder="Enter password"
                                        ref={psk_ref}
                                        onChange={handlePassword}
                                        required
                                    // {...formik.getFieldProps("password")}
                                    />
                                    {errors.password !== "" ? (
                                        <span className="error_msg">{errors.password}</span>
                                    ) : null}

                                    <div className="show_psk" onClick={(e) => handleViewpsk(e)}>
                                        <i className="fa-solid fa-eye-slash"></i>
                                    </div>
                                </div>


                                <div className="input_group">
                                    <p><NavLink to='/forgot'>Forgot Password?</NavLink></p>
                                </div>

                                <div className="input_group">
                                    <button
                                        type="submit"
                                        className="btn"
                                        onClick={handleLogin}
                                        ref={login_btn}
                                    >
                                        Login Now
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className='txt_part small'>
                            <p>Don't have an account? <NavLink to='/getstarted'>Signup</NavLink></p>
                        </div>
                    </div>


                </div>
            </section>

            <Footer />

        </>
    )
}

export default Login;
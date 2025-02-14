import React, { useRef, useState } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { api_url } from "../routes";

import TopHeader from "../components/TopHeader";

import Footer from "../components/Footer";
const ForgotPassword = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        email: "",
        response: "",
    });

    const email_ref = useRef(),
        send_btn = useRef();

    const handleSendResetLink = () => {
        //Validate the input fields
        const errors = {},
            email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (email_ref.current.value === "") {
            errors.email = "Email Required";
        } else if (!email_ref.current.value.match(email_regex)) {
            errors.email = "Invalid Email";
        }

        setErrors(errors);

        if (JSON.stringify(errors).length === 2) {
            //if there is no error proceed to submit, 2 is for the curly braces
            return true;
        } else {
            return false;
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const error_free = handleSendResetLink();
        // console.log(error_free);

        if (error_free) {
            handleSendResetLink();

            let formData = new FormData();
            formData.append("email", email_ref.current.value);

            send_btn.current.innerText = "Sending...";
            axios({
                method: "post",
                url: api_url + "/psk/forgot.php",
                data: formData,
                config: {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            })
                .then((response) => {
                    if (response.data === 1) {
                        //Meaning success

                        send_btn.current.disabled = true;

                        toast.success("Link Sent Successfully, Please Check your Email", {
                            position: "top-center",
                            autoClose: 2000,
                        });

                        setTimeout(() => {
                            navigate("/login");
                        }, 3000);
                    } else {
                        send_btn.current.innerText = "Send Reset Link";

                        setErrors({
                            email: "",
                            response: response.data,
                        });

                        // toast.error(response.data, {
                        //   position: toast.POSITION.TOP_CENTER,
                        //   autoClose: 3000,
                        // });
                    }
                })
                .catch((e) => {
                    setErrors({
                        email: "",
                        response: e.message,
                    });
                });
        }
    };


    return (


        <>

            <header className='header header_2'>
                <TopHeader />
            </header>

            <section className='get_started login_container'>
                <div className='content'>
                    <div className='box box2 form_box'>
                        <div className='title_part'>
                            <h1>Forgot Password</h1>

                        </div>

                        <div className='form_part'>
                            {errors.response !== "" ? (
                                <span className="error_msg response_text">{errors.response}</span>
                            ) : null}
                            <form action="" method="post" onSubmit={(e) => handleSubmit(e)}>
                                <div className="input_group">
                                    <label htmlFor="mail">Email Address</label>
                                    <input
                                        type="email"
                                        name="mail"
                                        id="mail"
                                        placeholder="Enter Your Email"
                                        required
                                        ref={email_ref}
                                    // {...formik.getFieldProps("username")}
                                    />
                                    {errors.username !== "" ? (
                                        <span className="error_msg">{errors.email}</span>
                                    ) : null}
                                </div>

                                <div className="input_group">
                                    <button
                                        type="submit"
                                        className="btn"
                                        onClick={handleSendResetLink}
                                        ref={send_btn}
                                    >
                                        Send Reset Link
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className='txt_part small'>
                            <p><NavLink to='/login'>Go Back</NavLink></p>
                        </div>
                    </div>


                </div>
            </section>
            <ToastContainer />
            <Footer />

        </>



    );
};

export default ForgotPassword;

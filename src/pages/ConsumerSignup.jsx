import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";



import { NavLink } from 'react-router-dom';

import Footer from '../components/Footer';
import TopHeader from '../components/TopHeader';

import { api_url } from "../routes";

const ConsumerSignup = () => {
    const navigate = useNavigate();
    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        c_password: "",
        first_name: "",
        last_name: "",
        phone_no: "",
        region: "",
        check: "",
        response: "",
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const username_ref = useRef(),
        email_ref = useRef(),
        psk_ref = useRef(),
        cpsk_ref = useRef(),
        firstName_ref = useRef(),
        lastName_ref = useRef(),
        phone_ref = useRef(),
        region_ref = useRef(),
        check_ref = useRef(),
        signup_btn = useRef();

    const handlePassword = () => {
        let psk_length = psk_ref.current.value.length,
            cpsk_length = cpsk_ref.current.value.length,
            show_btn = document.querySelector(".show_psk"),
            show_btn2 = document.querySelector(".show_psk2");

        show_btn.style.display = psk_length >= 1 ? "block" : "none";
        show_btn2.style.display = cpsk_length >= 1 ? "block" : "none";
    };

    const handleViewpsk = (elem) => {
        const iconElement = elem.currentTarget.querySelector("i");
        psk_ref.current.type =
            psk_ref.current.type === "password" ? "text" : "password";
        iconElement.className =
            psk_ref.current.type === "text"
                ? "fa-solid fa-eye"
                : "fa-solid fa-eye-slash";

    };

    const handleViewpsk2 = (elem) => {
        const iconElement = elem.currentTarget.querySelector("i");
        cpsk_ref.current.type =
            cpsk_ref.current.type === "password" ? "text" : "password";
        iconElement.className =
            cpsk_ref.current.type === "text"
                ? "fa-solid fa-eye"
                : "fa-solid fa-eye-slash";
    };

    const openDialogPolicy = () => {
        setIsDialogOpen(true);
    };

    const handleSignup = () => {
        const errors = {};
        const email_regex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phone_regex = /^[07][0-9]{9}$/; // Kenyan phone numbers

        if (!username_ref.current.value.trim()) {
            errors.username = "Username Required";
        }

        if (!email_ref.current.value.trim()) {
            errors.email = "Email Required";
        } else if (!email_ref.current.value.match(email_regex)) {
            errors.email = "Invalid Email";
        }

        if (!firstName_ref.current.value.trim()) {
            errors.first_name = "First Name Required";
        }

        if (!lastName_ref.current.value.trim()) {
            errors.last_name = "Last Name Required";
        }

        if (!phone_ref.current.value.trim()) {
            errors.phone_no = "Phone No. Required";
        } else if (!phone_ref.current.value.match(phone_regex)) {
            errors.phone_no = "Invalid Phone Number";
        }

        if (!region_ref.current.value.trim()) {
            errors.region = "Region Required";
        }

        if (!psk_ref.current.value) {
            errors.password = "Password Required";
        }

        if (!cpsk_ref.current.value) {
            errors.c_password = "Confirm Password Required";
        }



        if (!check_ref.current.checked) {
            errors.check = "You must agree to the terms";
        }

        if (psk_ref.current.value !== cpsk_ref.current.value) {
            errors.response = "Passwords do not match";
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

        const error_free = handleSignup();
        if (!error_free) return;

        let formData = new FormData();
        formData.append("username", username_ref.current.value);
        formData.append("email", email_ref.current.value);
        formData.append("password", psk_ref.current.value);
        formData.append("first_name", firstName_ref.current.value);
        formData.append("last_name", lastName_ref.current.value);
        formData.append("phone_no", phone_ref.current.value);
        formData.append("region", region_ref.current.value);
        formData.append("role", "consumer");
        formData.append("terms_check", check_ref.current.checked);

        axios({
            method: "post",
            url: api_url + "/signup.php",
            data: formData,
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => {
                if (response.data === 1) {

                    signup_btn.current.innerText = "Loading...";
                    signup_btn.current.disabled = true;

                    toast.success("Registered Successfully", {
                        position: "top-center",
                        autoClose: 2000,
                    });

                    setTimeout(() => {
                        navigate("/login");
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
                }
            })
            .catch((e) => {

                setErrors({
                    username: "",
                    password: "",
                    response: e.message,
                });
            });
    };

    useEffect(() => {
        //check if user already logged in
        if (localStorage.length !== 0) {
            if (JSON.parse(localStorage.getItem("sessions")).role === "farmer") {
                navigate("/farmerHome");
            } else {
                navigate("/");
            }
        } else {
            navigate("/signupconsumer")
        }

    }, []);
    return (
        <>

            <header className='header header_2'>
                <TopHeader />
            </header>

            <section className='signup_container consumer'>
                <div className='content'>
                    <div className='box box2 form_box'>
                        <div className='title_part'>
                            <h1>For <span>Consumers:</span></h1>
                        </div>

                        <div className='form_part'>
                            {errors.response !== "" ? (
                                <span className="error_msg response_text">{errors.response}</span>
                            ) : null}
                            <form action="" method='post' onSubmit={(e) => handleSubmit(e)}>
                                <div className='grouping'>
                                    <div className="input_group">
                                        <label htmlFor="username">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            placeholder="Enter username"
                                            required
                                            ref={username_ref}
                                        // {...formik.getFieldProps("username")}
                                        />
                                        {errors.username !== "" ? (
                                            <span className="error_msg">{errors.username}</span>
                                        ) : null}
                                    </div>

                                    <div className="input_group">
                                        <label for="fname">First Name</label>
                                        <input
                                            type="text"
                                            name="fname"
                                            id="fname"
                                            placeholder="Enter first name"
                                            required
                                            ref={firstName_ref}
                                        // {...formik.getFieldProps("username")}
                                        />
                                        {errors.first_name !== "" ? (
                                            <span className="error_msg">{errors.first_name}</span>
                                        ) : null}
                                    </div>

                                    <div className="input_group">
                                        <label htmlFor="lname">Last Name</label>
                                        <input
                                            type="text"
                                            name="lname"
                                            id="lname"
                                            placeholder="Enter last name"
                                            required
                                            ref={lastName_ref}
                                        // {...formik.getFieldProps("username")}
                                        />
                                        {errors.last_name !== "" ? (
                                            <span className="error_msg">{errors.last_name}</span>
                                        ) : null}
                                    </div>

                                </div>

                                <div className='grouping'>
                                    <div className="input_group">
                                        <label htmlFor="phone">Phone No.</label>
                                        <input
                                            type="number"
                                            min={0}
                                            maxLength={11}
                                            name="phone"
                                            id="phone"
                                            placeholder="Enter phone number"
                                            required
                                            ref={phone_ref}
                                        // {...formik.getFieldProps("username")}
                                        />
                                        {errors.phone_no !== "" ? (
                                            <span className="error_msg">{errors.phone_no}</span>
                                        ) : null}
                                    </div>

                                    <div className="input_group">
                                        <label htmlFor="email">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            placeholder="Enter email address"
                                            required
                                            ref={email_ref}
                                        // {...formik.getFieldProps("username")}
                                        />
                                        {errors.email !== "" ? (
                                            <span className="error_msg">{errors.email}</span>
                                        ) : null}
                                    </div>

                                    <div className="input_group">
                                        <label htmlFor="region">Region</label>
                                        <div className="custom_select region">
                                            <select name="region" id="region" required ref={region_ref}>
                                                <option value="">-- Select Region --</option>
                                                <option value="Baringo">Baringo</option>
                                                <option value="Bomet">Bomet</option>
                                                <option value="Bungoma">Bungoma</option>
                                                <option value="Busia">Busia</option>
                                                <option value="Elgeyo Marakwet">Elgeyo Marakwet</option>
                                                <option value="Embu">Embu</option>
                                                <option value="Garissa">Garissa</option>
                                                <option value="Homa Bay">Homa Bay</option>
                                                <option value="Isiolo">Isiolo</option>
                                                <option value="Kajiado">Kajiado</option>
                                                <option value="Kakamega">Kakamega</option>
                                                <option value="Kericho">Kericho</option>
                                                <option value="Kiambu">Kiambu</option>
                                                <option value="Kilifi">Kilifi</option>
                                                <option value="Kirinyaga">Kirinyaga</option>
                                                <option value="Kisii">Kisii</option>
                                                <option value="Kisumu">Kisumu</option>
                                                <option value="Kitui">Kitui</option>
                                                <option value="Kwale">Kwale</option>
                                                <option value="Laikipia">Laikipia</option>
                                                <option value="Lamu">Lamu</option>
                                                <option value="Machakos">Machakos</option>
                                                <option value="Makueni">Makueni</option>
                                                <option value="Mandera">Mandera</option>
                                                <option value="Marsabit">Marsabit</option>
                                                <option value="Meru">Meru</option>
                                                <option value="Migori">Migori</option>
                                                <option value="Mombasa">Mombasa</option>
                                                <option value="Murang'a">Murang'a</option>
                                                <option value="Nairobi">Nairobi</option>
                                                <option value="Nakuru">Nakuru</option>
                                                <option value="Nandi">Nandi</option>
                                                <option value="Narok">Narok</option>
                                                <option value="Nyamira">Nyamira</option>
                                                <option value="Nyandarua">Nyandarua</option>
                                                <option value="Nyeri">Nyeri</option>
                                                <option value="Samburu">Samburu</option>
                                                <option value="Siaya">Siaya</option>
                                                <option value="Taita Taveta">Taita Taveta</option>
                                                <option value="Tana River">Tana River</option>
                                                <option value="Tharaka Nithi">Tharaka Nithi</option>
                                                <option value="Trans Nzoia">Trans Nzoia</option>
                                                <option value="Turkana">Turkana</option>
                                                <option value="Uasin Gishu">Uasin Gishu</option>
                                                <option value="Vihiga">Vihiga</option>
                                                <option value="Wajir">Wajir</option>
                                                <option value="West Pokot">West Pokot</option>
                                            </select>
                                            {errors.region !== "" ? (
                                                <span className="error_msg">{errors.region}</span>
                                            ) : null}
                                        </div>
                                    </div>


                                </div>

                                <div className='part_3'>
                                    <div className='child'>
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
                                            <label htmlFor="c_psk">Confirm Password</label>
                                            <input
                                                type="password"
                                                name="c_psk"
                                                id="c_psk"
                                                placeholder="Confirm password"
                                                ref={cpsk_ref}
                                                onChange={handlePassword}
                                                required
                                            // {...formik.getFieldProps("password")}
                                            />
                                            {errors.password !== "" ? (
                                                <span className="error_msg">{errors.c_password}</span>
                                            ) : null}

                                            <div className="show_psk2" onClick={(e) => handleViewpsk2(e)}>
                                                <i className="fa-solid fa-eye-slash"></i>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                                <div className="input_group">
                                    <div className="grouping check_group">
                                        <input
                                            type="checkbox"
                                            name="check"
                                            id="check"
                                            ref={check_ref}
                                            required
                                        />
                                        <label htmlFor="check" className="check_label">
                                            I Agree to SokoLangu's <b onClick={openDialogPolicy}>Terms of Service</b> and <b onClick={openDialogPolicy}>Privacy Policy</b>
                                        </label>
                                    </div>

                                    {errors.check !== "" ? (
                                        <span className="error_msg">{errors.check}</span>
                                    ) : null}
                                </div>

                                <div className="input_group">
                                    <button
                                        type="submit"
                                        className="btn"
                                        onClick={handleSignup}
                                        ref={signup_btn}
                                    >
                                        Confirm Signup
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className='txt_part small'>
                            <p>Already have an account? <NavLink to='/login'>Login</NavLink></p>
                        </div>
                    </div>


                </div>

                <ToastContainer />
            </section>



            <Footer />
            {isDialogOpen && (
                <div className="dialog_container">
                    <div className="dialog_box policy_dialog">
                        <div className="close_part">
                            <button
                                className="btn close_btn"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                X
                            </button>
                        </div>

                        <div className="title_part">
                            <h2>SokoLangu - Terms & Privacy Policy</h2>
                        </div>

                        <div className="content_part">
                            <div className="part_1">
                                <h3>Terms of Service</h3>
                                <p>
                                    Welcome to SokoLangu! By registering and using our services, you
                                    agree to the following terms:
                                </p>
                                <ol>
                                    <li>
                                        <strong>User Account:</strong> You are responsible for
                                        maintaining the confidentiality of your username and password. Any
                                        activity performed through your account is your responsibility.
                                    </li>
                                    <li>
                                        <strong>User Conduct:</strong> You agree to use SokoLangu for
                                        lawful purposes only. Any fraudulent, misleading, or harmful
                                        activity is strictly prohibited.
                                    </li>
                                    <li>
                                        <strong>Marketplace Transactions:</strong> SokoLangu provides a
                                        platform for market trade interactions. We do not guarantee or
                                        oversee individual transactions between users.
                                    </li>
                                    <li>
                                        <strong>Data Security:</strong> We implement security measures to
                                        protect user data, but we cannot guarantee absolute protection.
                                        Report any unauthorized account activity immediately.
                                    </li>
                                    <li>
                                        <strong>Service Availability:</strong> While we aim to maintain
                                        uninterrupted service, periodic maintenance or updates may occur.
                                        We will communicate planned service interruptions where possible.
                                    </li>
                                    <li>
                                        <strong>Termination of Account:</strong> We reserve the right to
                                        suspend or terminate accounts involved in violations of these terms,
                                        fraud, or misuse of the platform.
                                    </li>
                                    <li>
                                        <strong>Changes to Terms:</strong> We may revise these terms from
                                        time to time. Continued use of SokoLangu signifies agreement with
                                        the updated terms.
                                    </li>
                                </ol>
                            </div>

                            <div className="part_2">
                                <h3>Privacy Policy</h3>
                                <p>
                                    At SokoLangu, we value and respect your privacy. This policy outlines
                                    how we handle your personal data:
                                </p>
                                <ol>
                                    <li>
                                        <strong>Information Collection:</strong> We collect your username,
                                        email, and password for account registration. Additional marketplace
                                        data may be gathered to enhance your user experience.
                                    </li>
                                    <li>
                                        <strong>Data Usage:</strong> Your personal information is used solely
                                        for providing and improving SokoLangu services. We do not sell or
                                        share your information with third parties.
                                    </li>
                                    <li>
                                        <strong>Data Security:</strong> We employ industry-standard security
                                        measures to protect your data from unauthorized access or misuse.
                                    </li>
                                    <li>
                                        <strong>Cookies:</strong> SokoLangu may use cookies to enhance your
                                        experience. You may modify your browser settings to disable cookies.
                                    </li>
                                    <li>
                                        <strong>Third-party Links:</strong> Our platform may contain links to
                                        external sites. We are not responsible for the privacy policies of
                                        third-party services.
                                    </li>
                                    <li>
                                        <strong>Children’s Privacy:</strong> SokoLangu is not intended for users
                                        under 13. We do not knowingly collect data from minors.
                                    </li>
                                    <li>
                                        <strong>Policy Updates:</strong> We may update this policy periodically.
                                        Significant changes will be communicated to users.
                                    </li>
                                </ol>
                            </div>

                            <div className="part_3">
                                <p>
                                    For any questions or concerns about our terms or privacy policy,
                                    please contact us at{" "}
                                    <a href="mailto:jumagobe3@gmail.com">jumagobe3@gmail.com</a>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}






        </>
    )
}

export default ConsumerSignup;
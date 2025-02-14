import React, { useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import axios from "axios";

import Footer from '../components/Footer';
import TopHeader from '../components/TopHeader';


import { api_url } from "../routes";


const ConsumerSettings = () => {
    const user = JSON.parse(localStorage.getItem("sessions")).user_id;
    const navigate = useNavigate();
    const [accountUpdate, setAccountUpdate] = useState({ updated: 0 });
    const [tableData, setTableData] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogType, setDialogType] = useState("");
    const [dialogFields, setDialogFields] = useState({ username: "" });


    const [errors, setErrors] = useState({

        response: "",
    });

    const [isLoading, setIsLoading] = useState(true); // For loading screen when page is changed


    const username_ref = useRef(),
        email_ref = useRef(),
        psk_ref = useRef(),
        cpsk_ref = useRef(),
        firstName_ref = useRef(),
        lastName_ref = useRef(),
        phone_ref = useRef(),
        region_ref = useRef(),
        Photo_ref = useRef();

    const handlePassword = () => {
        let psk_length = psk_ref.current.value.length,
            cpsk_length = cpsk_ref.current.value.length,
            show_btn = document.querySelector(".show_psk"),
            show_btn2 = document.querySelector(".show_psk2");

        if (psk_length >= 1) {
            show_btn.style.display = "block";
        } else {
            show_btn.style.display = "none";
        }

        if (cpsk_length >= 1) {
            show_btn2.style.display = "block";
        } else {
            show_btn2.style.display = "none";
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

    const handleViewpsk2 = (elem) => {
        const iconElement = elem.currentTarget.querySelector("i");

        if (cpsk_ref.current.type === "password") {
            cpsk_ref.current.type = "text";
            iconElement.className = "fa-solid fa-eye";
        } else {
            cpsk_ref.current.type = "password";
            iconElement.className = "fa-solid fa-eye-slash";
        }
    };

    const handleUpdateAccount = () => {
        //Validate the input fields
        const errors = {};
        const email_regex =
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const phone_regex = /^[07][0-9]{9}$/; // Kenyan phone numbers

        if (!username_ref.current.value.trim()) {
            errors.response = "Username Required";
        }

        if (!email_ref.current.value.trim()) {
            errors.response = "Email Required";
        } else if (!email_ref.current.value.match(email_regex)) {
            errors.response = "Invalid Email";
        }

        if (!firstName_ref.current.value.trim()) {
            errors.response = "First Name Required";
        }

        if (!lastName_ref.current.value.trim()) {
            errors.response = "Last Name Required";
        }

        if (!phone_ref.current.value.trim()) {
            errors.response = "Phone No. Required";
        } else if (!phone_ref.current.value.match(phone_regex)) {
            errors.response = "Invalid Phone Number";
        }

        if (!region_ref.current.value.trim()) {
            errors.response = "Region Required";
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

    const openDialogAccount = (x) => {
        if (x === "delete") {
            setDialogFields({
                dialogTitle: "Delete",
                username: username_ref.current.value,
            });

            setDialogType("delete");
            setIsDialogOpen(true);
            setErrors("");
        }
        else if (x === "changeProfile") {
            setDialogFields({
                dialogTitle: "Change Profile",
                username: "",
            });

            setDialogType("changeProfile");
            setIsDialogOpen(true);
            setErrors("");
        }
    };

    const handleSubmitUpdate = (e) => {
        e.preventDefault();

        const error_free = handleUpdateAccount();

        if (error_free) {
            let formData = new FormData();

            formData.append("new_username", username_ref.current.value);
            formData.append("new_fname", firstName_ref.current.value);
            formData.append("new_lname", lastName_ref.current.value);
            formData.append("new_phone", phone_ref.current.value);
            formData.append("new_email", email_ref.current.value);
            formData.append("new_region", region_ref.current.value);
            formData.append("new_psk", psk_ref.current.value);


            axios({
                //Update the new details
                method: "post",
                url: api_url + "/account/updateAccount.php",
                data: formData,
                params: { user_id: user },
                config: {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            })
                .then((response) => {
                    if (response.data == 1) {


                        toast.success("Updated successfully", {
                            position: "top-center",
                            autoClose: 1000,
                        });

                        setAccountUpdate((prevState) => {
                            return {
                                ...prevState,
                                updated: prevState.updated + 1,
                            };
                        });
                    } else if (response.data == 2) {
                        toast.error("Username or Email Exists", {
                            position: "top-center",
                            autoClose: 1000,
                        });
                    } else {
                        toast.error("Oops, Something's wrong :(", {
                            position: "top-center",
                            autoClose: 1000,
                        });
                    }
                })
                .catch((e) => {
                    toast.error("Network Error!", {
                        position: "top-center",
                        autoClose: 1000,
                    });
                });
        }
    };

    const handleChangeProfile = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append("photo", Photo_ref.current.files[0]);

        axios({
            method: "post",
            url: api_url + "/account/changeProfile.php",
            data: formData,
            params: { user_id: user },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })
            .then((response) => {
                if (response.data == 1) {
                    toast.success("Changed successfully", {
                        position: "top-center",
                        autoClose: 1000,
                    });


                    setAccountUpdate((prevState) => ({
                        ...prevState,
                        updated: prevState.updated + 1,
                    }));

                } else {
                    toast.error("Oops, Something's wrong :(", {
                        position: "top-center",
                        autoClose: 1000,
                    });
                }
            })
            .catch((e) => {
                toast.error("Network Error!", {
                    position: "top-center",
                    autoClose: 2000,
                });
            });

        setIsDialogOpen(false);
    };


    const handleDeleteAccount = (e) => {
        e.preventDefault();

        axios({
            //Delete the account in database
            method: "get",
            url: api_url + "/account/deleteAccount.php",
            params: { user_id: user },
            withCredentials: false,
        })
            .then((response) => {
                if (response.data == 1) {
                    localStorage.clear();

                    toast.success(
                        "Account Deleted Successfully. We'll Miss You! If you ever decide to come back, we'll be here for you.",
                        {
                            position: "top-center",
                            autoClose: 5000,
                        }
                    );

                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);
                } else {
                    toast.error("Oops, Something's wrong :(", {
                        position: "top-center",
                        autoClose: 1000,
                    });
                }
            })
            .catch((e) => {
                toast.error("Network Error!", {
                    position: "top-center",
                    autoClose: 1000,
                });
            });

        setIsDialogOpen(false);
    };



    useEffect(() => {
        axios({
            method: "get",
            url: api_url + "/account/getAccount.php",
            params: { user_id: user },
            withCredentials: false,
        })
            .then((response) => {
                setTableData(response.data);
            })
            .catch((e) => {
                console.log(e);
            });

        // if (tableData.length !== 0) {
        //     region_ref.current.value = tableData[0].region;
        // } else {
        //     region_ref.current.value = "Nairobi";
        // }
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, [accountUpdate]);




    return (
        <>

            <header className='header header_2'>
                <TopHeader />
            </header>


            <section className='get_started consumer_settings'>
                {
                    isLoading ? (
                        <span className="loader"></span>
                    )
                        :
                        <div className='content'>

                            <div className="title_part">
                                <h2>Account Settings</h2>
                            </div>

                            <div className="part_1">
                                <div className="img_part">
                                    <img src={tableData.length !== 0
                                        ? api_url + "/photos/profiles/" + tableData.map((row) => row.photo)
                                        : api_url + "/photos/profiles/" + "avatar.png"} alt={tableData.map((row) => row.username)} />
                                </div>

                                <button className="btn btn4 normal" onClick={() => openDialogAccount("changeProfile")}>Change</button>

                            </div>

                            <div className="part_2 form_part">
                                {errors.response !== "" ? (
                                    <span className="error_msg response_text">
                                        {errors.response}
                                    </span>
                                ) : null}
                                <form
                                    action=""
                                    method="post"
                                    className="setting_form"
                                    onSubmit={(e) => handleSubmitUpdate(e)}
                                >

                                    <div className="grouping">
                                        <div className="input_group">
                                            <label htmlFor="username">Username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                id="username"
                                                placeholder="Enter username"
                                                defaultValue={
                                                    tableData.length !== 0
                                                        ? tableData.map((row) => row.username)
                                                        : ""
                                                }
                                                required
                                                ref={username_ref}
                                            // {...formik.getFieldProps("username")}
                                            />
                                            {errors.username !== "" ? (
                                                <span className="error_msg">{errors.username}</span>
                                            ) : null}
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="firstName">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                id="firstName"
                                                placeholder="Enter first name"
                                                defaultValue={
                                                    tableData.length !== 0
                                                        ? tableData.map((row) => row.firstName)
                                                        : ""
                                                }
                                                required
                                                ref={firstName_ref}
                                            // {...formik.getFieldProps("username")}
                                            />
                                            {errors.first_name !== "" ? (
                                                <span className="error_msg">{errors.first_name}</span>
                                            ) : null}
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="lastName">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                id="lastName"
                                                placeholder="Enter last name"
                                                defaultValue={
                                                    tableData.length !== 0
                                                        ? tableData.map((row) => row.lastName)
                                                        : ""
                                                }
                                                required
                                                ref={lastName_ref}
                                            // {...formik.getFieldProps("username")}
                                            />
                                            {errors.last_name !== "" ? (
                                                <span className="error_msg">{errors.last_name}</span>
                                            ) : null}
                                        </div>
                                    </div>

                                    <div className="grouping">
                                        <div className="input_group">
                                            <label htmlFor="Phone">Phone No.</label>
                                            <input
                                                type="text"
                                                name="Phone"
                                                id="Phone"
                                                placeholder="Enter phone number"
                                                defaultValue={
                                                    tableData.length !== 0
                                                        ? tableData.map((row) => row.Phone)
                                                        : ""
                                                }
                                                required
                                                ref={phone_ref}
                                            // {...formik.getFieldProps("username")}
                                            />
                                            {errors.Phone !== "" ? (
                                                <span className="error_msg">{errors.Phone}</span>
                                            ) : null}
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="mail">Email Address</label>
                                            <input
                                                type="email"
                                                name="mail"
                                                id="mail"
                                                placeholder="Enter email address"
                                                defaultValue={
                                                    tableData.length !== 0
                                                        ? tableData.map((row) => row.email)
                                                        : ""
                                                }
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
                                                <select name="region" id="region"
                                                    required

                                                    defaultValue={tableData.length !== 0 ? tableData[0].region : "Nairobi"}
                                                    ref={region_ref}

                                                >

                                                    <option value="" disabled>-- Select Region --</option>
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
                                            </div>
                                        </div>
                                    </div>

                                    <div className="part_3">
                                        <div className="child">
                                            <div className="input_group">
                                                <label htmlFor="psk">New Password</label>
                                                <input
                                                    type="password"
                                                    name="psk"
                                                    id="psk"
                                                    placeholder="Enter New Password"
                                                    ref={psk_ref}
                                                    onChange={handlePassword}

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
                                                <label htmlFor="c_psk">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    name="c_psk"
                                                    id="c_psk"
                                                    placeholder="Confirm New Password"
                                                    ref={cpsk_ref}
                                                    onChange={handlePassword}

                                                // {...formik.getFieldProps("password")}
                                                />
                                                {errors.password !== "" ? (
                                                    <span className="error_msg">{errors.c_password}</span>
                                                ) : null}

                                                <div
                                                    className="show_psk2"
                                                    onClick={(e) => handleViewpsk2(e)}
                                                >
                                                    <i className="fa-solid fa-eye-slash"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="input_group">
                                        <button type="submit" style={{ display: "none" }}></button>
                                    </div>
                                </form>
                            </div>

                            <div className="grouping">
                                <div className="input_group">
                                    <button className="btn btn4 normal" onClick={handleSubmitUpdate}>
                                        Update Account
                                    </button>
                                </div>

                                <div className="input_group">
                                    <button
                                        className="btn delete_btn"
                                        onClick={() => openDialogAccount("delete")}
                                    >
                                        Delete Account
                                    </button>
                                </div>
                            </div>


                        </div>
                }

            </section>

            <Footer />

            {isDialogOpen && (
                <div className="dialog_container">
                    <div className="dialog_box">
                        <div className="close_part">
                            <button
                                className="btn close_btn"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                X
                            </button>
                        </div>

                        <div className="title_part">
                            <h2>{dialogFields.dialogTitle} My Account</h2>
                        </div>

                        <div className="form_part">
                            {dialogType === "delete" ? (
                                <form
                                    className="dialog_form"
                                    onSubmit={(e) => handleDeleteAccount(e)}
                                >
                                    <div className="input_group">
                                        <h3>
                                            Are you sure you want to delete this account of -{" "}
                                            <span style={{ color: "red" }}>
                                                {dialogFields.username}
                                            </span>
                                        </h3>
                                    </div>

                                    <div className="input_group">
                                        <button
                                            className="btn btn4 normal"
                                            type="submit"

                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </form>
                            ) : dialogType === "changeProfile" ? (
                                <form
                                    className="dialog_form"
                                    onSubmit={(e) => handleChangeProfile(e)}
                                >
                                    <div className="input_group">
                                        <label htmlFor="photo">Photo</label>
                                        <input
                                            type="file"
                                            name="photo"
                                            id="photo"
                                            placeholder="Choose profile photo"

                                            required
                                            ref={Photo_ref}
                                        />
                                    </div>

                                    <div className="input_group">
                                        <button
                                            className="btn btn4 normal"
                                            type="submit"

                                        >
                                            Confirm Profile
                                        </button>
                                    </div>
                                </form>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ConsumerSettings;
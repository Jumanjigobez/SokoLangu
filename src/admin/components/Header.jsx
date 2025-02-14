import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { menuOpen } from "../../store/actions";
import { api_url } from "../../routes";

const Header = () => {
    const [showProfileCont, setShowProfileCont] = useState(false);



    const user = JSON.parse(localStorage.getItem("sessions")).user_id;

    const [accountData, setAccountData] = useState([]);



    const navigate = useNavigate();

    const dispatch = useDispatch();
    const menuOpened = useSelector((state) => state.MenuReducer); //Access the global state from redux store for the menu sidebar functionality

    const handleMenuBtn = () => {
        if (menuOpened) {
            dispatch(menuOpen(false)); //dispatch for false to make the sidebar be closed
        } else {
            dispatch(menuOpen(true));
        }
    };

    const handleLogout = (e) => {
        e.target.disabled = true;



        let formData = new FormData();
        formData.append("user_id", user);

        axios({
            method: "post",
            url: api_url + "/logout.php",
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

                    localStorage.clear();

                    toast.success("Good Bye 👋", {
                        position: "top-center",
                        autoClose: 2000,
                    });

                    setTimeout(() => {
                        window.location.href = "/login";

                    }, 3000);
                } else {
                    toast.error(response.data, {
                        position: "top-center",
                        autoClose: 3000,
                    });
                }
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const handleGoToSettings = () => {
        navigate("/adminSettings")
    }

    useEffect(() => {
        axios({
            method: "get",
            url: api_url + "/admin/users.php",
            withCredentials: false,
        })
            .then((response) => {
                const filteredResponse = response.data.filter((row) => row.user_id === user)
                setAccountData(filteredResponse);
            })
            .catch((e) => {
                console.log(e);
            });


    }, []);


    // console.log(accountData)
    return (
        <>
            <header className="header dashHeader">
                <div
                    className={menuOpened ? "menu_btn active" : "menu_btn"}
                    onClick={handleMenuBtn}
                >
                    <span></span>
                    <span></span>
                    <span></span>
                </div>




                <div className="user_part">




                    <div
                        className="profile_part"
                        onClick={() => {
                            showProfileCont
                                ? setShowProfileCont(false)
                                : setShowProfileCont(true);
                        }}
                    >
                        <div className='img_part'>
                            {
                                accountData.length !== 0 ? (
                                    <img src={api_url + "/photos/profiles/" + accountData[0].photo} alt={accountData[0].username} />
                                )
                                    :
                                    (
                                        <img src={api_url + "/photos/profiles/" + "avatar.png"} alt={"Admin"} />
                                    )
                            }


                        </div>
                    </div>

                    <div
                        className={
                            showProfileCont ? "profile_container active" : "profile_container"
                        }
                    >
                        <div className="settings_part">
                            <button
                                className="btn btn3"
                                style={{ width: "100%" }}
                                onClick={handleGoToSettings}
                            >
                                My Profile

                            </button>
                        </div>

                        <div className="logout_part">
                            <button
                                className="btn"
                                style={{ width: "100%" }}
                                onClick={(e) => handleLogout(e)}
                            >
                                Log Out

                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <ToastContainer />
        </>
    );
};

export default Header;

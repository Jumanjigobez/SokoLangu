import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { menuOpen } from "../../store/actions";
import { api_url, LoggedIn } from "../../routes";

const Header = () => {
  const logged = LoggedIn;
  const [showProfileCont, setShowProfileCont] = useState(false);

  const user = JSON.parse(localStorage.getItem("sessions")).user_id;

  const [accountData, setAccountData] = useState([]),
    [loggedIn, setLoggedIn] = useState(logged),
    [messagesData, setMessagesData] = useState([]),
    [unseenCount, setUnseenCount] = useState(0);

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
            autoClose: 1000,
          });

          setTimeout(() => {
            window.location.href = "/login";
          }, 1100);
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
    navigate("/settings");
  };

  const fetchMessages = () => {
    axios({
      method: "get",
      params: { user_id: user },
      url: api_url + "/Messages/getMessages.php",
    })
      .then((response) => {
        setMessagesData(response.data.messages);
        setUnseenCount(response.data.unseenCount); // Store unseen messages count
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    axios({
      method: "get",
      url: api_url + "/account/getAccount.php",
      params: { user_id: user },
      withCredentials: false,
    })
      .then((response) => {
        setAccountData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    // Fetch messages data and unseen count every 3 second when user is logged in
    if (loggedIn) {
      const intervalId = setInterval(fetchMessages, 3000);

      return () => clearInterval(intervalId);
    }
  }, []);
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
          {/* The Message part*/}
          <button
            className="btn btn2 msgs_btn"
            onClick={() => navigate("/messagesFarmer")}
          >
            <i className="fa-solid fa-comments"></i>
            {unseenCount > 0 &&
              messagesData.filter(
                (msg) => user === msg.receiver_id && msg.seen === "No"
              ).length > 0 && <p className="msgs_count">{unseenCount}</p>}
          </button>

          <div
            className="profile_part"
            onClick={() => {
              showProfileCont
                ? setShowProfileCont(false)
                : setShowProfileCont(true);
            }}
          >
            <div className="img_part">
              <img
                src={
                  accountData.length !== 0
                    ? api_url +
                      "/photos/profiles/" +
                      accountData.map((row) => row.photo)
                    : api_url + "/photos/profiles/" + "avatar.png"
                }
                alt={accountData.map((row) => row.username)}
              />
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

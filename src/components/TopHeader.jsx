import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoggedIn } from "../routes";
import { api_url } from "../routes";
const TopHeader = () => {
  const logged = LoggedIn;
  const user = logged
      ? JSON.parse(localStorage.getItem("sessions")).user_id
      : "",
    user_role = logged
      ? JSON.parse(localStorage.getItem("sessions")).user_role
      : "";
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(logged),
    [showProfileCont, setShowProfileCont] = useState(false),
    [accountData, setAccountData] = useState([]),
    [messagesData, setMessagesData] = useState([]),
    [unseenCount, setUnseenCount] = useState(0);

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
    navigate("/consumerSettings");
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
    // Fetch account data (if needed)
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
      <div className="header_content">
        <div className="content">
          <div className="logo_part">
            <NavLink to="/">
              <img
                src="../images/logo.png"
                alt="SokoLangu"
                onClick={() => (window.location.href = "/")}
              />
            </NavLink>
          </div>

          {!loggedIn ? (
            <div className="part_2">
              <NavLink to="/login" className="login_btn">
                <button className="btn btn2">Login</button>
              </NavLink>
              <NavLink to="/getstarted">
                <button className="btn">SignUp</button>
              </NavLink>
            </div>
          ) : (
            <div className="part_2 user_part">
              {/* The Message part*/}
              <button
                className="btn btn2 msgs_btn"
                onClick={() => navigate("/messagesConsumer")}
              >
                <i className="fa-solid fa-comments"></i>
                {unseenCount > 0 &&
                  messagesData.filter((msg) => user === msg.receiver_id)
                    .length > 0 && <p className="msgs_count">{unseenCount}</p>}
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
                  showProfileCont
                    ? "profile_container active"
                    : "profile_container"
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

                {/* Show "View Wishlist" only if the user is NOT a farmer */}
                {user_role !== "farmer" && (
                  <div className="settings_part">
                    <button
                      className="btn btn3"
                      style={{ width: "100%" }}
                      onClick={() => navigate("/wishlist")}
                    >
                      View Wishlist
                    </button>
                  </div>
                )}

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
          )}
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default TopHeader;

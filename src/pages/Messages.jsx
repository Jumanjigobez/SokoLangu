import React, { useState, useRef, useEffect } from "react";

import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../components/Footer";
import TopHeader from "../components/TopHeader";
import axios from "axios";
import { api_url } from "../routes";
const Messages = () => {
  const user = JSON.parse(localStorage.getItem("sessions")).user_id;
  const navigate = useNavigate();
  const [MessagesData, setMessagesData] = useState([]),
    [isDialogOpen, setIsDialogOpen] = useState(false),
    [dialogType, setDialogType] = useState(""),
    [dialogFields, setDialogFields] = useState({}),
    [selectedUser, setSelectedUser] = useState(null),
    [unseenCount, setUnseenCount] = useState(0),
    [error, setError] = useState("");

  const [MessagesUpdate, setMessagesUpdate] = useState({
      updated: 0,
    }),
    [isLoading, setIsLoading] = useState(true); //For loading screen when page is changed

  const msg_input = useRef(),
    msg_part = useRef();

  // Handle user click to set the selected user and update seen status
  const handleUserClick = (receiver) => {
    setSelectedUser(receiver); // Update selected user

    // Update seen status to Yes for all messages from the selected user to the current user
    axios({
      method: "get",
      url: api_url + "/Messages/updateMessages.php",
      params: {
        user_id: user, // Consumer's user ID
        receiver_id: receiver.partner_id, // Farmer's user ID as the receiver_id
      },
    })
      .then((response) => {
        if (response.data) {
          // Update local state with the updated messages
          setMessagesData(response.data.messages);
          // Update unseen count
          setUnseenCount(response.data.unseenCount);
          setMessagesUpdate((prevState) => {
            return {
              ...prevState,
              updated: prevState.updated + 1,
            };
          });
        } else {
          console.error("Error updating messages.");
        }
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (!selectedUser) {
      console.log("No recipient selected.");
      return;
    }

    const message = msg_input.current.value.trim();
    if (message === "") return;

    // console.log({
    //     consumer_id: user, // Logged-in consumer (Sender)
    //     farmer_id: selectedUser.partner_id, // Selected farmer (Receiver)
    //     msg: message
    // });

    axios
      .post(
        api_url + "/Messages/sendChat.php",
        {
          consumer_id: user, // Logged-in consumer (Sender)
          farmer_id: selectedUser.partner_id, // Selected farmer (Receiver)
          msg: message,
        },
        {
          headers: {
            "Content-Type": "application/json", // Ensure content-type is JSON
          },
        }
      )
      .then((response) => {
        if (response.data === 1) {
          console.log("Message sent successfully!");
          msg_input.current.value = ""; // Clear the textarea after sending
          setMessagesUpdate((prevState) => ({
            ...prevState,
            updated: prevState.updated + 1,
          }));
        } else {
          console.log("Failed to send message.");
        }
      })
      .catch((error) => console.log("Error:", error));
  };

  const handleDeleteMessage = (id) => {
    axios({
      //Delete the row in the database
      method: "get",
      url: api_url + "/Messages/deleteMessage.php",
      params: { id: id },
      withCredentials: false,
    })
      .then((response) => {
        if (response.data == 1) {
          toast.success("Deleted Successfully", {
            position: "top-center",
            autoClose: 1000,
          });

          setMessagesUpdate((prevState) => {
            return {
              ...prevState,
              updated: prevState.updated + 1,
            };
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
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    msg_part.current.scrollTop = msg_part.current.scrollHeight;
  };

  // Function to truncate long messages
  const truncateMessage = (message, maxLength) => {
    if (message.length > maxLength) {
      return `${message.substring(0, maxLength)}...`;
    }
    return message;
  };

  useEffect(() => {
    //Axios to get Messages data

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

    // Set up an interval to fetch messages every 5 seconds (5000 milliseconds)
    // const intervalId = setInterval(() => {
    //   axios({
    //     method: "get",
    //     params: { user_id: user },
    //     url: api_url + "/Messages/getMessages.php",
    //   })
    //     .then((response) => {
    //       setMessagesData(response.data.messages);
    //       setUnseenCount(response.data.unseenCount); // Store unseen messages count
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //     });
    // }, 5000);

    // // Cleanup interval on component unmount
    // return () => clearInterval(intervalId);

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [MessagesUpdate]);

  useEffect(() => {
    if (selectedUser) {
      scrollToBottom(); // Scroll to bottom whenever selectedUser changes
    }
  }, [MessagesData, selectedUser]);

  // Process messages to group by receiver and count unseen messages
  const processedMessagesData = (
    Array.isArray(MessagesData) ? MessagesData : []
  ).reduce((acc, current) => {
    const isSender = current.sender_id === user;
    const isReceiver = current.receiver_id === user;

    if (isSender || isReceiver) {
      // Identify the conversation partner
      const partner_id = isSender ? current.receiver_id : current.sender_id;
      const partner_firstName = isSender
        ? current.receiver_firstName
        : current.sender_firstName;
      const partner_lastName = isSender
        ? current.receiver_lastName
        : current.sender_lastName;
      const partner_photo = isSender
        ? current.receiver_photo
        : current.sender_photo;

      let existing = acc.find((item) => item.partner_id === partner_id);

      if (!existing) {
        acc.push({
          partner_id,
          partner_firstName,
          partner_lastName,
          partner_photo,
          last_message: current.message,
          last_message_date: current.date,
          unseenCount: isReceiver && current.seen === "No" ? 1 : 0,
        });
      } else {
        const existingDate = new Date(existing.last_message_date);
        const currentDate = new Date(current.date);

        if (currentDate > existingDate) {
          Object.assign(existing, {
            last_message: current.message,
            last_message_date: current.date,
          });
        }

        if (isReceiver && current.seen === "No") {
          existing.unseenCount += 1;
        }
      }
    }

    return acc;
  }, []);

  const formatDate = (dateString) => {
    //used for formating the message date accordingly
    const date = new Date(dateString);
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options);
  };

  //   console.log(MessagesData);

  return (
    <>
      <header className="header header_2">
        <TopHeader />
      </header>

      <section className="get_started messages_container">
        <div className="go_back" style={{ margin: "1rem" }}>
          <button className="btn btn4 normal" onClick={() => navigate("/")}>
            Go back
          </button>
        </div>
        <div className="content">
          <div className="box box2 users_container">
            <div className="title_part">
              <h1>My Messages</h1>
            </div>

            {isLoading ? (
              <div className="users">
                <span className="loader"></span>
              </div>
            ) : (
              <div className="users">
                {processedMessagesData.length !== 0 ? (
                  processedMessagesData.map((row) => (
                    <div
                      className={`user_box ${
                        selectedUser &&
                        selectedUser.partner_id === row.partner_id
                          ? "active"
                          : ""
                      }`}
                      key={row.partner_id}
                      onClick={() => handleUserClick(row)}
                    >
                      <div className="img_part">
                        <img
                          src={
                            api_url + "/photos/profiles/" + row.partner_photo
                          }
                          alt={row.partner_firstName}
                        />
                      </div>

                      <div className="info_part">
                        <h2>
                          {row.partner_firstName} {row.partner_lastName}
                        </h2>
                        <p style={{ position: "relative" }}>
                          <span
                            dangerouslySetInnerHTML={{
                              __html:
                                user !== row.partner_id
                                  ? `<b>You:</b> ${truncateMessage(
                                      row.last_message,
                                      30
                                    )}`
                                  : truncateMessage(row.last_message, 30),
                            }}
                          ></span>
                          {row.unseenCount > 0 &&
                            MessagesData.filter(
                              (msg) =>
                                user === msg.receiver_id && msg.seen === "No"
                            ).length > 0 && (
                              <span
                                className="msgs_count"
                                style={{ right: "-10%", top: "-10%" }}
                              >
                                {row.unseenCount}
                              </span>
                            )}
                        </p>
                        {unseenCount > 0 && user !== row.partner_id && (
                          <span className="msgs_count">{unseenCount}</span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty">
                    <p style={{ color: "var(--black)", fontWeight: "bold" }}>
                      No Farmers Found! Please Place Order
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="box box2 msg_container">
            <div className="header_part">
              {selectedUser ? (
                processedMessagesData.length !== 0 && (
                  <>
                    <div className="img_part">
                      <img
                        src={
                          api_url +
                          "/photos/profiles/" +
                          selectedUser.partner_photo
                        }
                        alt={`${selectedUser.partner_firstName} ${selectedUser.partner_lastName}`}
                        className="user_photo"
                      />
                    </div>

                    <div className="name_part">
                      <h2>
                        {selectedUser.partner_firstName}{" "}
                        {selectedUser.partner_lastName}
                      </h2>
                    </div>

                    <div className="">
                      <button
                        className="btn btn4 normal"
                        onClick={() => setSelectedUser(null)}
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </div>
                  </>
                )
              ) : (
                <div className="name_part">
                  <h2>Message Room</h2>
                </div>
              )}
            </div>

            <div className="msg_part" ref={msg_part}>
              {selectedUser ? (
                <div className="msg_content">
                  {MessagesData.filter(
                    (msg) =>
                      (msg.sender_id === user &&
                        msg.receiver_id === selectedUser.partner_id) ||
                      (msg.sender_id === selectedUser.partner_id &&
                        msg.receiver_id === user)
                  )
                    .sort((a, b) => new Date(a.date) - new Date(b.date)) // Oldest to newest
                    .map((msg) => (
                      <div
                        className={`msg_box ${
                          msg.sender_id === user ? "receiver" : "sender"
                        }`}
                        key={msg.msg_id}
                      >
                        <p>{msg.message}</p>
                        <span className="msg_date">{formatDate(msg.date)}</span>
                        {msg.sender_id === user && (
                          <span
                            className="msg_delete"
                            onClick={() => handleDeleteMessage(msg.msg_id)}
                          >
                            <i className="fa-solid fa-trash-can"></i>
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="awaiting_box">
                  <i className="fa-solid fa-comments"></i>
                  <h2 style={{ color: "var(--black)", fontWeight: "bold" }}>
                    Select a conversation to view messages.
                  </h2>
                </div>
              )}
            </div>

            <div className="send_part">
              {selectedUser && (
                <form
                  className="msg_form"
                  onSubmit={(e) => handleSendMessage(e)}
                >
                  <div className="input_group">
                    <textarea
                      name="msg"
                      id="msg"
                      className="textarea_chat"
                      placeholder="Type a message..."
                      required
                      ref={msg_input}
                    ></textarea>
                  </div>

                  <div className="btn_part">
                    <button type="submit" className="btn btn2">
                      <i className="fa-solid fa-paper-plane"></i>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Messages;

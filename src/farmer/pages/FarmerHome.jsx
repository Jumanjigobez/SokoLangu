import { React, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import axios from "axios";
import { api_url } from "../../routes";

const FarmerHome = () => {
  const user = JSON.parse(localStorage.getItem("sessions")).user_id;
  const [userUpdate, setUserUpdate] = useState({
    updated: 0,
  }), //check if api has updated the todos
    [userData, setUserData] = useState([]),
    [isLoading, setIsLoading] = useState(true); //For loading screen when page is changed

  useEffect(() => {
    //Axios to get todo data

    axios({
      method: "get",
      url: api_url + "/farmer/data.php",
      params: { user_id: user },
      withCredentials: false,
    })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [userUpdate]);

  // Destructuring userData with checks to prevent errors if the data isn't available
  const { products = [], orders = [], messages = [] } = userData || {};

  // Calculate TotalSales, PendingOrders, and NewMessages
  const TotalSales = orders ? (orders.filter((order) => order.OrderStatus === "Completed")).length : 0;
  const PendingOrders = orders ? (orders.filter((order) => order.OrderStatus === "Pending")).length : 0;
  const NewMessages = messages ? (messages.filter((msg) => msg.Seen === "No")).length : 0;


  return (
    <>
      <section id="active">
        <Sidebar />

        <div className="container dashContainer">
          <Header />

          <div className="content_part">
            {isLoading ? (
              <span className="loader"></span>
            ) : (
              <>
                <NavLink to="/products">
                  <div className="box admin_box">
                    <div className="icon_part">
                      <i class="fa-solid fa-apple-alt"></i>
                    </div>
                    <div className="text_part">
                      <h2 className="count">{products.length}</h2>
                      <p>Total Products</p>

                    </div>
                  </div>
                </NavLink>

                <NavLink to="/orders">
                  <div className="box admin_box">
                    <div className="icon_part">
                      <i class="fa-solid fa-users"></i>
                    </div>
                    <div className="text_part">
                      <h2 className="count">{TotalSales}</h2>
                      <p>Total Sales</p>

                    </div>
                  </div>
                </NavLink>

                <NavLink to="/orders">
                  <div className="box admin_box">
                    <div className="icon_part">
                      <i class="fa-solid fa-cubes"></i>
                    </div>
                    <div className="text_part">
                      <h2 className="count">{PendingOrders}</h2>
                      <p>Pending Orders</p>

                    </div>
                  </div>
                </NavLink>

                <NavLink to="/messagesFarmer">
                  <div className="box admin_box">
                    <div className="icon_part">
                      <i class="fa-solid fa-comment-dots"></i>
                    </div>
                    <div className="text_part">
                      <h2 className="count">{NewMessages}</h2>
                      <p>New Messages</p>

                    </div>
                  </div>
                </NavLink>


              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default FarmerHome;

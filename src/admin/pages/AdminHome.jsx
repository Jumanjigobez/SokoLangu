import { React, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import axios from "axios";
import { api_url } from "../../routes";

const AdminHome = () => {

  const [userUpdate, setUserUpdate] = useState({
    updated: 0,
  }), //check if api has updated the todos
    [userData, setUserData] = useState([]),
    [productData, setProductData] = useState([]),
    [isLoading, setIsLoading] = useState(true); //For loading screen when page is changed

  useEffect(() => {
    //Axios to get todo data

    axios({
      method: "get",
      url: api_url + "/admin/users.php",
      withCredentials: false,
    })
      .then((response) => {
        setUserData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    axios({
      method: "get",
      url: api_url + "/admin/products.php",
      withCredentials: false,
    })
      .then((response) => {
        setProductData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });


    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, [userUpdate]);


  const Total_farmers = userData.filter((user) => user.role === "farmer").length,
    Total_consumers = userData.filter((user) => user.role === "consumer").length,
    Total_online = userData.filter((user) => user.status === "online").length;

  const Total_products = productData.length;


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
                <NavLink to="/usersManagement">
                  <div className="box admin_box">
                    <div className="icon_part">
                      <i class="fa-solid fa-users-line"></i>
                    </div>
                    <div className="text_part">
                      <h2 className="count">{Total_farmers}</h2>
                      <p>Total Farmers</p>

                    </div>
                  </div>
                </NavLink>

                <NavLink to="/usersManagement">
                  <div className="box admin_box">
                    <div className="icon_part">
                      <i class="fa-solid fa-users"></i>
                    </div>
                    <div className="text_part">
                      <h2 className="count">{Total_consumers}</h2>
                      <p>Total Consumers</p>

                    </div>
                  </div>
                </NavLink>

                <NavLink to="/usersManagement">
                  <div className="box admin_box">
                    <div className="icon_part">
                      <i class="fa-solid fa-signal"></i>
                    </div>
                    <div className="text_part">
                      <h2 className="count">{Total_online}</h2>
                      <p>Total Online</p>

                    </div>
                  </div>
                </NavLink>

                <NavLink to="/productsManagement">
                  <div className="box admin_box">
                    <div className="icon_part">
                      <i class="fa-solid fa-apple-alt"></i>
                    </div>
                    <div className="text_part">
                      <h2 className="count">{Total_products}</h2>
                      <p>Total Products</p>

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

export default AdminHome;

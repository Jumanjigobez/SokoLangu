import React, { useState, useEffect, useRef } from "react";

import { Navigate, NavLink, useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import TopHeader from "../components/TopHeader";
import Footer from "../components/Footer";

import axios from "axios";
import { api_url } from "../routes";
const ProductView = () => {
  const { productID } = useParams(); // Get the product ID from URL

  const user = JSON.parse(localStorage.getItem("sessions")).user_id;

  const navigate = useNavigate();

  const [productsData, setProductsData] = useState([]),
    [farmerProductsData, setFarmerProductsData] = useState([]),
    [filteredProductsData, setFilteredProductsData] = useState([]),
    [wishlist, setWishlist] = useState([]),
    [loading, setIsLoading] = useState(true),
    [isDialogOpen, setIsDialogOpen] = useState(false),
    [dialogType, setDialogType] = useState(""),
    [dialogFields, setDialogFields] = useState({}),
    [error, setError] = useState(""),
    [Total_Price, setTotal_Price] = useState({
      total: !isDialogOpen && 0,
    }),
    [addWish, setAddWish] = useState(true),
    [isInWishlist, setIsInWishlist] = useState(false);

  const quantity_input = useRef(),
    msg_input = useRef();

  const handleCategoryChange = (category) => {
    if (category === "All") {
      setFilteredProductsData(farmerProductsData); // Show all products if "All" is selected
    } else {
      const filteredData = farmerProductsData.filter(
        (product) => product.Category === category
      );
      setFilteredProductsData(filteredData); // Set the filtered products based on the selected category
    }
  };

  const openDialogOrder = (type, productID) => {
    if (type === "order") {
      setDialogFields({
        dialogTitle: "Place Order",
        Id: productID,
      });

      setDialogType("add");
      setIsDialogOpen(true);
      setError("");
      setTotal_Price({ total: 0 });
    }
  };

  const handlePlaceOrder = (e, productID) => {
    e.preventDefault();
    let formData = new FormData();

    formData.append("ProductId", productID);
    formData.append("Quantity", quantity_input.current.value);
    formData.append("TotalPrice", String(Total_Price.total));

    axios({
      method: "post",
      url: api_url + "/consumer/placeOrders.php",
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
          toast.success("Placed order successfully", {
            position: "top-center",
            autoClose: 1000,
          });

          let formData = new FormData();
          formData.append("ProductId", productID);
          formData.append(
            "msg",
            "Hello, I've just placed an order. Kindly review and respond as soon as possible. Thank you!"
          );

          axios({
            // Alert the order to the farmer
            method: "post",
            url: api_url + "/message.php",
            data: formData,
            params: { user_id: user },
            config: {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          }).catch((e) => {
            console.error("Error sending the message:", e);
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

    setIsDialogOpen(false);
  };

  const handleCalculateTotal = (e) => {
    if (quantity_input.current.value !== 0) {
      setTotal_Price({
        total:
          Number(quantity_input.current.value) * Number(productsData[0].Price),
      });
    } else {
      setTotal_Price({
        total: 0,
      });
    }

    // console.log(Total_Price);
  };

  const toggleWish = (elem, productID) => {
    if (addWish) {
      handleAddWish(elem, productID);
    } else {
      handleRemoveWish(elem, productID);
    }
    // Toggle the addWish state
    setAddWish(!addWish);
  };

  const handleAddWish = (elem, productID) => {
    let formData = new FormData();

    formData.append("ProductId", productID);

    axios({
      // Update the new task and status in the database
      method: "post",
      url: api_url + "/wish.php",
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
          toast.success("Added to Wishlist successfully", {
            position: "top-center",
            autoClose: 1000,
          });

          elem.classList.add("active"); // Make the Love button active
        } else {
          toast.error(response.data, {
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

  const handleRemoveWish = (elem, productID) => {
    let formData = new FormData();

    formData.append("ProductId", productID);

    axios({
      // Update the new task and status in the database
      method: "post",
      url: api_url + "/Wish/deleteWish.php",
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
          toast.success("Removed from Wishlist successfully", {
            position: "top-center",
            autoClose: 1000,
          });

          elem.classList.remove("active"); // Make the Love button inactive
        } else {
          toast.error(response.data, {
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

  const handleSendMessage = (e, productID) => {
    e.preventDefault();

    let formData = new FormData();

    formData.append("ProductId", productID);
    formData.append(
      "msg",
      msg_input.current.value.replace(/(\r\n|\n|\r)/gm, "").trim()
    );

    axios({
      method: "post",
      url: api_url + "/message.php",
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
          toast.success("Message Sent successfully", {
            position: "top-center",
            autoClose: 1000,
          });

          msg_input.current.value = ""; //reset the msg value
        } else {
          toast.error(response.data, {
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
    //Axios to get products data
    axios({
      method: "get",
      params: { product_id: productID },
      url: api_url + "/consumer/getProductData.php",
    })
      .then((response) => {
        setProductsData(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    //Fetch more products from the farmer of that productID
    axios({
      method: "get",
      params: { product_id: productID },
      url: api_url + "/consumer/farmerProducts.php",
    })
      .then((response) => {
        setFarmerProductsData(response.data);
        setFilteredProductsData(response.data); // Initialize the filtered data with all products
      })
      .catch((e) => {
        console.log(e);
      });

    //Fetch wishlist
    axios({
      method: "get",
      params: { user_id: user },
      url: api_url + "/Wish/getWish.php",
    })
      .then((response) => {
        setWishlist(response.data);
      })
      .catch((e) => {
        console.log(e);
      });

    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  // console.log(productsData);
  // console.log("farmersProd: ", farmerProductsData);

  // console.log(wishlist)

  return (
    <>
      <header className="header header_2">
        <TopHeader />
      </header>

      <section className="get_started produce_container">
        <div className="go_back" style={{ marginLeft: "1rem" }}>
          <button className="btn btn4 normal" onClick={() => navigate("/")}>
            Go back
          </button>
        </div>

        {loading ? (
          <div className="content">
            <span className="loader"></span>
          </div>
        ) : (
          <>
            {productsData.length !== 0 ? (
              productsData.map((row) => {
                const isInWishlist = wishlist.some(
                  (item) => item.ProductID === row.Id
                );
                return (
                  <div className="content" key={row.Id}>
                    <div className="part_1">
                      <div className="img_part">
                        <NavLink
                          to={`${api_url}/photos/products/${row.Img}`}
                          target="_blank"
                        >
                          <img
                            src={`${api_url}/photos/products/${row.Img}`}
                            alt={row.Name}
                          />
                        </NavLink>
                      </div>

                      <div className="box box2 produceView">
                        <div className="part_1">
                          <div className="txt">
                            <h1>{row.Name}</h1>
                            <button
                              className={`btn btn2 ${isInWishlist ? "active" : ""
                                }`}
                              onClick={(e) =>
                                toggleWish(e.currentTarget, row.Id)
                              }
                            >
                              <i className="fa-solid fa-heart"></i>
                            </button>
                          </div>

                          <div className="txt">
                            <p>
                              <i className="fa-solid fa-location"></i>{" "}
                              {row.Region}
                            </p>
                          </div>
                        </div>

                        <div className="part_2 txt_part">
                          <div className="txt">
                            <h2>Category</h2>
                            <p>{row.Category}</p>
                          </div>

                          <div className="txt">
                            <h2>Description</h2>
                            <p dangerouslySetInnerHTML={{ __html: row.Description.replace(/\\n/g, '<br />') }} />
                          </div>

                          <div className="btn_part">
                            <button
                              className="btn"
                              onClick={() => openDialogOrder("order", row.Id)}
                            >
                              Place Order
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="part_2">
                      <div className="box box2 produceView">
                        <h2>
                          Ksh{" "}
                          {Number(row.Price.replace(/,/g, "")).toLocaleString()}
                        </h2>
                        <button
                          className="btn"
                          onClick={() => openDialogOrder("order", row.Id)}
                        >
                          Place Order
                        </button>
                      </div>

                      <div className="box box2 produceView">
                        <div className="profile">
                          <div className="name_part">
                            <div className="img_part">
                              <img
                                src={`${api_url}/photos/profiles/${row.FarmerPhoto}`}
                                alt={row.FarmerFirstName}
                              />
                            </div>
                            <h2>
                              {row.FarmerFirstName} {row.FarmerLastName}
                            </h2>
                          </div>

                          <div className="btn_part">
                            <NavLink to={`tel:${row.FarmerPhone}`}>
                              <button className="btn">
                                <i className="fa-solid fa-phone"></i> Make a
                                Call
                              </button>
                            </NavLink>
                          </div>
                        </div>

                        <div className="form_part">
                          <form
                            method="post"
                            onSubmit={(e) => handleSendMessage(e, row.Id)}
                          >
                            <div className="input_group">
                              <textarea
                                name="msg"
                                id="msg"
                                cols="30"
                                rows="10"
                                placeholder="Type a message..."
                                required
                                ref={msg_input}
                              ></textarea>
                            </div>

                            <div className="btn_part">
                              <button type="submit" className="btn">
                                Send Message
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No products available.</p>
            )}
          </>
        )}
      </section>

      <section className="produce_display">
        <div className="content">
          <div className="display_part">
            <div className="part_1">
              <h2>More from The Farmer</h2>
              <div className="custom_select">
                <select
                  name="category"
                  id="category_select"
                  defaultValue={"All"}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Grains">Grains</option>
                  <option value="Legumes">Legumes</option>
                  <option value="Roots & Tubers">Roots & Tubers</option>
                  <option value="Nuts & Seeds">Nuts & Seeds</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Meat">Meat</option>
                  <option value="Poultry">Poultry</option>
                  <option value="Fish & Seafood">Fish & Seafood</option>
                  <option value="Herbs & Spices">Herbs & Spices</option>
                  <option value="Oils & Fats">Oils & Fats</option>
                  <option value="Flowers & Ornamental Plants">
                    Flowers & Ornamental Plants
                  </option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="container">
              {loading ? (
                <span className="loader"></span>
              ) : (
                <>
                  {filteredProductsData.length !== 0 ? (
                    filteredProductsData.map((row) => (
                      <NavLink
                        to={`/productView/${row.Id}`}
                        key={row.Id}
                        onClick={() =>
                          (window.location.href = `/productView/${row.Id}`)
                        }
                      >
                        <div className="box">
                          <div className="img_part">
                            <img
                              src={`${api_url}/photos/products/${row.Img}`}
                              alt={row.Name}
                            />
                          </div>
                          <div className="name_part">
                            <h3>{row.Name}</h3>
                            <p className="price_txt">
                              Ksh{" "}
                              {Number(
                                row.Price.replace(/,/g, "")
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </NavLink>
                    ))
                  ) : (
                    <div className="empty">
                      <p style={{ color: "var(--black)", fontWeight: "bold" }}>
                        Oops! No Products Found
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      {isDialogOpen && (
        <div className="dialog_container">
          <div className="dialog_box Order_dialog">
            <div className="close_part">
              <button
                className="btn close_btn btn4 normal"
                onClick={() => setIsDialogOpen(false)}
              >
                X
              </button>
            </div>

            <div className="title_part">
              <h2>{dialogFields.dialogTitle}</h2>
            </div>

            <div className="form_part Order_form">
              {error !== "" ? <span className="error_msg">{error}</span> : null}
              {dialogType === "add" ? (
                <form
                  className="dialog_form"
                  onSubmit={(e) => handlePlaceOrder(e, dialogFields.Id)}
                >
                  <div className="input_group">
                    <label htmlFor="quantity">Quantity</label>

                    <input
                      type="number"
                      name="quantity"
                      id="quantity"
                      placeholder="Enter quantity"
                      min={1}
                      max={100000000}
                      defaultValue={0}
                      required
                      onChange={(e) => handleCalculateTotal(e)}
                      onInput={(e) => {
                        const value = parseInt(e.target.value);
                        if (value < 1) {
                          e.target.value = 1;
                        } else if (value > 100000000) {
                          e.target.value = 100000000; // Cap the value at the maximum limit
                        }
                      }} //Prevents negatives
                      onKeyDown={(e) => {
                        // Prevent non-numeric characters and prevent 'e', '.', '-', '+'
                        if (["e", "E", ".", "-", "+"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      ref={quantity_input}
                    />
                  </div>

                  <div className="input_group">
                    <h2
                      style={{
                        textAlign: "center",
                        fontSize: "4em",
                      }}
                    >
                      Ksh {Number(Total_Price.total).toLocaleString()}
                    </h2>
                  </div>

                  <div className="part_3">
                    <div className="input_group">
                      <button type="submit" className="btn btn4 normal">
                        Confirm
                      </button>
                    </div>
                  </div>
                </form>
              ) : null}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ProductView;

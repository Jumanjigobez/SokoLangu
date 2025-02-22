import React, { useState, useEffect, useRef } from "react";

import { NavLink, useParams, useNavigate } from "react-router-dom";

import TopHeader from "../components/TopHeader";

import Footer from "../components/Footer";
import { api_url } from "../routes";

import axios from "axios";
const ProductSearch = () => {
  const navigate = useNavigate();
  const { search_term } = useParams(); //Get the search_term from URL

  const user = JSON.parse(localStorage.getItem("sessions")).user_id;

  const [productsData, setProductsData] = useState([]),
    [filteredProductsData, setFilteredProductsData] = useState([]),
    [loading, setIsLoading] = useState(true);

  const search_input = useRef();

  const handleRegionFilter = () => {
    axios({
      method: "get",
      params: { user_id: user, search_term: search_term },
      url: api_url + "/consumer/filterRegionSearch.php",
    })
      .then((response) => {
        setProductsData(response.data);
        setFilteredProductsData(response.data); // Initialize the filtered data with all products
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleSearchFilter = (type, value) => {
    let filteredData = [];

    switch (type) {
      case "region":
        if (value === "All") {
          handleRegionFilter();
        } else {
          filteredData = productsData.filter(
            (product) => product.Region === value
          );
        }
        break;

      case "category":
        if (value === "All") {
          filteredData = productsData;
        } else {
          filteredData = productsData.filter(
            (product) => product.Category === value
          );
        }
        break;

      case "latest":
        filteredData = productsData
          .slice()
          .sort((a, b) => new Date(b.UploadDate) - new Date(a.UploadDate));
        break;

      case "lowest":
        filteredData = productsData.slice().sort((a, b) => a.Price - b.Price);
        break;

      case "highest":
        filteredData = productsData.slice().sort((a, b) => b.Price - a.Price);
        break;

      default:
        filteredData = productsData;
        break;
    }

    setFilteredProductsData(filteredData);
  };

  const handleSearchProduce = (e) => {
    e.preventDefault();
    var search_term = search_input.current.value;

    if (search_term !== "") {
      window.location.href = `/productSearch/${search_term}`;
    }
  };

  useEffect(() => {
    //Axios to get products data
    axios({
      method: "get",
      params: { user_id: user, search_term: search_term },
      url: api_url + "/consumer/searchProducts.php",
    })
      .then((response) => {
        setProductsData(response.data);
        setFilteredProductsData(response.data); // Initialize the filtered data with all products
      })
      .catch((e) => {
        console.log(e);
      });
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  console.log(filteredProductsData);
  return (
    <>
      <header className="header header_2">
        <TopHeader />
      </header>

      <section className="produce_display">
        <div className="go_back" style={{ margin: "1rem" }}>
          <button className="btn btn4 normal" onClick={() => navigate("/")}>
            Go back
          </button>
        </div>
        <div className="content">
          <div className="search_part">
            <form
              className="search_form"
              onSubmit={(e) => handleSearchProduce(e)}
            >
              <div className="input_group">
                <input
                  type="text"
                  name="search"
                  className="search"
                  placeholder="Search fresh produce near you..."
                  defaultValue={search_term}
                  ref={search_input}
                  required
                />
              </div>

              <div className="input_group">
                <button type="submit" name="searchProduce" className="btn btn4">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>
          </div>

          <div className="display_part">
            <div className="part_1 filter_part">
              <h2>Filter:</h2>
              <div className="custom_select">
                <select
                  id="region_select"
                  name="region"
                  defaultValue={""}
                  onChange={(e) => handleSearchFilter("region", e.target.value)}
                >
                  <option value="">--Region--</option>
                  <option value="All">All</option>
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

              <div className="custom_select">
                <select
                  id="category_select"
                  name="category"
                  defaultValue={
                    filteredProductsData.length !== 0
                      ? filteredProductsData.map((row) => row.Category)
                      : ""
                  }
                  onChange={(e) =>
                    handleSearchFilter("category", e.target.value)
                  }
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

              <div className="custom_select">
                <select
                  id="sort_select"
                  name="sort"
                  defaultValue={"latest"}
                  onChange={(e) =>
                    handleSearchFilter(e.target.value, e.target.value)
                  }
                >
                  <option value={"latest"}>Latest</option>
                  <option value={"lowest"}>Lowest Price</option>
                  <option value={"highest"}>Highest Price</option>
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
                      <NavLink to={`/productView/${row.Id}`} key={row.Id}>
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

      <Footer />
    </>
  );
};

export default ProductSearch;

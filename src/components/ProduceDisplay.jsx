import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';

import { NavLink, useNavigate } from 'react-router-dom';
import { api_url, LoggedIn } from '../routes';
const ProduceDisplay = () => {
    const navigate = useNavigate();
    const user = LoggedIn ? JSON.parse(localStorage.getItem("sessions")).user_id : "";

    const [productsData, setProductsData] = useState([]),
        [filteredProductsData, setFilteredProductsData] = useState([]),
        [loading, setIsLoading] = useState(true);


    const search_input = useRef();

    const handleSearchProduce = (e) => {
        e.preventDefault();
        var search_term = search_input.current.value;

        if (search_term !== "") {
            navigate(`/productSearch/${search_term}`)
        }

    }

    const handleCategoryChange = (category) => {
        if (category === "All") {
            setFilteredProductsData(productsData); // Show all products if "All" is selected
        } else {
            const filteredData = productsData.filter((product) => product.Category === category);
            setFilteredProductsData(filteredData); // Set the filtered products based on the selected category
        }


    }
    useEffect(() => {
        //Axios to get products data
        if (LoggedIn) {
            axios({
                method: "get",
                params: { user_id: user },
                url: api_url + "/consumer/getProducts.php",

            })
                .then((response) => {
                    setProductsData(response.data);
                    setFilteredProductsData(response.data); // Initialize the filtered data with all products
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            axios({
                method: "get",
                url: api_url + "/consumer/productsData.php",//fetch All by default regardless of region

            })
                .then((response) => {
                    setProductsData(response.data);
                    setFilteredProductsData(response.data); // Initialize the filtered data with all products
                })
                .catch((e) => {
                    console.log(e);
                });
        }

        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, [])

    // console.log(productsData);
    // console.log("filter:", filteredProductsData);


    return (
        <section className='produce_display'>

            <div className='content'>
                <div className='search_part'>
                    <form className='search_form' onSubmit={(e) => handleSearchProduce(e)}>
                        <div className='input_group'>
                            <input type='text' name='search' className='search' placeholder='Search fresh produce near you...' required ref={search_input} />
                        </div>

                        <div className='input_group'>
                            <button type='submit' name='searchProduce' className='btn btn4'><i className='fas fa-search'></i></button>
                        </div>
                    </form>
                </div>

                <div className='display_part'>
                    <div className='part_1'>
                        <h2>Latest Produce</h2>
                        <div className='custom_select'>

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
                                <option value="Flowers & Ornamental Plants">Flowers & Ornamental Plants</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                    </div>

                    <div className='container'>
                        {
                            loading ? (
                                <span className='loader'></span>
                            )
                                :
                                <>
                                    {
                                        filteredProductsData.length !== 0 ? (
                                            filteredProductsData.map((row) => (
                                                <NavLink to={`/productView/${row.Id}`} key={row.Id}>
                                                    <div className="box">
                                                        <div className="img_part">
                                                            <img src={`${api_url}/photos/products/${row.Img}`} alt={row.Name} />
                                                        </div>
                                                        <div className="name_part">
                                                            <h3>{row.Name}</h3>
                                                            <p className="price_txt">Ksh{" "}
                                                                {Number(
                                                                    row.Price.replace(/,/g, "")
                                                                ).toLocaleString()}</p>
                                                        </div>
                                                    </div>
                                                </NavLink>
                                            ))
                                        ) : (
                                            <div className='empty'>
                                                <p style={{ color: "var(--black)", fontWeight: "bold" }}>Oops! No Products Found</p>
                                            </div>
                                        )
                                    }
                                </>

                        }





                    </div>

                </div>


            </div>
        </section>
    );
}

export default ProduceDisplay;
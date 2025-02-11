import React, { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

import TopHeader from "../components/TopHeader";
import axios from "axios";
import { api_url } from "../routes";
import { NavLink } from "react-router-dom";
import Footer from "../components/Footer";

const Wishlist = () => {
    const user = JSON.parse(localStorage.getItem("sessions")).user_id;

    const [ProductsData, setProductsData] = useState([]),
        [isDialogOpen, setIsDialogOpen] = useState(false),
        [dialogType, setDialogType] = useState(""),
        [dialogFields, setDialogFields] = useState({}),
        [boxMarked, setBoxMarked] = useState(false),
        [checkedFields, setCheckedFields] = useState({
            Ids: [],
        }),
        [error, setError] = useState("");

    const [ProductsUpdate, setProductsUpdate] = useState({
        updated: 0,
    }),
        [isLoading, setIsLoading] = useState(true); //For loading screen when page is changed



    const SearchTerm = useRef();

    const GetDate = () => {
        let today = new Date(),
            day = today.getDate(),
            month = today.getMonth() + 1,
            year = today.getFullYear();

        let date = day + "/" + month + "/" + year;

        return date;
    };

    const handleProductSubmit = (e) => {
        e.preventDefault();
        handleSearchProduct();
    };

    const handleSearchProduct = () => {
        if (SearchTerm.current.value.length >= 1) {
            let formData = new FormData();

            formData.append("search_term", SearchTerm.current.value);

            axios({
                method: "post",
                url: api_url + "/Wish/wishSearch.php",
                data: formData,
                params: { user_id: user },
                config: {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            })
                .then((response) => {
                    setProductsData(response.data);
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            axios({
                method: "get",
                params: { user_id: user },
                url: api_url + "/Wish/getWish.php",
            })
                .then((response) => {
                    setProductsData(response.data);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };
    const openDialogProduct = (type, e) => {
        let row = e.target.parentElement.parentElement,
            fields = row.querySelectorAll("td");

        if (type === "edit") {
            return
        } else if (type === "delete") {
            setDialogFields({
                dialogTitle: "Delete",
                Name: fields[4].innerText,
                Id: fields[0].innerText,
            });

            setDialogType("delete");
            setIsDialogOpen(true);
            setError("");
        } else if (type === "delete marked") {
            setDialogFields({
                dialogTitle: "Delete Marked",

                Id: checkedFields.Ids,
            });

            setDialogType("delete marked");
            setIsDialogOpen(true);
            setError("");
        }
    };







    const handleDeleteProduct = (e, row_id) => {
        e.preventDefault();

        axios({
            //Delete the row in the database
            method: "get",
            url: api_url + "/Wish/deleteWish.php",
            params: { id: row_id },
            withCredentials: false,
        })
            .then((response) => {
                if (response.data == 1) {
                    toast.success("Deleted Successfully", {
                        position: "top-center",
                        autoClose: 1000,
                    });

                    setProductsUpdate((prevState) => {
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

        setIsDialogOpen(false);
    };

    const handleDeleteMarkedProducts = (e, Ids) => {
        e.preventDefault();

        axios({
            //Delete the task in the database
            method: "get",
            url: api_url + "/Wish/deleteMarkedWishes.php",
            params: { checkedIds: Ids },
            withCredentials: false,
        })
            .then((response) => {
                if (response.data == 1) {
                    toast.success("Deleted Successfully", {
                        position: "top-center",
                        autoClose: 1000,
                    });

                    setBoxMarked(false);
                    setCheckedFields({ Ids: [] });

                    setProductsUpdate((prevState) => {
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

        setIsDialogOpen(false);
    };

    const handleCheckAll = (e) => {
        let row = e.target.parentElement.parentElement.parentElement.parentElement,
            fields = row.querySelectorAll("td"),
            td_fields = fields;
        if (e.target.checked == true) {
            td_fields.forEach((td) => {
                if (td.className == "mark_box_row") {
                    let checkbox = td.querySelector("input");
                    checkbox.checked = true;
                    setBoxMarked(true);

                    setCheckedFields((prevState) => {
                        return {
                            ...prevState,
                            Ids: [...prevState.Ids, checkbox.id],
                        };
                    });
                }
            });
        } else {
            td_fields.forEach((td) => {
                if (td.className == "mark_box_row") {
                    let checkbox = td.querySelector("input");
                    checkbox.checked = false;
                    setBoxMarked(false);
                    setCheckedFields((prevState) => {
                        return {
                            ...prevState,
                            Ids: [],
                        };
                    });
                }
            });
        }
    };

    const handleCheck = (e) => {
        let row = e.target.parentElement.parentElement.parentElement.parentElement,
            check_fields = row.querySelectorAll("input");

        if (e.target.checked) {
            setBoxMarked(true);
            setCheckedFields((prevState) => {
                return {
                    ...prevState,
                    Ids: [...prevState.Ids, e.target.id],
                };
            });
        } else {
            let countChecked = 0;
            check_fields[0].checked = false; //uncheck the parent checkbox
            check_fields.forEach((box) => {
                if (box.checked) {
                    countChecked += 1;
                }
            });

            if (countChecked == 0) {
                check_fields[0].checked = false;
                setBoxMarked(false);
                setCheckedFields({ Ids: [] });
            } else {
                setCheckedFields((prevState) => {
                    return {
                        ...prevState,
                        Ids: prevState.Ids.filter((id) => id !== e.target.id),
                    };
                });
            }
        }
    };
    useEffect(() => {
        //Axios to get products data

        axios({
            method: "get",
            params: { user_id: user },
            url: api_url + "/Wish/getWish.php",
        })
            .then((response) => {
                setProductsData(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, [ProductsUpdate]);

    console.log(ProductsData)
    var count = 1; //Will increment the No. column of the table


    return (
        <>
            <header className='header header_2'>
                <TopHeader />
            </header>


            <section className='get_started product_content wishlist_content'>
                {isLoading ? (
                    <span className="loader"></span>
                ) : (
                    <>
                        <div className="part_1">
                            <div className="title_part">
                                <h2>My WishList</h2>
                            </div>

                            <div className="date_part">
                                <h2>Date: {GetDate()}</h2>
                            </div>
                        </div>

                        <div className="part_2">
                            <form
                                className="product_form"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <div className="input_group">
                                    <input
                                        type="text"
                                        name="term"
                                        id="term"
                                        placeholder="Enter any Keyword or Digit..."
                                        required
                                        ref={SearchTerm}
                                        onKeyUp={handleSearchProduct}
                                    />
                                </div>
                            </form>
                        </div>

                        {boxMarked && (
                            <div className="delete_marked">
                                <button
                                    className="btn action_btn delete_btn"
                                    onClick={(e) => openDialogProduct("delete marked", e)}
                                >
                                    <i class="fa-solid fa-trash-can"></i>
                                </button>
                            </div>
                        )}

                        <div className="part_3">
                            <table className="Products">
                                <thead>
                                    <tr>
                                        <th className="id">#</th>
                                        <th className="mark_box">
                                            <input
                                                type="checkbox"
                                                name="mark_all"
                                                id="mark_all"
                                                onChange={(e) => handleCheckAll(e)}
                                            />
                                        </th>
                                        <th>No.</th>
                                        <th>Image</th>
                                        <th>Name</th>

                                        <th>Price</th>
                                        <th>Category</th>
                                        <th>Wish Date</th>

                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody className="table_content">
                                    {ProductsData.length != 0 ? (
                                        ProductsData.map((row) => (
                                            <tr key={row.Id}>
                                                <td className="id">{row.Id}</td>
                                                <td className="mark_box_row">
                                                    <input
                                                        type="checkbox"
                                                        name="mark"
                                                        id={row.Id}
                                                        onChange={(e) => handleCheck(e)}
                                                    />
                                                </td>
                                                <td>{count++}</td>
                                                <td className="img"><NavLink to={api_url + "/photos/products/" + row.Img} target="_blank"><img src={api_url + "/photos/products/" + row.Img} alt={row.Name} /></NavLink></td>
                                                <td>{row.Name}</td>

                                                <td>
                                                    {row.Price}
                                                </td>
                                                <td>{row.Category}</td>

                                                <td>
                                                    {row.WishDate}
                                                </td>
                                                <td className="actions">
                                                    <button
                                                        className="btn action_btn"
                                                        onClick={() => window.open(`/productView/${row.ProductId}`, "_blank")}
                                                    >
                                                        <i class="fa-solid fa-eye"></i>
                                                    </button>
                                                    <button
                                                        className="btn action_btn delete_btn"
                                                        onClick={(e) => openDialogProduct("delete", e)}
                                                    >
                                                        <i class="fa-solid fa-trash-can"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (


                                        (
                                            <tr>
                                                <td className="not_found" colSpan={9}>
                                                    No Wishes Found!
                                                </td>
                                            </tr>

                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div class="summary_part">
                            <div class="summary_1">
                                <p>Total Wishes: {ProductsData.length}</p>
                            </div>


                        </div>


                    </>
                )}
            </section>

            <Footer />

            {isDialogOpen && (
                <div className="dialog_container">
                    <div className="dialog_box Product_dialog">
                        <div className="close_part">
                            <button
                                className="btn close_btn btn4 normal"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                X
                            </button>
                        </div>

                        <div className="title_part">
                            <h2>{dialogFields.dialogTitle} Wish</h2>
                        </div>

                        <div className="form_part Product_form">
                            {error !== "" ? <span className="error_msg">{error}</span> : null}

                            {dialogType === "edit" ? (
                                null
                            ) : dialogType === "add" ? (
                                null
                            ) : dialogType === "delete marked" ? (
                                <form
                                    className="dialog_form"
                                    onSubmit={(e) =>
                                        handleDeleteMarkedProducts(e, dialogFields.Id)
                                    }
                                >
                                    <div className="input_group">
                                        <h3>
                                            Are you sure you want to delete the-{" "}
                                            <span style={{ color: "red" }}>marked Wish</span>
                                        </h3>
                                    </div>

                                    <div className="input_group">
                                        <button className="btn btn4 normal" type="submit">
                                            Confirm
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                <form
                                    className="dialog_form"
                                    onSubmit={(e) => handleDeleteProduct(e, dialogFields.Id)}
                                >
                                    <div className="input_group">
                                        <h3>
                                            Are you sure you want to delete this Wish -{" "}
                                            <span style={{ color: "red" }}>{dialogFields.Name}</span>
                                        </h3>
                                    </div>

                                    <div className="input_group">
                                        <button className="btn btn4 normal" type="submit">
                                            Confirm
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}




        </>
    );
};

export default Wishlist;

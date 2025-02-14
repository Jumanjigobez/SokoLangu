import { React, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { NavLink } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import axios from "axios";
import { api_url } from "../../routes";

const ProductsManagement = () => {
    const [ProductsData, setProductsData] = useState([]),
        [isDialogOpen, setIsDialogOpen] = useState(false),
        [dialogType, setDialogType] = useState(""),
        [dialogFields, setDialogFields] = useState({}),
        [boxMarked, setBoxMarked] = useState(false),
        [checkedFields, setCheckedFields] = useState({
            Ids: [],
        }),
        [ProductsUpdate, setProductsUpdate] = useState({
            updated: 0,
        }),
        [isLoading, setIsLoading] = useState(true); //For loading screen when page is changed

    const SearchTerm = useRef();

    const Img_input = useRef(),
        Name_input = useRef(),
        Description_input = useRef(),
        Price_input = useRef(),
        Category_input = useRef(),
        Date_input = useRef(); //These ones will hold the input values referenced to

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

        handleSearchProducts();
    };

    const handleSearchProducts = () => {
        if (SearchTerm.current.value.length >= 1) {
            let formData = new FormData();

            formData.append("search_term", SearchTerm.current.value);

            axios({
                method: "post",
                url: api_url + "/admin/productSearch.php",
                data: formData,
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
                url: api_url + "/admin/products.php",
            })
                .then((response) => {
                    setProductsData(response.data);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };



    const openDialogProducts = (type, e) => {
        let row = e.target.parentElement.parentElement, //access the whole row of that element
            fields = row.querySelectorAll("td");

        if (type === "edit") {
            setDialogFields({
                dialogTitle: "Edit",
                Id: fields[0].innerText,
                Img: fields[3].innerText,
                Name: fields[5].innerText,
                Description: fields[6].innerText,
                Price: fields[7].innerText,
                Category: fields[8].innerText,
                Date: fields[9].innerText,

            });

            setDialogType("edit");
            setIsDialogOpen(true);
        } else if (type === "delete") {
            setDialogFields({
                dialogTitle: "Delete",
                ProductId: fields[2].innerText,
                Productname: fields[4].innerText,
            });

            setDialogType("delete");
            setIsDialogOpen(true);
        } else if (type === "delete marked") {
            setDialogFields({
                dialogTitle: "Delete Marked",

                ProductId: checkedFields.Ids,
            });

            setDialogType("delete marked");
            setIsDialogOpen(true);
        }
    };




    const handleUpdateProducts = (e, row_id) => {
        e.preventDefault();
        let formData = new FormData();

        formData.append("img", Img_input.current.files[0]);
        formData.append("Name", Name_input.current.value);
        formData.append("Description", Description_input.current.value.replace(/[\r\n]/g, ' '));
        formData.append("Price", Price_input.current.value);
        formData.append("Category", Category_input.current.value);
        formData.append("Date", Date_input.current.value);
        formData.append("product_id", row_id);



        axios({
            //Update the database
            method: "post",
            url: api_url + "/admin/editProduct.php",
            data: formData,
            config: {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        })
            .then((response) => {
                if (response.data == 1) {
                    toast.success("Updated successfully", {
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

    const handleDeleteProducts = (e, row_id) => {
        e.preventDefault();

        axios({
            //Delete the row in the database
            method: "get",
            url: api_url + "/admin/deleteProduct.php",
            params: { Product_id: row_id },
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

            method: "get",
            url: api_url + "/admin/deleteMarkedProducts.php",
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
        //Axios to get data from server

        axios({
            method: "get",

            url: api_url + "/admin/products.php",
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

    var count = 1; //Will increment the No. column of the table

    console.log(ProductsData);

    return (
        <section id="active">
            <Sidebar />

            <div className="container dashContainer">
                <Header />

                <div className="content_part product_content Order_content">
                    {isLoading ? (
                        <span className="loader"></span>
                    ) : (
                        <>
                            <div className="part_1">
                                <div className="title_part">
                                    <h2>Products Management</h2>
                                </div>

                                <div className="date_part">
                                    <h2>Date: {GetDate()}</h2>
                                </div>
                            </div>

                            <div className="part_2" style={{ width: "50%" }}>
                                <form
                                    className="project_form"
                                    onSubmit={(e) => handleProductSubmit(e)}
                                >
                                    <div className="input_group">
                                        <input
                                            type="text"
                                            name="term"
                                            id="term"
                                            placeholder="Enter any Keyword or Digit..."
                                            required
                                            ref={SearchTerm}
                                            onKeyUp={handleSearchProducts}
                                        />
                                    </div>
                                </form>
                            </div>

                            {boxMarked && (
                                <div className="delete_marked">
                                    <button
                                        className="btn action_btn delete_btn"
                                        onClick={(e) => openDialogProducts("delete marked", e)}
                                    >
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            )}

                            <div className="part_3">
                                <table className="appoints">
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
                                            <th>Product ID</th>
                                            <th>Image</th>
                                            <th>Name</th>
                                            <th>Description</th>
                                            <th>Price</th>
                                            <th>Category</th>
                                            <th>Upload Date</th>

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
                                                    <td>{row.Id}</td>
                                                    <td className="img"><NavLink to={api_url + "/photos/products/" + row.Img} target="_blank"><img src={api_url + "/photos/products/" + row.Img} alt={row.Name} /></NavLink></td>
                                                    <td>{row.Name}</td>
                                                    <td>{row.Description}</td>
                                                    <td>
                                                        {row.Price}
                                                    </td>
                                                    <td>{row.Category}</td>

                                                    <td>
                                                        {row.UploadDate}
                                                    </td>
                                                    <td className="actions">
                                                        <button
                                                            className="btn action_btn"
                                                            onClick={(e) => openDialogProducts("edit", e)}
                                                        >
                                                            <i class="fa-solid fa-pen"></i>
                                                        </button>
                                                        <button
                                                            className="btn action_btn delete_btn"
                                                            onClick={(e) => openDialogProducts("delete", e)}
                                                        >
                                                            <i class="fa-solid fa-trash-can"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="not_found" colSpan={11}>
                                                    Ooops! No Product Found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div class="summary_part">
                                <div class="summary_1">
                                    <p>Total Products: {ProductsData.length}</p>
                                </div>


                            </div>


                        </>
                    )}
                </div>


            </div>

            {isDialogOpen && (
                <div className="dialog_container">
                    <div className="dialog_box">
                        <div className="close_part">
                            <button
                                className="btn btn4 normal close_btn"
                                onClick={() => setIsDialogOpen(false)}
                            >
                                X
                            </button>
                        </div>

                        <div className="title_part">
                            <h2>{dialogFields.dialogTitle} Product</h2>
                        </div>

                        <div className="form_part contacts_form">
                            {dialogType === "edit" ? (
                                <form
                                    className="dialog_form"
                                    onSubmit={(e) => handleUpdateProducts(e, dialogFields.Id)}
                                >

                                    <div className="input_group">
                                        <label htmlFor="img">Image</label>
                                        <input
                                            type="file"
                                            name="img"
                                            id="img"
                                            placeholder="Choose product photo"


                                            ref={Img_input}
                                        />
                                    </div>

                                    <div className="part_1">
                                        <div className="child">
                                            <div className="input_group">
                                                <label htmlFor="name">Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    placeholder="Enter name"
                                                    defaultValue={dialogFields.Name}
                                                    required
                                                    ref={Name_input}
                                                />
                                            </div>

                                            <div
                                                className="input_group"
                                                style={{ marginTop: "1rem" }}
                                            >
                                                <label htmlFor="category">Category</label>
                                                <div className="custom_select">
                                                    <select
                                                        name="category"
                                                        id="category"
                                                        defaultValue={dialogFields.Category}
                                                        required
                                                        ref={Category_input}
                                                    >
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
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="description">Description</label>
                                            <textarea
                                                name="Description"
                                                id="description"
                                                cols="30"
                                                rows="10"
                                                placeholder="Brief description..."
                                                defaultValue={dialogFields.Description}
                                                required
                                                ref={Description_input}
                                            ></textarea>
                                        </div>
                                    </div>

                                    <div className="part_2">
                                        <div className="input_group">
                                            <label htmlFor="price">Price</label>
                                            <input
                                                type="number"
                                                name="price"
                                                id="price"
                                                placeholder="Enter price"
                                                defaultValue={dialogFields.Price}
                                                required
                                                ref={Price_input}
                                            />
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="date">Date Uploaded</label>
                                            <input
                                                type="date"
                                                name="Date"
                                                id="date"
                                                placeholder="Choose date"
                                                defaultValue={dialogFields.Date}
                                                ref={Date_input}
                                            />
                                        </div>
                                    </div>



                                    <div className="part_3">
                                        <div className="input_group">
                                            <button type="submit" className="btn btn4 normal">
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : dialogType === "delete marked" ? (
                                <form
                                    className="dialog_form"
                                    onSubmit={(e) =>
                                        handleDeleteMarkedProducts(e, dialogFields.ProductId)
                                    }
                                >
                                    <div className="input_group">
                                        <h3>
                                            Are you sure you want to delete the-{" "}
                                            <span style={{ color: "red" }}>marked Products</span>
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
                                    onSubmit={(e) => handleDeleteProducts(e, dialogFields.ProductId)}
                                >
                                    <div className="input_group">
                                        <h3>
                                            Are you sure you want to delete this Product -
                                            <span style={{ color: "red" }}>
                                                {dialogFields.Productname}
                                            </span>
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

        </section>
    );
};

export default ProductsManagement;

import React, { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import axios from "axios";
import { api_url } from "../../routes";


const Orders = () => {
    const user = JSON.parse(localStorage.getItem("sessions")).user_id;

    const [OrdersData, setOrdersData] = useState([]),
        [isDialogOpen, setIsDialogOpen] = useState(false),
        [dialogType, setDialogType] = useState(""),
        [dialogFields, setDialogFields] = useState({}),
        [boxMarked, setBoxMarked] = useState(false),
        [checkedFields, setCheckedFields] = useState({
            Ids: [],
        }),
        [error, setError] = useState("");

    const [OrdersUpdate, setOrdersUpdate] = useState({
        updated: 0,
    }),
        [isLoading, setIsLoading] = useState(true); //For loading screen when page is changed

    const Username_input = useRef(),
        ProductName_input = useRef(),
        Quantity_input = useRef(),
        TotalPrice_input = useRef(),
        OrderStatus_input = useRef(),
        OrderDate_input = useRef(); //These ones will hold the input values referenced to

    const SearchTerm = useRef();

    const GetDate = () => {
        let today = new Date(),
            day = today.getDate(),
            month = today.getMonth() + 1,
            year = today.getFullYear();

        let date = day + "/" + month + "/" + year;

        return date;
    };

    const handleOrderSubmit = (e) => {
        e.preventDefault();
        handleSearchOrder();
    };

    const handleSearchOrder = () => {
        if (SearchTerm.current.value.length >= 1) {
            let formData = new FormData();

            formData.append("search_term", SearchTerm.current.value);

            axios({
                method: "post",
                url: api_url + "/Orders/orderSearch.php",
                data: formData,
                params: { user_id: user },
                config: {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            })
                .then((response) => {
                    setOrdersData(response.data);
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            axios({
                method: "get",
                params: { user_id: user },
                url: api_url + "/Orders/getOrders.php",
            })
                .then((response) => {
                    setOrdersData(response.data);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };
    const openDialogOrder = (type, e) => {
        let row = e.target.parentElement.parentElement,
            fields = row.querySelectorAll("td");

        if (type === "edit") {
            setDialogFields({
                dialogTitle: "Edit",
                Id: fields[0].innerText,
                Username: fields[3].innerText,
                ProductName: fields[4].innerText,
                Quantity: fields[5].innerText,
                TotalPrice: fields[6].innerText,
                OrderStatus: fields[7].innerText,
                OrderDate: fields[8].innerText,

            });

            setDialogType("edit");
            setIsDialogOpen(true);
            setError("");
        } else if (type === "delete") {
            setDialogFields({
                dialogTitle: "Delete",
                ProductName: fields[4].innerText,
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


    const handleUpdateOrder = (e, row_id) => {
        e.preventDefault();

        let formData = new FormData();

        formData.append("OrderId", row_id);


        formData.append("Quantity", Quantity_input.current.value);
        formData.append("TotalPrice", TotalPrice_input.current.value);
        formData.append("OrderStatus", OrderStatus_input.current.value);



        axios({
            //Update the new task and status in the database
            method: "post",
            url: api_url + "/Orders/updateOrders.php",
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

                    setOrdersUpdate((prevState) => {
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

    const handleDeleteOrder = (e, row_id) => {
        e.preventDefault();

        axios({
            //Delete the row in the database
            method: "get",
            url: api_url + "/Orders/deleteOrders.php",
            params: { id: row_id },
            withCredentials: false,
        })
            .then((response) => {
                if (response.data == 1) {
                    toast.success("Deleted Successfully", {
                        position: "top-center",
                        autoClose: 1000,
                    });

                    setOrdersUpdate((prevState) => {
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

    const handleDeleteMarkedOrders = (e, Ids) => {
        e.preventDefault();

        axios({
            //Delete the task in the database
            method: "get",
            url: api_url + "/Orders/deleteMarkedOrders.php",
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

                    setOrdersUpdate((prevState) => {
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
        //Axios to get todo data

        axios({
            method: "get",
            params: { user_id: user },
            url: api_url + "/Orders/getOrders.php",
        })
            .then((response) => {
                setOrdersData(response.data);
            })
            .catch((e) => {
                console.log(e);
            });


        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, [OrdersUpdate]);

    var count = 1, //Will increment the No. column of the table
        Total_Pending = 0;//Will be shown on the table footer as a summary



    if (Array.isArray(OrdersData)) {


        OrdersData.map((e) =>
            e.OrderStatus === "Pending"
                ? (Total_Pending += 1)
                : null
        );

    }

    // console.log(OrdersData)
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
                                    <h2>Orders</h2>
                                </div>

                                <div className="date_part">
                                    <h2>Date: {GetDate()}</h2>
                                </div>
                            </div>

                            <div className="part_2">
                                <form
                                    className="product_form order_form"
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
                                            onKeyUp={handleSearchOrder}
                                        />
                                    </div>
                                </form>
                            </div>

                            {boxMarked && (
                                <div className="delete_marked">
                                    <button
                                        className="btn action_btn delete_btn"
                                        onClick={(e) => openDialogOrder("delete marked", e)}
                                    >
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            )}

                            <div className="part_3">
                                <table className="Orders">
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
                                            <th>Username</th>
                                            <th>Product Name</th>
                                            <th>Quantity</th>
                                            <th>Total Price</th>
                                            <th>Order Status</th>
                                            <th>Order Date</th>

                                            <th>Action</th>
                                        </tr>
                                    </thead>

                                    <tbody className="table_content">
                                        {OrdersData.length != 0 ? (
                                            OrdersData.map((row) => (
                                                <tr key={row.id}>
                                                    <td className="id">{row.id}</td>
                                                    <td className="mark_box_row">
                                                        <input
                                                            type="checkbox"
                                                            name="mark"
                                                            id={row.id}
                                                            onChange={(e) => handleCheck(e)}
                                                        />
                                                    </td>
                                                    <td>{count++}</td>
                                                    <td>{row.Username}</td>
                                                    <td>{row.ProductName}</td>
                                                    <td>{row.Quantity}</td>
                                                    <td>{Number(
                                                        row.TotalPrice.replace(/,/g, "")
                                                    ).toLocaleString()}
                                                    </td>
                                                    <td
                                                        className={
                                                            row.OrderStatus === "Completed"
                                                                ? "Completed"
                                                                : "Pending"
                                                        }
                                                    >
                                                        <span>{row.OrderStatus}</span>
                                                    </td>
                                                    <td>
                                                        {row.OrderDate}
                                                    </td>
                                                    <td className="actions">
                                                        <button
                                                            className="btn action_btn"
                                                            onClick={(e) => openDialogOrder("edit", e)}
                                                        >
                                                            <i class="fa-solid fa-pen"></i>
                                                        </button>
                                                        <button
                                                            className="btn action_btn delete_btn"
                                                            onClick={(e) => openDialogOrder("delete", e)}
                                                        >
                                                            <i class="fa-solid fa-trash-can"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            (
                                                <tr>
                                                    <td className="not_found" colSpan={10}>
                                                        No Orders Placed!
                                                    </td>
                                                </tr>

                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div class="summary_part">
                                <div class="summary_1">
                                    <p>Total Orders: {OrdersData.length}</p>
                                </div>

                                <div class="summary_1">
                                    <p>Total Pending: {Total_Pending}</p>
                                </div>
                            </div>


                        </>
                    )}
                </div>


            </div>

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
                            <h2>{dialogFields.dialogTitle} Order</h2>
                        </div>

                        <div className="form_part Order_form">
                            {error !== "" ? <span className="error_msg">{error}</span> : null}

                            {dialogType === "edit" ? (
                                <form
                                    className="dialog_form"
                                    onSubmit={(e) => handleUpdateOrder(e, dialogFields.Id)}
                                >

                                    <div className="grouping">

                                        <div className="input_group">
                                            <label htmlFor="username">Username</label>
                                            <input
                                                type="text"
                                                name="username"
                                                id="username"
                                                placeholder="Enter username"
                                                defaultValue={dialogFields.Username}
                                                required
                                                disabled
                                                ref={Username_input}
                                            />
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="productname">Product Name</label>
                                            <input
                                                type="text"
                                                name="productName"
                                                id="productname"
                                                placeholder="Enter Product Name"
                                                defaultValue={dialogFields.ProductName}
                                                required
                                                disabled
                                                ref={ProductName_input}
                                            />
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="quantity">Quantity</label>
                                            <input
                                                type="number"
                                                name="quantity"
                                                id="quantity"
                                                placeholder="Enter Quantity"
                                                defaultValue={dialogFields.Quantity}
                                                required

                                                ref={Quantity_input}
                                            />
                                        </div>
                                    </div>

                                    <div className="grouping">
                                        <div className="input_group">
                                            <label htmlFor="totalprice">Total Price</label>
                                            <input
                                                type="number"
                                                name="totalprice"
                                                id="totalprice"
                                                placeholder="Enter Total Price"
                                                defaultValue={dialogFields.TotalPrice}
                                                required

                                                ref={TotalPrice_input}
                                            />
                                        </div>

                                        <div
                                            className="input_group"

                                        >
                                            <label htmlFor="orderstatus">Order Status</label>
                                            <div className="custom_select">
                                                <select
                                                    name="orderStatus"
                                                    id="orderstatus"
                                                    defaultValue={dialogFields.OrderStatus}
                                                    required
                                                    ref={OrderStatus_input}
                                                >
                                                    <option value="Completed">Completed</option>
                                                    <option value="Pending">Pending</option>

                                                </select>
                                            </div>
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="orderdate">Order Date</label>
                                            <input
                                                type="text"
                                                name="orderDate"
                                                id="orderdate"
                                                placeholder="Choose order date"
                                                defaultValue={dialogFields.OrderDate}
                                                disabled
                                                ref={OrderDate_input}
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
                                        handleDeleteMarkedOrders(e, dialogFields.Id)
                                    }
                                >
                                    <div className="input_group">
                                        <h3>
                                            Are you sure you want to delete the-{" "}
                                            <span style={{ color: "red" }}>marked Order</span>
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
                                    onSubmit={(e) => handleDeleteOrder(e, dialogFields.Id)}
                                >
                                    <div className="input_group">
                                        <h3>
                                            Are you sure you want to delete this Order -{" "}
                                            <span style={{ color: "red" }}>{dialogFields.ProductName}</span>
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

export default Orders;

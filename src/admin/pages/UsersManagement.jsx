import { React, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { NavLink } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import axios from "axios";
import { api_url } from "../../routes";

const UsersManagement = () => {
    const [usersData, setUsersData] = useState([]),
        [isDialogOpen, setIsDialogOpen] = useState(false),
        [dialogType, setDialogType] = useState(""),
        [dialogFields, setDialogFields] = useState({}),
        [boxMarked, setBoxMarked] = useState(false),
        [checkedFields, setCheckedFields] = useState({
            Ids: [],
        }),
        [usersUpdate, setUsersUpdate] = useState({
            updated: 0,
        }),
        [isLoading, setIsLoading] = useState(true); //For loading screen when page is changed

    const SearchTerm = useRef();

    const UserId_input = useRef(),
        Photo_input = useRef(),
        Username_input = useRef(),
        FirstName_input = useRef(),
        LastName_input = useRef(),
        Phone_input = useRef(),
        Email_input = useRef(),
        Region_input = useRef(),
        Psk_input = useRef(),
        Status_input = useRef(),
        Role_input = useRef(),
        TermsAgreed_input = useRef();

    const GetDate = () => {
        let today = new Date(),
            day = today.getDate(),
            month = today.getMonth() + 1,
            year = today.getFullYear();

        let date = day + "/" + month + "/" + year;

        return date;
    };

    const handleUserSubmit = (e) => {
        e.preventDefault();

        handleSearchUsers();
    };

    const handleSearchUsers = () => {
        if (SearchTerm.current.value.length >= 1) {
            let formData = new FormData();

            formData.append("search_term", SearchTerm.current.value);

            axios({
                method: "post",
                url: api_url + "/admin/userSearch.php",
                data: formData,
                config: {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            })
                .then((response) => {
                    setUsersData(response.data);
                })
                .catch((e) => {
                    console.log(e);
                });
        } else {
            axios({
                method: "get",
                url: api_url + "/admin/users.php",
            })
                .then((response) => {
                    setUsersData(response.data);
                })
                .catch((e) => {
                    console.log(e);
                });
        }
    };

    const openDialogAdd = () => {
        setDialogFields({
            dialogTitle: "Add",
        });

        setDialogType("add");
        setIsDialogOpen(true);
    };

    const openDialogUsers = (type, e) => {
        let row = e.target.parentElement.parentElement, //access the whole row of that element
            fields = row.querySelectorAll("td");

        if (type === "edit") {
            setDialogFields({
                dialogTitle: "Edit",
                UserId: fields[2].innerText,
                Photo: fields[3].innerText,
                Username: fields[4].innerText,
                FirstName: fields[5].innerText,
                LastName: fields[6].innerText,
                Phone: fields[7].innerText,
                Email: fields[8].innerText,
                Region: fields[9].innerText,
                Role: fields[10].innerText,
                Status: fields[12].innerText,
                Psk: fields[13].innerText,


                TermsAgreed: fields[14].innerText,
            });

            setDialogType("edit");
            setIsDialogOpen(true);
        } else if (type === "delete") {
            setDialogFields({
                dialogTitle: "Delete",
                UserId: fields[2].innerText,
                Username: fields[4].innerText,
            });

            setDialogType("delete");
            setIsDialogOpen(true);
        } else if (type === "delete marked") {
            setDialogFields({
                dialogTitle: "Delete Marked",

                UserId: checkedFields.Ids,
            });

            setDialogType("delete marked");
            setIsDialogOpen(true);
        }
    };

    const handleAddUsers = (e) => {
        e.preventDefault();
        let formData = new FormData();

        formData.append("username", Username_input.current.value);
        formData.append("email", Email_input.current.value);
        formData.append("password", Psk_input.current.value);
        formData.append("first_name", FirstName_input.current.value);
        formData.append("last_name", LastName_input.current.value);
        formData.append("phone_no", Phone_input.current.value);
        formData.append("region", Region_input.current.value);
        formData.append("role", Role_input.current.value);
        formData.append("terms_check", TermsAgreed_input.current.value);
        formData.append("photo", Photo_input.current.files[0]);

        axios({
            method: "post",
            url: api_url + "/admin/addUser.php",
            data: formData,
            config: {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        })
            .then((response) => {
                if (response.data == 1) {
                    toast.success("Added successfully", {
                        position: "top-center",
                        autoClose: 1000,
                    });

                    setUsersUpdate((prevState) => {
                        return {
                            ...prevState,
                            updated: prevState.updated + 1,
                        };
                    });
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


    const handleUpdateUsers = (e, row_id) => {
        e.preventDefault();
        let formData = new FormData();

        formData.append("UserId", row_id);
        formData.append("Photo", Photo_input.current.files[0]);
        formData.append("Username", Username_input.current.value);
        formData.append("FirstName", FirstName_input.current.value);
        formData.append("Lastname", LastName_input.current.value);
        formData.append("Phone", Phone_input.current.value);
        formData.append("Email", Email_input.current.value);
        formData.append("Region", Region_input.current.value);
        formData.append("Role", Role_input.current.value);
        formData.append("Psk", Psk_input.current.value);
        formData.append("Status", Status_input.current.value);

        formData.append("TermsAgreed", TermsAgreed_input.current.value);

        axios({
            //Update the database
            method: "post",
            url: api_url + "/admin/editUser.php",
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

                    setUsersUpdate((prevState) => {
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

    const handleDeleteUsers = (e, row_id) => {
        e.preventDefault();

        axios({
            //Delete the row in the database
            method: "get",
            url: api_url + "/admin/deleteUser.php",
            params: { user_id: row_id },
            withCredentials: false,
        })
            .then((response) => {
                if (response.data == 1) {
                    toast.success("Deleted Successfully", {
                        position: "top-center",
                        autoClose: 1000,
                    });

                    setUsersUpdate((prevState) => {
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

    const handleDeleteMarkedUsers = (e, Ids) => {
        e.preventDefault();

        axios({

            method: "get",
            url: api_url + "/admin/deleteMarkedUsers.php",
            params: { checkedIds: Ids },
            withCredentials: false,
        })
            .then((response) => {
                if (response.data == 1) {
                    toast.success("Deleted Successfully", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });

                    setBoxMarked(false);
                    setCheckedFields({ Ids: [] });

                    setUsersUpdate((prevState) => {
                        return {
                            ...prevState,
                            updated: prevState.updated + 1,
                        };
                    });
                } else {
                    toast.error("Oops, Something's wrong :(", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
                }
            })
            .catch((e) => {
                alert("Network Error", e);
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

            url: api_url + "/admin/users.php",
        })
            .then((response) => {
                setUsersData(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
        setTimeout(() => {
            setIsLoading(false);
        }, 3000);
    }, [usersUpdate]);

    var count = 1; //Will increment the No. column of the table

    const onlineUsers = usersData.filter((user) => user.status === "online");
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
                                    <h2>Users Management</h2>
                                </div>

                                <div className="date_part">
                                    <h2>Date: {GetDate()}</h2>
                                </div>
                            </div>

                            <div className="part_2" style={{ width: "50%" }}>
                                <form
                                    className="project_form"
                                    onSubmit={(e) => handleUserSubmit(e)}
                                >
                                    <div className="input_group">
                                        <input
                                            type="text"
                                            name="term"
                                            id="term"
                                            placeholder="Enter any Keyword or Digit..."
                                            required
                                            ref={SearchTerm}
                                            onKeyUp={handleSearchUsers}
                                        />
                                    </div>
                                </form>
                            </div>

                            {boxMarked && (
                                <div className="delete_marked">
                                    <button
                                        className="btn action_btn delete_btn"
                                        onClick={(e) => openDialogUsers("delete marked", e)}
                                    >
                                        <i class="fa-solid fa-trash-can"></i>
                                    </button>
                                </div>
                            )}

                            <div className="part_3">
                                <table className="appoints">
                                    <thead>
                                        <tr>
                                            <th className="mark_box">
                                                <input
                                                    type="checkbox"
                                                    name="mark_all"
                                                    id="mark_all"
                                                    onChange={(e) => handleCheckAll(e)}
                                                />
                                            </th>
                                            <th>No.</th>
                                            <th>User Id</th>
                                            <th>Photo</th>
                                            <th>Username</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>Phone</th>
                                            <th>Email</th>
                                            <th>Region</th>
                                            <th>Password</th>
                                            <th>Status</th>

                                            <th>Role</th>
                                            <th>Terms Agreed</th>
                                            <th>Joined</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>

                                    <tbody className="table_content">
                                        {usersData.length != 0 ? (
                                            usersData.map((row) => (
                                                <tr key={row.user_id}>
                                                    <td className="mark_box_row">
                                                        <input
                                                            type="checkbox"
                                                            name="mark"
                                                            id={row.user_id}
                                                            onChange={(e) => handleCheck(e)}
                                                        />
                                                    </td>
                                                    <td>{count++}</td>

                                                    <td>{row.user_id}</td>
                                                    <td className="img"><NavLink to={api_url + "/photos/profiles/" + row.photo} target="_blank"><img src={api_url + "/photos/profiles/" + row.photo} alt={row.username} /></NavLink></td>
                                                    <td>{row.username}</td>
                                                    <td>{row.firstName}</td>
                                                    <td>{row.lastName}</td>
                                                    <td>{row.phone}</td>

                                                    <td>{row.email}</td>
                                                    <td>{row.region}</td>
                                                    <td>****</td>
                                                    <td>{row.status}</td>
                                                    <td>{row.role}</td>
                                                    <td>{row.terms_agreed}</td>
                                                    <td>{row.joined}</td>
                                                    <td className="actions">
                                                        <button
                                                            className="btn action_btn"
                                                            onClick={(e) => openDialogUsers("edit", e)}
                                                        >
                                                            <i class="fa-solid fa-pen"></i>
                                                        </button>
                                                        <button
                                                            className="btn action_btn delete_btn"
                                                            onClick={(e) => openDialogUsers("delete", e)}
                                                        >
                                                            <i class="fa-solid fa-trash-can"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="not_found" colSpan={16}>
                                                    Ooops! No User Found. Please Add Row
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            <div className="summary_part">
                                <div className="summary_1">
                                    <p>Total Users: {usersData.length}</p>
                                </div>

                                <div className="summary_2">
                                    <p>Total Online: {onlineUsers.length}</p>
                                </div>
                            </div>
                            <div className="summary_part">
                                <div className="summary_1">
                                    <p>Total Farmers: {usersData.filter((user) => user.role === "farmer").length}</p>
                                </div>

                                <div className="summary_2">
                                    <p>Total Consumers: {usersData.filter((user) => user.role === "consumer").length}</p>
                                </div>
                            </div>

                            <div className="button_part">
                                <button className="btn btn4 normal" onClick={openDialogAdd}>
                                    Add Row
                                </button>
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
                            <h2>{dialogFields.dialogTitle} User</h2>
                        </div>

                        <div className="form_part contacts_form">
                            {dialogType === "edit" ? (
                                <form
                                    className="dialog_form"
                                    onSubmit={(e) => handleUpdateUsers(e, dialogFields.UserId)}
                                >
                                    <div className="part_1">
                                        <div className="input_group">
                                            <label htmlFor="img">Photo</label>
                                            <input
                                                type="file"
                                                name="img"
                                                id="img"
                                                placeholder="Choose profile photo"


                                                ref={Photo_input}
                                            />
                                        </div>
                                    </div>

                                    <div className="part_2">
                                        <div className="input_group">
                                            <label htmlFor="UserId">UserId</label>
                                            <input
                                                type="text"
                                                name="UserId"
                                                id="UserId"
                                                placeholder="UserId"
                                                defaultValue={dialogFields.UserId}
                                                ref={UserId_input}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="part_3">
                                        <div className="input_group">
                                            <label htmlFor="Username">Username</label>
                                            <input
                                                type="text"
                                                name="Username"
                                                id="Username"
                                                placeholder="Enter username"
                                                defaultValue={dialogFields.Username}
                                                ref={Username_input}
                                                required
                                            />
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="FirstName">First Name</label>
                                            <input
                                                type="text"
                                                name="FirstName"
                                                id="FirstName"
                                                placeholder="Enter first name"
                                                defaultValue={dialogFields.FirstName}
                                                ref={FirstName_input}
                                                required
                                            />
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="LastName">Last Name</label>
                                            <input
                                                type="text"
                                                name="LastName"
                                                id="LastName"
                                                placeholder="Enter last name"
                                                defaultValue={dialogFields.LastName}
                                                ref={LastName_input}
                                                required
                                            />
                                        </div>


                                    </div>

                                    <div className="part_4">
                                        <div className="input_group">
                                            <label htmlFor="Phone">Phone No.</label>
                                            <input
                                                type="number"
                                                min={0}
                                                maxLength={11}
                                                name="Phone"
                                                id="Phone"
                                                placeholder="Enter phone number"
                                                defaultValue={dialogFields.Phone}
                                                ref={Phone_input}
                                                required
                                            />
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="Email">Email</label>
                                            <input
                                                type="email"

                                                name="Email"
                                                id="Email"
                                                placeholder="Enter email address"
                                                defaultValue={dialogFields.Email}
                                                ref={Email_input}
                                                required
                                            />
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="region">Region</label>
                                            <div className="custom_select region">
                                                <select name="region" id="region" required ref={Region_input} defaultValue={dialogFields.Region}>
                                                    <option value="">-- Select Region --</option>
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
                                        </div>


                                    </div>

                                    <div className="part_5">

                                        <div className="input_group">
                                            <label htmlFor="Role">Role</label>
                                            <div className="custom_select">
                                                <select
                                                    name="Role"
                                                    id="Role"
                                                    defaultValue={dialogFields.Role}
                                                    required
                                                    ref={Role_input}
                                                >
                                                    <option value="admin">Admin</option>
                                                    <option value="farmer">Farmer</option>
                                                    <option value="consumer">Consumer</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="Status">Status</label>
                                            <div className="custom_select">
                                                <select
                                                    name="Status"
                                                    id="Status"
                                                    defaultValue={dialogFields.Status}
                                                    required
                                                    ref={Status_input}
                                                >
                                                    <option value="online">online</option>
                                                    <option value="offline">offline</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="TermsAgreed">Terms Agreed</label>
                                            <div className="custom_select">
                                                <select
                                                    name="TermsAgreed"
                                                    id="TermsAgreed"
                                                    defaultValue={dialogFields.TermsAgreed}
                                                    required
                                                    ref={TermsAgreed_input}
                                                >
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="part_6">
                                        <div className="input_group">
                                            <label htmlFor="Psk">Password</label>
                                            <input
                                                type="password"
                                                name="Psk"
                                                id="Psk"
                                                placeholder="Enter Password"
                                                defaultValue={dialogFields.Psk}
                                                ref={Psk_input}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="part_7">
                                        <div className="input_group">
                                            <button type="submit" className="btn btn4 normal">
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            ) : dialogType === "add" ? (
                                <form
                                    className="dialog_form"
                                    onSubmit={(e) => handleAddUsers(e)}
                                >
                                    <div className="part_1">
                                        <div className="input_group">
                                            <label htmlFor="img">Photo</label>
                                            <input
                                                type="file"
                                                name="img"
                                                id="img"
                                                placeholder="Choose profile photo"

                                                required
                                                ref={Photo_input}
                                            />
                                        </div>
                                    </div>

                                    <div className="part_2">
                                        <div className="input_group">
                                            <label htmlFor="UserId">UserId</label>
                                            <input
                                                type="text"
                                                name="UserId"
                                                id="UserId"
                                                placeholder="UserId"

                                                ref={UserId_input}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="part_3">
                                        <div className="input_group">
                                            <label htmlFor="Username">Username</label>
                                            <input
                                                type="text"
                                                name="Username"
                                                id="Username"
                                                placeholder="Enter username"

                                                ref={Username_input}
                                                required
                                            />
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="FirstName">First Name</label>
                                            <input
                                                type="text"
                                                name="FirstName"
                                                id="FirstName"
                                                placeholder="Enter first name"

                                                ref={FirstName_input}
                                                required
                                            />
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="LastName">Last Name</label>
                                            <input
                                                type="text"
                                                name="LastName"
                                                id="LastName"
                                                placeholder="Enter last name"

                                                ref={LastName_input}
                                                required
                                            />
                                        </div>


                                    </div>

                                    <div className="part_4">
                                        <div className="input_group">
                                            <label htmlFor="Phone">Phone No.</label>
                                            <input
                                                type="number"
                                                min={0}
                                                maxLength={11}
                                                name="Phone"
                                                id="Phone"
                                                placeholder="Enter phone number"

                                                ref={Phone_input}
                                                required
                                            />
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="Email">Email</label>
                                            <input
                                                type="email"

                                                name="Email"
                                                id="Email"
                                                placeholder="Enter email address"

                                                ref={Email_input}
                                                required
                                            />
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="region">Region</label>
                                            <div className="custom_select region">
                                                <select name="region" id="region" required ref={Region_input} >
                                                    <option value="">-- Select Region --</option>
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
                                        </div>


                                    </div>

                                    <div className="part_5">

                                        <div className="input_group">
                                            <label htmlFor="Role">Role</label>
                                            <div className="custom_select">
                                                <select
                                                    name="Role"
                                                    id="Role"

                                                    required
                                                    ref={Role_input}
                                                >
                                                    <option value="admin">Admin</option>
                                                    <option value="farmer">Farmer</option>
                                                    <option value="consumer">Consumer</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="Status">Status</label>
                                            <div className="custom_select">
                                                <select
                                                    name="Status"
                                                    id="Status"

                                                    required
                                                    ref={Status_input}
                                                >
                                                    <option value="online">online</option>
                                                    <option value="offline">offline</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="input_group">
                                            <label htmlFor="TermsAgreed">Terms Agreed</label>
                                            <div className="custom_select">
                                                <select
                                                    name="TermsAgreed"
                                                    id="TermsAgreed"

                                                    required
                                                    ref={TermsAgreed_input}
                                                >
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="part_6">
                                        <div className="input_group">
                                            <label htmlFor="Psk">Password</label>
                                            <input
                                                type="password"
                                                name="Psk"
                                                id="Psk"
                                                placeholder="Enter Password"

                                                ref={Psk_input}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="part_7">
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
                                        handleDeleteMarkedUsers(e, dialogFields.UserId)
                                    }
                                >
                                    <div className="input_group">
                                        <h3>
                                            Are you sure you want to delete the-{" "}
                                            <span style={{ color: "red" }}>marked Users</span>
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
                                    onSubmit={(e) => handleDeleteUsers(e, dialogFields.UserId)}
                                >
                                    <div className="input_group">
                                        <h3>
                                            Are you sure you want to delete this User -
                                            <span style={{ color: "red" }}>
                                                {dialogFields.Username}
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

export default UsersManagement;

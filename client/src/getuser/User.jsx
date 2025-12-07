import React, {useEffect, useState} from "react";
import "./User.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { set } from "mongoose";
import toast from "react-hot-toast";

const User = () => {

    const [users, setUsers] = useState([]);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/users');
                setUsers(response.data);
            } catch (error) {
                console.log("error while fetching data", error);
            }
        }
        fetchUsers();
    }, [])

    const deleteUser = async (id) => {
        await axios.delete(`http://localhost:8000/api/user/${id}`)
        .then((res) => {
            setUsers((prevUser) => prevUser.filter((user) => user._id !== id));
            toast.success(res.data.message, {position: "top-center"})
        })
        .catch((err) => {
            console.log("Error while deleting user", err);
        });
    };

    const handleSelect = (id) => {
        setSelectedUsers(prev => 
            prev.includes(id) 
                ? prev.filter(uid => uid !== id) 
                : [...prev, id]
        );
    };

    const deleteSelected = async () => {
        try {
            await Promise.all(selectedUsers.map(id => axios.delete(`http://localhost:8000/api/user/${id}`)));
            toast.success("Selected users deleted", { position: "top-center" });
            setSelectedUsers([]);
            setSelectMode(false);
            setUsers(prev => prev.filter(user => !selectedUsers.includes(user._id)));
        } catch (err) {
            toast.error("Error deleting users", { position: "top-center" });
            console.log(err);
        }
    };

    const toggleSelectMode = () => {
        if (selectMode) {
            setSelectedUsers([]);
            setSelectMode(false);
        } else {
            setSelectMode(true);
        }
    };

    return (
        <div className="table-container">
            <Link to='/add' type="button" class="btn btn-primary">
                <i class="fa-solid fa-user-plus"></i>
            </Link>
            {users.length > 1 && (
                    <button
                        className="btn btn-warning"
                        style={{ marginLeft: '10px' }}
                        onClick={toggleSelectMode}
                    >
                        {selectMode ? "Cancel Selection" : "Select Users"}
                    </button>
            )}

            {selectMode && selectedUsers.length > 0 && (
                    <button
                        className="btn btn-danger"
                        style={{ marginLeft: '10px' }}
                        onClick={deleteSelected}
                    >
                        Delete Selected
                    </button>
            )}

    <table className="table table-bordered">
        <thead>
            <tr>
                {selectMode && <th></th>}
                <th>S.No.</th>
                <th>Name</th>
                <th>Email</th>
                <th>Password</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {users.map((user, index) => (
                <tr key={user._id}>
                    {selectMode && (
                        <td>
                            <input
                                type="checkbox"
                                checked={selectedUsers.includes(user._id)}
                                onChange={() => handleSelect(user._id)}
                            />
                        </td>
                    )}
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td className="action-buttons">
                        <Link to={`/update/${user._id}`} className="btn btn-info">
                            <i className="fa-solid fa-pen-to-square"></i>
                        </Link>
                        <button
                            onClick={() => deleteUser(user._id)}
                            className="btn btn-danger"
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
)
}

export default User;
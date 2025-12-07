import React, { useEffect } from 'react';
import "./Update.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const UpdateUser = () => {
    const users = {
        name: "",
        email: "",
        password: "" 
    };
    const [user, setUser] = React.useState(users);
    const navigate = useNavigate();
    const {id} = useParams();

    const inputHandler = (e) => {
        const {name, value} = e.target;
        console.log(name,value);
        

        setUser({
            ...user,
            [name]: value
        })
    }

    useEffect(() => {
        axios.get(`http://localhost:8000/api/user/${id}`)
        .then((res) => {
            setUser(res.data);
        })
        .catch((err) => {
            console.log("Error while fetching user data", err);
        })
    }, [id])

    const submitForm = async(e) => {
        e.preventDefault();
        await axios
        .put(`http://localhost:8000/api/user/${id}`, user)
        .then((res) => {
            toast.success(res.data.message, {position: "top-center"});
            navigate("/");
        })
        .catch((err) => {
            console.log("Error while updating user", err);
        })
    }

    return(
        <div className='add-user'>
            <Link to="/" type="button" class="btn btn-secondary"><i class="fa-solid fa-backward"></i> Back</Link>
            <h3>Update User</h3>
            <form className='add-user-form' onSubmit={submitForm}>
                <div className='input-group'>
                    <label htmlFor='name'>Name:</label>
                    <input 
                    type="text"
                    id='name'
                    value={user.name}
                    onChange={inputHandler}
                    name='name'
                    autoComplete='off'
                    placeholder='Enter your name'
                     />
                </div>
                <div className='input-group'>
                    <label htmlFor='email'>Email:</label>
                    <input 
                    type="text"
                    id='email'
                    value={user.email}
                    onChange={inputHandler}
                    name='email'
                    autoComplete='off'
                    placeholder='Enter your email'
                     />
                </div>
                <div className='input-group'>
                    <label htmlFor='password'>Password:</label>
                    <input 
                    type="text"
                    id='password'
                    value={user.password}
                    onChange={inputHandler}
                    name='password'
                    autoComplete='off'
                    placeholder='Enter your password'
                     />
                </div>
                <div className='input-group'>
                    <button type="submit" class="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default UpdateUser;
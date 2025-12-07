import React from 'react';
import "./AddUser.css";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddUser = () => {
    const users = {
        name: "",
        email: "",
        password: "" 
    };
    const [user, setUser] = React.useState(users);
    const navigate = useNavigate();

    const inputHandler = (e) => {
        const {name, value} = e.target;
        console.log(name,value);
        

        setUser({
            ...user,
            [name]: value
        })
    }

    const validatePassword = (password) => {
        if (password.length < 8 || password.length > 16) {
            return "Password must be 8–16 characters long.";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must include at least one lowercase letter.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must include at least one uppercase letter.";
        }
        if (!/\d/.test(password)) {
            return "Password must include at least one digit.";
        }
        if (!/[\W_]/.test(password)) {
            return "Password must include at least one symbol.";
        }
        return null;
    }

    const validateEmail = (email) => {
    const emailRegex = /^[a-z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            return "Email must be a valid Gmail address";
        }
    return null;
    }

    const submitForm = async(e) => {
        e.preventDefault();

        const emailError = validateEmail(user.email);
        if (emailError) {
            toast.error(emailError, { position: "top-center" });
            return;
        }

        const passwordError = validatePassword(user.password);
        if (passwordError) {
            toast.error(passwordError, { position: "top-center" });
            return;
        }

        await axios.post("http://localhost:8000/api/user", user)
        .then((res) => {
            toast.success(res.data.message, {position: "top-center"});
            navigate("/");
        })
        .catch((err) => {
            if (err.response && err.response.status === 400) {
                toast.error(err.response.data.message, { position: "top-center" });
            } 
            else {
                toast.error("Something went wrong", { position: "top-center" });
            }
            console.log("Error while adding user", err);
        })
    }

    return(
        <div className='add-user'>
            <Link to="/" type="button" class="btn btn-secondary"><i class="fa-solid fa-backward"></i> Back</Link>
            <h3>Add New User</h3>
            <form className='add-user-form' onSubmit={submitForm}>
                <div className='input-group'>
                    <label htmlFor='name'>Name:</label>
                    <input 
                    type="text"
                    id='name'
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

export default AddUser;
import axios from 'axios';
import React from 'react';
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

// Import the image from the assets folder
import LoginImage from '../assets/LoginImage.jpeg';

const Login = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
  
    const onSubmit = async (data) => {
        const userInfo = {
            email: data.email,
            password: data.password
        }
        await axios.post("http://localhost:4002/user/login", userInfo)
            .then((res) => {
                console.log(res.data)
                if (res.data) {
                    toast.success("Successfully Logged In");
                    document.getElementById("my_modal_3").close();
                    setTimeout(() => {
                        window.location.reload();
                        localStorage.setItem("user", JSON.stringify(res.data.user));
                    }, 1000);
                }
            }).catch((err) => {
                if (err.response) {
                    console.log(err);
                    toast.error("Error: " + err.response.data.message)
                    setTimeout(() => {}, 2000);
                }
            })
    }

    return (
        <div>
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box max-w-4xl bg-slate-950 rounded-lg shadow-lg p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Left side with full illustration */}
                        <div className="p-0 m-0 rounded-l-lg overflow-hidden">
                            <img
                                src={LoginImage}
                                alt="Login Illustration"
                                className="h-full w-full object-cover"
                            />
                        </div>

                        {/* Right side with form */}
                        <div className="p-8">
                            <Link
                                to="/"
                                className="cursor-pointer btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500 hover:text-gray-800"
                                onClick={() => document.getElementById("my_modal_3").close()}
                            >
                                ✕
                            </Link>

                            <h3 className="font-bold text-3xl text-gray-800 text-center mb-6">Log In</h3>

                            <form onSubmit={handleSubmit(onSubmit)} method="dialog">

                                {/* Email */}
                                <div className='mb-4'>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Email:</label>
                                    <input
                                        type="email"
                                        placeholder="Enter Your Email"
                                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                                        {...register("email", { required: true })}
                                    />
                                    {errors.email && <span className='text-sm text-red-500'>This field is required.</span>}
                                </div>

                                {/* Password */}
                                <div className='mb-4'>
                                    <label className="block text-sm font-medium text-gray-600 mb-1">Password:</label>
                                    <input
                                        type="password"
                                        placeholder="Enter Your Password"
                                        className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500'
                                        {...register("password", { required: true })}
                                    />
                                    {errors.password && <span className='text-sm text-red-500'>This field is required.</span>}
                                </div>

                                {/* Remember Me and Forgot Password */}
                                <div className="flex justify-between items-center mb-4">
                                    <div className="flex items-center">
                                        <input id="remember_me" type="checkbox" className="h-4 w-4 text-pink-500 focus:ring-pink-500 border-gray-300 rounded" />
                                        <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-600">Remember me</label>
                                    </div>

                                    <div>
                                        <Link to="/forgot-password" className="text-sm text-pink-500 hover:text-pink-600">Forgot Password?</Link>
                                    </div>
                                </div>

                                {/* Button */}
                                <button className='w-full bg-pink-500 text-white rounded-md py-2 hover:bg-pink-700 transition duration-200'>
                                    Login
                                </button>

                                {/* Signup Link */}
                                <p className="mt-4 text-center text-sm text-gray-600">
                                    New user?{" "}
                                    <Link
                                        to="/signup"
                                        className='text-pink-500 hover:text-pink-700 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition duration-200'
                                    >
                                        Sign up
                                    </Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </dialog>
        </div>
    )
}

export default Login;

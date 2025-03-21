import axios from 'axios';
import React from 'react';
import { useForm } from "react-hook-form";
import toast from 'react-hot-toast';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Login from './Login';

const Signup = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = async (data) => {
        const userInfo = {
            fullname: data.fullname,
            email: data.email,
            password: data.password
        };
        await axios.post("http://localhost:4002/user/signup", userInfo)
            .then((res) => {
                console.log(res.data);
                if (res.data) {
                    toast.success("Successfully Signed Up");
                    navigate(from, { replace: true });
                }
                localStorage.setItem("user", JSON.stringify(res.data));
            }).catch((err) => {
                if (err.response) {
                    console.log(err);
                    toast.error("Error: " + err.response.data.message);
                }
            });
    };

    return (
        <div className='flex h-screen items-center justify-center bg-gray-100'>
            <div className='relative w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-2xl'>
                <form onSubmit={handleSubmit(onSubmit)} method="dialog">
                    <Link to="/" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500 hover:text-gray-800">✕</Link>
                    
                    <div className="flex flex-col md:flex-row">
                        {/* Left Side */}
                        <div className="hidden md:block md:w-1/2">
                            <div className="h-full bg-gradient-to-tr from-pink-400 to-pink-600 rounded-lg">
                                <div className="p-8 text-white text-lg font-medium flex flex-col justify-center items-center h-full">
                                    <p>Join our community and make a difference with us!</p>
                                    <p className="mt-4 text-sm">Together we can achieve more.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side */}
                        <div className="w-full md:w-1/2 md:pl-8">
                            <h3 className="text-3xl font-bold text-center text-gray-800">Create Account</h3>
                            
                            {/* Name */}
                            <div className='mt-6'>
                                <label className="block text-sm font-medium text-gray-600">Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter Your Name"
                                    className='w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500'
                                    {...register("fullname", { required: true })}
                                />
                                {errors.fullname && <span className='text-sm text-red-500'>This field is required.</span>}
                            </div>

                            {/* Email */}
                            <div className='mt-4'>
                                <label className="block text-sm font-medium text-gray-600">Email</label>
                                <input
                                    type="email"
                                    placeholder="Enter Your Email"
                                    className='w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500'
                                    {...register("email", { required: true })}
                                />
                                {errors.email && <span className='text-sm text-red-500'>This field is required.</span>}
                            </div>

                            {/* Password */}
                            <div className='mt-4'>
                                <label className="block text-sm font-medium text-gray-600">Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter Your Password"
                                    className='w-full px-4 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500'
                                    {...register("password", { required: true })}
                                />
                                {errors.password && <span className='text-sm text-red-500'>This field is required.</span>}
                            </div>

                            {/* Signup Button */}
                            <div className='mt-6'>
                                <button className='w-full px-4 py-2 font-medium text-white bg-pink-500 rounded-md shadow-sm hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2'>
                                    Sign Up
                                </button>
                            </div>

                            {/* Already have an account */}
                            <p className='mt-6 text-center text-sm text-gray-600'>
                                Already have an account?{" "}
                                <button
                                    className='font-medium text-pink-500 hover:text-pink-700'
                                    onClick={() => document.getElementById("my_modal_3").showModal()}
                                >
                                    Log In
                                </button>
                            </p>
                            <Login />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;

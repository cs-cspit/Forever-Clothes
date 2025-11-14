import React, { useState } from 'react'
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Login = ({setToken}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const onSubmitHandler = async(e)=>{
        try {
            e.preventDefault();
            setIsLoading(true);
            const response = await axios.post(backendUrl+'/api/user/admin', {email, password});
            if(response.data.success){
                setToken(response.data.token);
                toast.success("Welcome to Admin Panel!");
            }else{
                toast.error(response.data.message);
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4'>
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20"></div>
        </div>

        <div className='relative bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 max-w-md w-full border border-white/20'>
            {/* Logo and Header */}
            <div className='text-center mb-8'>
                <div className='mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg'>
                    <img src={assets.logo} alt="Logo" className='w-12 h-12 object-contain' />
                </div>
                <h1 className='text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2'>
                    Admin Panel
                </h1>
                <p className='text-gray-600'>Sign in to manage your store</p>
            </div>

            <form onSubmit={onSubmitHandler} className='space-y-6'>
                {/* Email Field */}
                <div className='space-y-2'>
                    <label className='block text-sm font-semibold text-gray-700'>
                        Email Address
                    </label>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207' />
                            </svg>
                        </div>
                        <input 
                            onChange={(e)=>setEmail(e.target.value)} 
                            value={email} 
                            className='w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 focus:bg-white' 
                            type="email" 
                            placeholder='admin@example.com' 
                            required
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className='space-y-2'>
                    <label className='block text-sm font-semibold text-gray-700'>
                        Password
                    </label>
                    <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                            <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' />
                            </svg>
                        </div>
                        <input 
                            onChange={(e)=>setPassword(e.target.value)} 
                            value={password} 
                            className='w-full pl-10 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 bg-gray-50/50 focus:bg-white' 
                            type="password" 
                            placeholder='Enter your password' 
                            required
                        />
                    </div>
                </div>

                {/* Login Button */}
                <button 
                    className='w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none' 
                    type='submit'
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className='flex items-center justify-center'>
                            <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2'></div>
                            Signing In...
                        </div>
                    ) : (
                        <div className='flex items-center justify-center'>
                            <svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1' />
                            </svg>
                            Sign In
                        </div>
                    )}
                </button>
            </form>

            {/* Footer */}
            <div className='mt-8 text-center'>
                <p className='text-sm text-gray-500'>
                    Secure admin access for Forever Clothes
                </p>
            </div>
        </div>
    </div>
  )
}

export default Login
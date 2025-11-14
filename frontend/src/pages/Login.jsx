import { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState,setCurrentState] = useState('Login');
  const [name,setName] = useState('');
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const {token,setToken,navigate,backendUrl} = useContext(ShopContext);

  const onSubmitHandler = async(event)=>{
    event.preventDefault();
    try{
      if(currentState==='Sign Up'){
        const response = await axios.post(backendUrl+'/api/user/register',{name,email,password});
        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem('token',response.data.token);
          toast.success('Account created successfully!');
        }else{
          toast.error(response.data.message);
        }
      }else{
        const response = await axios.post(backendUrl+'/api/user/login',{email,password});
        if(response.data.success){
          setToken(response.data.token);
          localStorage.setItem('token',response.data.token);
          toast.success('Successfully logged in!');
        }else{
          toast.error(response.data.message);
        }
      }
    }
    catch(error){
      console.log(error);
      toast.error(error.response?.data?.message || error.message);
    }
  }

  useEffect(()=>{
    if(token){
      navigate('/');
    }
  },[token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div>
          <img src={assets.logo} className="mx-auto h-12 w-auto" alt="Forever Clothes" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {currentState === 'Login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {currentState === 'Login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login')}
              className="font-medium text-black hover:text-gray-800 transition-colors"
            >
              {currentState === 'Login' ? 'Sign up here' : 'Sign in here'}
            </button>
          </p>
        </div>
        <form onSubmit={onSubmitHandler} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md">
            {currentState === 'Sign Up' && (
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                  placeholder="Full Name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Password"
              />
            </div>
          </div>

          {currentState === 'Login' && (
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm font-medium text-black hover:text-gray-800 transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
            >
              {currentState === 'Login' ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
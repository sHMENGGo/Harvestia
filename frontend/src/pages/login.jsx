import { Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function login() {

	const [userName, setUserName] = useState('')
	const [userPassword, setUserPasword] = useState('')
	const [validLogin, setValidLogin] = useState(false)

	// Verify login username and password
	const verifyLogin = async (e)=> {
		e.preventDefault()
		try {
			const res = await axios.post('http://localhost:5000/api/login', {
				userName, userPassword
			})
			// Store generated token from server
			localStorage.setItem('token', res.data.token)
			setValidLogin(true)
		} catch (err) {console.error("Login failed", err)}
	}

   return (
		<form onSubmit={(e)=> verifyLogin(e)}  className="absolute z-10 flex flex-col items-center p-10 rounded-xl shadow-2xl w-9/10 lg:w-1/3 h-6/10 backdrop-blur-2xl text-offwhite">
			<p className="text-3xl font-bold">Login</p><br /><br />
			<div className="w-full flex items-center">
				<input type="text" value={userName} onChange={(e)=> setUserName(e.target.value)} required name="userName" className="peer flex-1 border border-white rounded-3xl p-2 pl-4" />
				<label htmlFor="userName"  className={`text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all `}>Username</label>
			</div><br />
			<div className="w-full flex items-center">
				<input type="password" value={userPassword} onChange={(e)=> setUserPasword(e.target.value)} required name="userPassword" className="peer flex-1 border border-white rounded-3xl p-2 pl-4"  />
				<label htmlFor="userPassword" className=" text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all">Password</label>
			</div>
			<div className="flex mt-2 w-full relative">
				<input type="checkbox" name="rememberMe" className="scale-120 left-0 mr-1 cursor-pointer" />
				<label htmlFor="rememberMe" className='text-xs lg:text-[1rem]' >Remember me</label>
				<p   className="right-0 font-normal absolute text-white cursor-pointer hover:text-blue-500 text-xs lg:text-[1rem]">Forgot Password?</p>
			</div><br />
			<input type="submit" value={'Login'}  className=" p-2 w-full text-lg hover:bg-gray-200/80 font-bold cursor-pointer rounded-3xl bg-white text-gray-800" />
			<p className='mt-2 text-xs lg:text-[1rem]'>Don't have an account? <span className=' text-white hover:text-blue-500'>Register</span></p>

			{/* Show dashboard if valid login */}
			{validLogin && (<Navigate to={'/Home'} replace />)}
		</form>
   )
}

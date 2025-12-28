import { Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { apiPost } from '../components/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'

export default function login({set_valid_login, valid_login}) {
	// Verify login username and password
	const [username, set_username] = useState('')
	const [password, set_password] = useState('')
	const [login_error, set_login_error] = useState('')
	function verifyLogin() {
		apiPost('/login', {username: username, password: password}).then((data)=> {
			if(data.error) set_login_error(data.error)
			set_valid_login(data.valid_login)
		})
	}

	const [show_password, set_show_password] = useState(false)

   return (
		<form onSubmit={(e)=> {verifyLogin(); e.preventDefault()}}  className="absolute top-1/5 left-2/10 border-khaki border flex flex-col items-center p-10 rounded-xl shadow-2xl w-9/10 lg:w-1/3 h-6/10 backdrop-blur-3xl text-offwhite">
			<p className="text-3xl font-bold">Login</p><br /><br />
			<div className="w-full flex items-center">
				<input type="text" value={username} onChange={(e)=> set_username(e.target.value)} required name="username" className="peer flex-1 border border-khaki rounded-3xl p-2 pl-4 valid:bg-transparent" />
				<label htmlFor="username"  className={`text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all pointer-events-none`}>Username</label>
			</div><br />
			<div className="w-full flex items-center relative">
				{show_password === true ? <FontAwesomeIcon icon={faEyeSlash} onClick={()=> set_show_password(false)}  className='right-3 opacity-60 cursor-pointer absolute'  /> : <FontAwesomeIcon icon={faEye} onClick={()=> set_show_password(true)}  className='right-3 opacity-60 cursor-pointer absolute' />}
				<input type={show_password === true ? "text" : "password"} value={password} onChange={(e)=> set_password(e.target.value)} required name="password" className="peer flex-1 border border-khaki rounded-3xl p-2 pl-4"  />
				<label htmlFor="password" className=" text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all pointer-events-none">Password</label>
			</div>
			<p className=' text-red-500 text-sm mt-1'>{login_error}</p>
			<div className="flex w-full relative mt-2">
				<input type="checkbox" name="rememberMe" className="scale-120 left-0 mr-1 cursor-pointer" />
				<label htmlFor="rememberMe" className='text-xs lg:text-[1rem]' >Remember me</label>
				<p   className="right-0 font-normal absolute text-white cursor-pointer hover:text-blue-500 text-xs lg:text-[1rem]">Forgot Password?</p>
			</div><br />
			<input type="submit" value={'Login'}  className=" p-2 w-full text-lg font-bold rounded-3xl bg-khaki text-neutral-800" />
			<p className='mt-2 text-xs lg:text-[1rem]'>Don't have an account? <span className=' text-white hover:text-blue-500 cursor-pointer'>Register</span></p>

			{/* Go to home if valid login */}
			{valid_login && (<Navigate to={'/home'} replace />)}
		</form>
   )
}

import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import Login from './pages/login'
import SideBar from './components/sideBar'
import Dashboard from './pages/dashboard'
import Home from './pages/home'
import Admin from './pages/admin'
import { jwtDecode } from "jwt-decode"
import axios from "axios"

export default function App() {
	const [showCategoryModal, setShowCategoryModal] = useState(false)
	const hideSadbarOn = ['/Login', '/Register', '/RecoverAccount']
	const [isAdmin, setIsAdmin] = useState(false)
	const [inputCategory, setInputCategory] = useState('')

	// Send category name to the server
	async function addCategory(e) {
		e.preventDefault()
		try {
			const token = localStorage.getItem('token')
			if(token) {const decoded = jwtDecode(token); setIsAdmin(decoded.isAdmin)}
			const res = await axios.post('http://localhost:5000/api/addCategory', { inputCategory })
			alert(res.data.message)
		} catch(err) {console.error('Error sending category to the server', err)}
	}

	// Check token expiration
	// const decoded = jwtDecode(localStorage.getItem('token'))
	// console.log(decoded.exp - Date.now()/1000)

   return(
		<main className="flex w-full absolute justify-center items-center top-0 text-gray-800 bg-[url('./assets/bookShelfBG.jpg')] bg-cover bg-center">
			<Routes>
				<Route path='/' element={<Navigate to='/Login'/>}/> 
				<Route path='/Login' element={<Login />}/>
			</Routes>

			<section className="w-[80%] left-[10%] h-screen overflow-auto relative text-offwhite">
				<Routes>
					<Route path='/Register' element={<Login />}/>
					<Route path='/RecoverAccount' element={<Login />}/>
					<Route path='/Dashboard' element={<Dashboard />}/>
					<Route path='/Home' element={<Home />} />
					<Route path='/Admin' element={<Admin />} />
				</Routes>
			</section>

			{/* Don't show sidebar in login */}
			{!hideSadbarOn.includes(useLocation().pathname) && <SideBar setShowCategoryModal={setShowCategoryModal}/>} 

			{/* Category form */}
			{showCategoryModal && (
				<main onClick={()=> setShowCategoryModal(false)}  className='absolute top-0 left-0 w-full h-full bg-gray-950/50 flex justify-center items-center text-white' >
					<form onSubmit={(e)=> addCategory(e)} onClick={(e)=> e.stopPropagation()}  className="w-1/2 h-[12%] p-6 bg-gray-700/50 backdrop-blur-xs flex rounded-2xl items-center shadow-2xl">
						<input type="text" name="categoryName" id="" value={inputCategory} onChange={(e)=> setInputCategory(e.target.value)} required  className="peer flex-1 p-3 text-lg font-semibold rounded-lg h-full border" />
						<label htmlFor="categoryName"  className="absolute ml-3 select-none peer-focus:-mt-14 peer-focus:text-sm peer-valid:-mt-14 peer-valid:text-sm transition-all" >Category Name</label>
						<input type="submit" className=" p-1 px-3 cursor-pointer rounded-lg ml-5 bg-white text-gray-800 font-bold" />
					</form>
				</main>
			)}
		</main>
   )
}


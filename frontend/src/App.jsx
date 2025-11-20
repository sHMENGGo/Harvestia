import { Routes, Route, Navigate, useLocation, useNavigate, replace } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/login'
import SideBar from './components/sideBar'
import Dashboard from './pages/dashboard'
import Home from './pages/home'
import Admin from './pages/admin'
import Profile from './pages/profile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { apiPost, apiGet, apiDelete } from './components/api'

export default function App() {
	const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
	const [showAddRiceModal, setShowAddRiceModal] = useState(false)
	const [showProfileModal, setShowProfileModal] = useState(false)
	const [showLogoutModal, setShowLogoutModal] = useState(false)
	const [showDeleteRiceModal, setShowDeleteRiceModal] = useState(false)
	const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false)
	const [refresh, setRefresh] = useState(false)
	const hideSadbarOn = ['/login', '/register', '/recoverAccount']
	
	// Check if theres's existing token
	const [loggedIn, setLoggedIn] = useState(null)
	const [user, setUser] = useState(null)
	useEffect(()=> {
		const checkToken = async ()=> {
			try {
				console.log("Checking token...")
				const data = await apiGet('/verifyToken')
				if(data.user) {
					setLoggedIn(true)
					setUser(data.user)
					console.log(data.message)
				}
			} catch(err) {
				console.error('Checking token failed ', err)
				setLoggedIn(false)
			}
		}
		checkToken()
	}, [refresh])

	// Redirect to login page if there's no token
	const navigate = useNavigate()
	useEffect(()=> {
		if(loggedIn === false) {
			console.log('No token exist, going to login')
			navigate('/login', {replace:true})
 		}
		else {navigate('/home', {replace:true})}
	}, [loggedIn])

	// Send category to the server
	const [inputCategory, setInputCategory] = useState('')
	function addCategory() {
		apiPost('/addCategory', {inputCategory}).then((data)=> {
			alert(data.message)
			setInputCategory('')
			setShowAddCategoryModal(false)
			setRefresh(prev => !prev)
		})
	}

	// Send rice to the server
	const [inputRice, setInputRice] = useState('')
	const [inputCompany, setInputCompany] = useState('')
	const [inputCategoryName, setInputCategoryName] = useState('')
	const [inputPrice, setInputPrice] = useState('')
	const [inputStock, setInputStock] = useState('')
	const [inputWeight, setInputWeight] = useState('')
	const [imageFile, setImageFile] = useState(null)
	function addRice(e) {
		e.preventDefault()
		// find category id of input category name
		const category = categories.find(c => c.name === inputCategoryName)
		const selectedCategoryID = category ? category.id : null
		// send data with rice image
		const formData = new FormData()
		formData.append('inputRice', inputRice)
		formData.append('inputCompany', inputCompany)
		formData.append('inputCategoryID', selectedCategoryID)
		formData.append('inputPrice', inputPrice)
		formData.append('inputStock', inputStock)
		formData.append('inputWeight', inputWeight)
		formData.append('image', imageFile)
		apiPost('/addRice', formData).then((data)=> {
			alert(data.message)
			setShowAddRiceModal(false)
			setRefresh(prev => !prev)
			setInputRice('')
			setInputCompany('')
			setInputCategoryName('')
			setInputPrice('')
			setInputStock('')
			setInputWeight('')
			setImageFile(null)
		})
	}

	// Change image file when uploaded image changed
	const [imageName, setImageName] = useState('')
	function imageOnChange(e) {
		const image = e.target.files[0]
		if(image) {
			setImageFile(image)
			setImageName(image.name)
		}
		else {setImageFile(null)}
	}

	// Fetch categories from the server
	const [categories, setCategories] = useState([])
	useEffect(()=> {
		if(loggedIn) {apiGet('/getCategories').then((data)=> {setCategories(data.categories)})}
	}, [loggedIn])

	// Set value to sidebar and value to home
	const [showCategory, setShowCategory] = useState(0)

	// Function to delete rice
	const [selectedRice, setSelectedRice] = useState(null)
	function deleteRice() {
		apiDelete('/deleteRice', {selectedRice}).then((data)=> {
			alert(data.message)
			setShowDeleteRiceModal(false)
			setRefresh(prev => !prev)
		})
	}

	// Function to delete category
	const [selectedCategory, setSelectedCategory] = useState(null)
	function deleteCategory() {
		apiDelete('/deleteCategory', {selectedCategory}).then((data)=> {
			alert(data.message)
			setShowDeleteCategoryModal(false)
			setRefresh(prev => !prev)
		})
	}


   return(
		<main className="flex w-full family-roboto absolute justify-center items-center top-0 text-neutral-900 bg-[url('./assets/riceBG.jpg')] bg-center bg-cover">
			<section className="w-[80%] left-[10%] h-screen overflow-auto relative text-neutral-900">
				<Routes>
					<Route path='/' element={<Navigate to={loggedIn ? '/home' : '/login'} replace />} />
					<Route path='/login' element={<Login setLoggedIn={setLoggedIn} />}/>
					<Route path='/register' element={<Navigate to='/login'/>}/>
					<Route path='/recoverAccount' element={<Navigate to='/login'/>}/>
					<Route path='/dashboard' element={<Dashboard />}/>
					<Route path='/profile' element={<Profile user={user} />}/>
					<Route path='/home' element={<Home showCategory={showCategory} refresh={refresh} />} />
					<Route path='/admin' element={<Admin 
						setShowAddCategoryModal={setShowAddCategoryModal} 
						setShowAddRiceModal={setShowAddRiceModal} 
						setShowDeleteRiceModal={setShowDeleteRiceModal} 
						setShowDeleteCategoryModal={setShowDeleteCategoryModal}
						setSelectedRice={setSelectedRice}
						setSelectedCategory={setSelectedCategory}
						refresh={refresh}
					/>} />
				</Routes>
			</section>

			{/* Show sidebar but not in login */}
			{!hideSadbarOn.includes(useLocation().pathname) && <SideBar setShowProfileModal={setShowProfileModal} setShowCategory={setShowCategory} refresh={refresh} />} 

			{/* Category add form */}
			{showAddCategoryModal && (
				<main onClick={()=> setShowAddCategoryModal(false)}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center' >
					<form onSubmit={(e)=> {addCategory(); e.preventDefault()}} onClick={(e)=> e.stopPropagation()}  className="w-1/3 p-6 gap-5 bg-khaki flex flex-col rounded-2xl items-center shadow-2xl">
						<p className='text-2xl text-sageGreen font-bold' >ADD NEW CATEGORY</p>
						<div className="w-full flex items-center">
							<input type="text" value={inputCategory} onChange={(e)=> setInputCategory(e.target.value)} required name="inputCategory" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="inputCategory"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all' >Category Name</label>
						</div>
						<input type="submit" className=" p-2 px-3 w-full cursor-pointer rounded-full bg-brown hover:scale-105 active:scale-95 text-offwhite font-semibold" />
					</form>
				</main>
			)}

			{/* Rice add form */}
			{showAddRiceModal && (
				<main onClick={()=> setShowAddRiceModal(false)}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center text-white' >
					<form onSubmit={addRice} onClick={(e)=> e.stopPropagation()}  className="w-1/3 gap-5 p-6 text-neutral-900 bg-khaki flex flex-col rounded-2xl items-center shadow-2xl" >
						<p className='text-2xl text-sageGreen font-bold' >ADD NEW RICE</p>
						<div className='w-full relative flex'>
							<label htmlFor="riceImage"  className='w-1/3 text-center text-offwhite rounded-full p-2 px-3 cursor-pointer bg-brown hover:scale-105 active:scale-95' >Upload Image</label>
							<input type="file" id="riceImage" onChange={(e)=> imageOnChange(e)} accept='image/*'  className='hidden' />
							<p  className='border w-2/3 rounded-full p-2 px-3 ml-2 opacity-60 select-none' >{imageName}</p>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={inputRice} onChange={(e)=> setInputRice(e.target.value)} required name="riceName" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="riceName"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all'>Rice Name</label>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={inputCompany} onChange={(e)=> setInputCompany(e.target.value)} name="riceCompany" placeholder=' '  className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="riceCompany" className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:-mt-15 absolute ml-4 transition-all' >Company</label>
						</div>
						<select onChange={(e) => setInputCategoryName(e.target.value)} name="category" className='border w-full p-2 px-3 rounded-full text-lg' >
							<option selected disabled required  className='bg-khaki text-lg' >Select Category</option>
							{categories.map((category)=> (
								<option key={category.id} value={category.name} className='bg-khaki text-lg' >{category.name}</option>
							))}
						</select>
						<div className="w-full flex items-center">
							<input type="text" value={inputPrice} onChange={(e)=> setInputPrice(e.target.value)} required name="price" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="price"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all' >Price</label>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={inputStock} onChange={(e)=> setInputStock(e.target.value)} required name="stock" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="stock"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all' >Stock</label>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={inputWeight} onChange={(e)=> setInputWeight(e.target.value)} name="weight" placeholder=' '  className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="weight" className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:-mt-15 absolute ml-4 transition-all' >Weight in KG</label>
						</div>
						<input type="submit" className=" p-2 px-3 w-full cursor-pointer rounded-full bg-brown hover:scale-103 active:scale-95 text-offwhite font-semibold text-lg" />
					</form>
				</main>
			)}

			{/* User profile modal */}
			{!hideSadbarOn.includes(useLocation().pathname) && showProfileModal ? (
				<section className=" absolute left-[20%] gap-4 w-1/3 h-full p-10 text-offwhite bg-coal flex flex-col items-center" >
					<div className="bg-gray-500 rounded-full w-1/2 aspect-square flex justify-center items-center" >
						<img src="img.jpg"  className='w-full h-full rounded-full' />
						<FontAwesomeIcon icon={faUser} className='absolute text-8xl' />
					</div>
					
					<label htmlFor="photoUpload" className="text-sm bg-gray-700 p-1 rounded-lg text-center cursor-pointer hover:outline hover:outline-blue-800" >Upload photo</label>
					<input type="file" id="photoUpload"  className=" hidden" /><br />
					<div className="place-self-start w-full flex items-center">
						<label htmlFor="name">Name: </label>
						<input type="text" id="name"  className="ml-10 flex-1 border border-white rounded-3xl p-2 pl-4" />
					</div>
					<div className="place-self-start w-full flex items-center">
						<label htmlFor="name">Password: </label>
						<input type="password" id="name"  className="ml-3 flex-1 border border-white rounded-3xl p-2 pl-4" />
					</div>
					<div className="place-self-start w-full flex items-center">
						<label htmlFor="name">Email: </label>
						<input type="password" id="name"  className=" ml-11 flex-1 border border-white rounded-3xl p-2 pl-4" />
					</div>
					<button  className="mt-7 p-1 w-1/4 text-lg hover:outline hover:outline-blue-800 rounded-3xl bg-gray-700 text-offwhite" >Save</button>
					<button onClick={()=> {setShowLogoutModal(true); setShowProfileModal(false)}}  className="mt-7 p-1 w-1/4 text-lg hover:outline hover:outline-red-800 rounded-3xl bg-gray-700 text-offwhite" >Log out</button>
				</section>
			):null}

			{/* Delete rice confirmation */}
			{showDeleteRiceModal && (
				<main onClick={()=> {setShowDeleteRiceModal(false); setSelectedRice(null)}}  className='absolute top-0 left-0 w-full h-full bg-gray-950/70 flex justify-center items-center text-neutral-900' >
					<section onClick={(e)=> e.stopPropagation()}  className="p-10 gap-10 justify-center relative bg-khaki flex flex-col rounded-2xl items-center shadow-2xl" >
						<p  className='text-4xl top-10 text-sageGreen font-bold' >Delete {selectedRice.name} rice?</p>
						<div className='w-full flex justify-around items-center'>
							<button onClick={()=> deleteRice()}  className="p-1 w-1/3 text-lg hover:scale-105 active:scale-95 font-bold rounded-full bg-red-500 text-offwhite" >Delete</button>
							<button onClick={()=> {setShowDeleteRiceModal(false); setSelectedRice(null)}}  className="p-1 w-1/3 text-lg hover:scale-105 active:scale-95 font-bold rounded-full bg-blue-500 text-offwhite" >Cancel</button>
						</div>
					</section>
				</main>
			)}

			{/* Delete category confirmation */}
			{showDeleteCategoryModal && (
				<main onClick={()=> {setShowDeleteCategoryModal(false); setSelectedCategory(null)}}  className='absolute top-0 left-0 w-full h-full bg-gray-950/70 flex justify-center items-center text-neutral-900' >
					<section onClick={(e)=> e.stopPropagation()}  className="p-10 gap-10 justify-center relative bg-khaki flex flex-col rounded-2xl items-center shadow-2xl" >
						<p  className='text-4xl top-10 text-sageGreen font-bold' >Delete {selectedCategory.name} Category?</p>
						<div className='w-full flex justify-around items-center'>
							<button onClick={()=> deleteCategory()}  className="p-1 w-1/3 text-lg hover:scale-105 active:scale-95 font-bold rounded-3xl bg-red-500 text-offwhite" >Delete</button>
							<button onClick={()=> {setShowDeleteCategoryModal(false); setSelectedCategory(null)}}  className="p-1 w-1/3 text-lg hover:scale-105 active:scale-95 font-bold rounded-3xl bg-blue-500 text-offwhite" >Cancel</button>
						</div>
					</section>
				</main>
			)}

			{/* Logout confirmation */}
			{showLogoutModal && (
				<main onClick={()=> setShowLogoutModal(false)}  className='absolute top-0 left-0 w-full h-full bg-gray-950/70 flex justify-center items-center text-white' >
					<section onClick={(e)=> e.stopPropagation()}  className="w-1/2 h-1/2 p-6 gap-4 justify-center bg-coal backdrop-blur-xs flex rounded-2xl items-end shadow-2xl" >
						<p className='text-5xl absolute top-10' >Confirm log out</p>
						<button className="mt-7 p-1 w-1/3 text-lg hover:outline hover:outline-red-800 font-bold rounded-3xl bg-coal text-offwhite" >Logout</button>
						<button onClick={()=> setShowLogoutModal(false)}  className="mt-7 p-1 w-1/3 text-lg hover:outline hover:outline-red-800 font-bold rounded-3xl bg-coal text-offwhite" >Cancel</button>
					</section>
				</main>
			)}
		</main>
   )
}


import { Routes, Route, Navigate, useLocation, useNavigate, replace } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/login'
import SideBar from './components/sideBar'
import Dashboard from './pages/dashboard'
import Home from './pages/home'
import Admin from './pages/admin'
import Profile from './pages/profile'
import { apiPost, apiGet, apiDelete, apiPut } from './components/api'

export default function App() {
	const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
	const [showAddRiceModal, setShowAddRiceModal] = useState(false)
	const [showLogoutModal, setShowLogoutModal] = useState(false)
	const [showEditModal, setShowEditModal] = useState(false)
	const [showDeleteRiceModal, setShowDeleteRiceModal] = useState(false)
	const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false)
	const [refresh, setRefresh] = useState(false)
	const hideSadbarOn = ['/login', '/register', '/recoverAccount']
	const [selectedRice, setSelectedRice] = useState('')
	const location = useLocation()
	const navigate = useNavigate()

	// Set value to sidebar and value to home
	const [showCategory, setShowCategory] = useState(0)

	// Check if theres's existing token
	const [user, setUser] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	useEffect(()=> {
		const checkToken = async ()=> {
			try {
				console.log("Checking token...")
				const data = await apiGet('/verifyToken')
				console.log("Current user: ", data.user)
				if(data.user) {
					setLoggedIn(true)
					setUser(data.user)
					console.log(data.message)
				}
				else {
					console.log('No user, going to login page...')
				}
			} catch(err) {
				console.error('Checking token failed ', err)
				setLoggedIn(false)
			} finally {setIsLoading(false)}
		}
		checkToken()
	}, [refresh])

	// Redirect to login page if there's no token
	const [loggedIn, setLoggedIn] = useState(null)
	useEffect(()=> {
		if(loggedIn === false) {
			console.log('No token exist, going to login')
			navigate('/login', {replace:true})
 		} else {navigate('/admin', {replace:true})}
	}, [loggedIn])

	// Fetch categories from the server
	const [categories, setCategories] = useState([])
	useEffect(()=> {
		if(loggedIn) {apiGet('/getCategories').then((data)=> {setCategories(data.categories)})}
	}, [loggedIn])

	// Fetch Users from server
	const [users, setUsers] = useState([])
	useEffect(()=> {
		if(loggedIn) {apiGet('/getUsers').then((data)=> setUsers(data.users))}
	}, [loggedIn])
	const totalUsers = users.length

	// Fetch rices from server
	const [rices, setRices] = useState([])
	useEffect(()=> {
		if(loggedIn) {apiGet('/getRices').then((data)=> setRices(data.rices))}
	}, [loggedIn])
	const totalRices = rices.length

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
		// send data to server with new rice image
		const formData = new FormData()
		formData.append('inputRice', inputRice)
		formData.append('inputCompany', inputCompany)
		formData.append('inputCategoryID', selectedCategoryID)
		formData.append('inputPrice', inputPrice)
		formData.append('inputStock', inputStock)
		formData.append('inputWeight', inputWeight)
		formData.append('imageFile', imageFile)
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
	function imageOnChange(e) {
		const image = e.target.files[0]
		if(image) setImageFile(image)
		else setImageFile(null)
	}

	// Function to delete rice
	function deleteRice() {
		apiDelete('/deleteRice', {selectedRice}).then((data)=> {
			alert(data.message)
			setShowDeleteRiceModal(false)
			setRefresh(prev => !prev)
		})
	}

	// New variables for editing rice
	const [newInputRice, setNewInputRice] = useState('')
	const [newInputCompany, setNewInputCompany] = useState('')
	const [newInputCategoryName, setNewInputCategoryName] = useState('')
	const [newInputPrice, setNewInputPrice] = useState('')
	const [newInputStock, setNewInputStock] = useState('')
	const [newInputWeight, setNewInputWeight] = useState('')
	const [newImagePreview, setNewImagePreview] = useState(null)
	const [newImageFile, setNewImageFile] = useState(null)
	useEffect(()=> {
		if(!selectedRice) return
		setNewInputRice(selectedRice.name || '')
		setNewInputCompany(selectedRice.company || '')
		setNewInputCategoryName(selectedRice.categoryName || '')
		setNewInputPrice(selectedRice.price || '')
		setNewInputStock(selectedRice.stock || '')
		setNewInputWeight(selectedRice.weightKG || '')
		setNewImagePreview(selectedRice.imagePath)
	}, [selectedRice])
	// Change new image file when uploaded image changed
	function newImageOnChange(e) {
		const image = e.target.files[0]
		if(image) {
			URL.revokeObjectURL(newImagePreview)
			setNewImagePreview(URL.createObjectURL(image))
			setNewImageFile(image)
		}
	}

	// Function to edit rice
	function editRice(e) {
		e.preventDefault()
		// find category id of new category name
		const category = categories.find(c => c.name === newInputCategoryName)
		const selectedCategoryID = category ? category.id : null
		// send data to server with new rice image
		const formData = new FormData()
		formData.append('newInputRice', newInputRice)
		formData.append('newInputCompany', newInputCompany)
		formData.append('selectedCategoryID', selectedCategoryID)
		formData.append('newInputPrice', newInputPrice)
		formData.append('newInputStock', newInputStock)
		formData.append('newInputWeight', newInputWeight)
		formData.append('oldImageID', selectedRice.imagePublicID)
		formData.append('oldRiceID', selectedRice.id)
		formData.append('newImageFile', newImageFile)
		apiPut('/editRice', formData).then((data)=> {
			alert(data.message)
			setShowEditModal(false)
			setRefresh(prev => !prev)
			setNewInputRice('')
			setNewInputCompany('')
			setNewInputCategoryName('')
			setNewInputPrice('')
			setNewInputStock('')
			setNewInputWeight('')
			setNewImageFile(null)
			setSelectedRice(null)
			URL.revokeObjectURL(newImagePreview)
			setNewImagePreview(null)
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

	// Prevent app to render if there's no user, wait for token checking
	if(isLoading) return <div className="w-full top-0 flex justify-center items-center absolute h-full family-roboto"><p className='text-9xl opacity-50'>Loading...</p></div>

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
					<Route path='/home' element={<Home 
						showCategory={showCategory} 
						rices={rices}
					/>} />
					<Route path='/admin' element={<Admin 
						setShowAddCategoryModal={setShowAddCategoryModal} 
						setShowAddRiceModal={setShowAddRiceModal} 
						setShowDeleteRiceModal={setShowDeleteRiceModal}
						setShowEditModal={setShowEditModal}
						setShowDeleteCategoryModal={setShowDeleteCategoryModal}
						setSelectedRice={setSelectedRice}
						setSelectedCategory={setSelectedCategory}
						users={users}
						categories={categories}
						totalUsers={totalUsers}
						rices={rices}
						totalRices={totalRices}
					/>} />
				</Routes>
			</section>

			{/* Show sidebar but not in login */}
			{!hideSadbarOn.includes(location.pathname) && <SideBar 
				setShowCategory={setShowCategory} 
				categories={categories}
				user={user}
				refresh={refresh} 
			/>} 

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

			{/* Rice add form */}
			{showAddRiceModal && (
				<main onClick={()=> setShowAddRiceModal(false)}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center text-white' >
					<form onSubmit={addRice} onClick={(e)=> e.stopPropagation()}  className="w-1/3 gap-5 p-6 text-neutral-900 bg-khaki flex flex-col rounded-2xl items-center shadow-2xl" >
						<p className='text-2xl text-sageGreen font-bold' >NEW RICE</p>
						<div className='w-full relative flex'>
							<label htmlFor="riceImage"  className='w-1/3 text-center text-offwhite rounded-full p-2 px-3 cursor-pointer bg-brown hover:scale-105 active:scale-95' >Upload Image</label>
							<input type="file" id="riceImage" onChange={(e)=> imageOnChange(e)} accept='image/*'  className='hidden' />
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
						<input type="submit" className=" p-2 px-3 w-full cursor-pointer rounded-full bg-brown hover:scale-103 active:scale-95 text-offwhite font-semibold text-lg" onClick={()=> setShowAddRiceModal(false)} />
					</form>
				</main>
			)}

			{/* Delete rice confirmation */}
			{showDeleteRiceModal && (
				<main onClick={()=> {setShowDeleteRiceModal(false); setSelectedRice(null)}}  className='absolute top-0 left-0 w-full h-full bg-gray-950/70 flex justify-center items-center text-neutral-900' >
					<section onClick={(e)=> e.stopPropagation()}  className="p-10 gap-10 justify-center relative bg-khaki flex flex-col rounded-2xl items-center shadow-2xl" >
						<p  className='text-4xl top-10 text-sageGreen font-bold' >DELETE {selectedRice.name}</p>
						<div className='w-full flex justify-around items-center'>
							<button onClick={()=> deleteRice()}  className="p-1 w-1/3 text-lg hover:scale-105 active:scale-95 font-bold rounded-full bg-red-500 text-offwhite" >Delete</button>
							<button onClick={()=> {setShowDeleteRiceModal(false); setSelectedRice(null)}}  className="p-1 w-1/3 text-lg hover:scale-105 active:scale-95 font-bold rounded-full bg-blue-500 text-offwhite" >Cancel</button>
						</div>
					</section>
				</main>
			)}

			{/* Edit rice form */}
			{showEditModal && (
				<main onClick={()=> {setShowEditModal(false); setSelectedRice(null)}}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center text-white' >
					<form onSubmit={(e)=> editRice(e)} onClick={(e)=> e.stopPropagation()}  className="w-2/3 gap-5 p-6 text-neutral-900 bg-khaki grid grid-cols-2 grid-rows-[auto] rounded-2xl shadow-2xl" >
						<p className='text-2xl text-sageGreen font-bold col-span-2 place-self-center' >EDIT RICE</p>
						<img src={newImagePreview} alt="Rice Image.png" className='border-2 border-sageGreen rounded-xl row-span-8 w-full h-full' />
						<div className='w-full relative flex'>
							<label htmlFor="riceImage"  className='w-1/3 text-center text-offwhite rounded-full p-2 px-3 cursor-pointer bg-brown hover:scale-105 active:scale-95' >Upload Image</label>
							<input type="file" id="riceImage" onChange={(e)=> newImageOnChange(e)} accept='image/*'  className='hidden' />
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={newInputRice} onChange={(e)=> setNewInputRice(e.target.value)} required name="riceName" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="riceName"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all'>Rice Name</label>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={newInputCompany} onChange={(e)=> setNewInputCompany(e.target.value)} name="riceCompany" placeholder=' '  className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="riceCompany" className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:-mt-15 absolute ml-4 transition-all' >Company</label>
						</div>
						<select value={newInputCategoryName} onChange={(e) => setNewInputCategoryName(e.target.value)} name="category" className='border w-full p-2 px-3 rounded-full text-lg' >
							<option selected disabled required  className='bg-khaki text-lg' >Select Category</option>
							{categories.map((category)=> (
								<option key={category.id} value={category.name} className='bg-khaki text-lg' >{category.name}</option>
							))}
						</select>
						<div className="w-full flex items-center">
							<input type="text" value={newInputPrice} onChange={(e)=> setNewInputPrice(e.target.value)} required name="price" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="price"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all' >Price</label>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={newInputStock} onChange={(e)=> setNewInputStock(e.target.value)} required name="stock" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="stock"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all' >Stock</label>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={newInputWeight} onChange={(e)=> setNewInputWeight(e.target.value)} name="weight" placeholder=' '  className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="weight" className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:-mt-15 absolute ml-4 transition-all' >Weight in KG</label>
						</div>
						<input type="submit" className=" p-2 px-3 w-full cursor-pointer rounded-full bg-brown hover:scale-103 active:scale-95 text-offwhite font-semibold text-lg" onClick={()=> setShowAddRiceModal(false)} />
					</form>
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


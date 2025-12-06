import { Routes, Route, Navigate, useLocation, useNavigate, replace } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/login'
import SideBar from './components/sideBar'
import Dashboard from './pages/dashboard'
import Home from './pages/home'
import Admin from './pages/admin'
import Profile from './pages/profile'
import { apiPost, apiGet, apiDelete, apiPut } from './components/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import imageCompression from 'browser-image-compression'

export default function App() {
	const [showAddCategoryModal, setShowAddCategoryModal] = useState(false)
	const [showAddRiceModal, setShowAddRiceModal] = useState(false)
	const [showAddUserModal, setShowAddUserModal] = useState(false)
	const [showLogoutModal, setShowLogoutModal] = useState(false)
	const [selectedRice, setSelectedRice] = useState(null)
	const [showEditRiceModal, setShowEditRiceModal] = useState(false)
	const [showEditCategoryModal, setShowEditCategoryModal] = useState(false)
	const [showEditUserModal, setShowEditUserModal] = useState(false)
	const [showDeleteRiceModal, setShowDeleteRiceModal] = useState(false)
	const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false)
	const [selectedUser, setSelectedUser] = useState(null)
	const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
	const [refresh, setRefresh] = useState(false)
	const hideSadbarOn = ['/login', '/register', '/recoverAccount']
	const location = useLocation()
	const navigate = useNavigate()
	const options = {
		maxWidthOrHeight: 1920,
		useWebWorker: true
	}

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
	}, [loggedIn, refresh])

	// Fetch Users from server
	const [users, setUsers] = useState([])
	useEffect(()=> {
		if(loggedIn) {apiGet('/getUsers').then((data)=> setUsers(data.users))}
	}, [loggedIn, refresh])
	const totalUsers = users.length

	// Fetch rices from server
	const [rices, setRices] = useState([])
	useEffect(()=> {
		if(loggedIn) {apiGet('/getRices').then((data)=> setRices(data.rices))}
	}, [loggedIn, refresh])
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

	// Function to delete category
	const [selectedCategory, setSelectedCategory] = useState(null)
	function deleteCategory() {
		apiDelete('/deleteCategory', {selectedCategory}).then((data)=> {
			alert(data.message)
			setShowDeleteCategoryModal(false)
			setRefresh(prev => !prev)
		})
	}
	
	// New variables for editing category
	const [newInputCategory, setNewInputCategory] = useState('')
	const [categoryID, setCategoryID] = useState(null)
	useEffect(()=> {
		if(!selectedCategory) return
		setNewInputCategory(selectedCategory.name || '')
		setCategoryID(selectedCategory.id || null)
	}, [selectedCategory])

	// Function to edit category
	function editCategory() {
		apiPut('/editCategory', {newInputCategory, categoryID}).then((data)=> {
			alert(data.message)
			setShowEditCategoryModal(false)
			setRefresh(prev => !prev)
			setNewInputCategory('')
			setSelectedCategory(null)
			setCategoryID(null)
		})
	}

	// Send rice to the server
	const [inputRice, setInputRice] = useState('')
	const [inputCompany, setInputCompany] = useState('')
	const [inputCategoryName, setInputCategoryName] = useState('')
	const [inputPrice, setInputPrice] = useState('')
	const [inputStock, setInputStock] = useState('')
	const [inputWeight, setInputWeight] = useState('')
	const [imagePreview, setImagePreview] = useState(null)
	const [imageFile, setImageFile] = useState(null)
	function addRice() {
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
			setInputCategoryName(null)
			setInputPrice('')
			setInputStock('')
			setInputWeight('')
			url.revokeObjectURL(imagePreview)
			setImagePreview(null)
			setImageFile(null)
		})
	}
	// Change image file when uploaded image changed
	async function imageOnChange(e) {
		const image = e.target.files[0]
		const squaredImage = await imageCompression(image, options)
		if(squaredImage) {
			URL.revokeObjectURL(imagePreview)
			setImagePreview(URL.createObjectURL(squaredImage))
			setImageFile(squaredImage)
		}
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
		// Find category name of selected rice
		const selectedEditCategory = categories.find(c => c.id === selectedRice.categoryID)
		setNewInputCategoryName(selectedEditCategory?.name || '')
		setNewInputPrice(selectedRice.price || '')
		setNewInputStock(selectedRice.stock || '')
		setNewInputWeight(selectedRice.weightKG || '')
		setNewImagePreview(selectedRice.imagePath || '')
	}, [selectedRice])
	// Change new image file when uploaded image changed
	async function newImageOnChange(e) {
		const image = e.target.files[0]
		const squaredImage = await imageCompression(image, options)
		if(squaredImage) {
			URL.revokeObjectURL(newImagePreview)
			setNewImagePreview(URL.createObjectURL(squaredImage))
			setNewImageFile(squaredImage)
		}
	}

	// Function to edit rice
	function editRice() {
		// find category of new category name
		const selectedCategory = categories.find(c => c.name === newInputCategoryName)
		// send data to server with new rice image
		const formData = new FormData()
		formData.append('newInputRice', newInputRice || '')
		formData.append('newInputCompany', newInputCompany || '')
		formData.append('selectedCategoryID', selectedCategory.id || null)
		formData.append('newInputPrice', newInputPrice || '')
		formData.append('newInputStock', newInputStock || '')
		formData.append('newInputWeight', newInputWeight || '')
		formData.append('oldImageID', selectedRice.imagePublicID || null)
		formData.append('riceID', selectedRice.id || null)
		formData.append('newImageFile', newImageFile || null)
		apiPut('/editRice', formData).then((data)=> {
			alert(data.message)
			setRefresh(prev => !prev)
			setShowEditRiceModal(false)
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

	// Function to add user
	const [inputUserName, setInputUserName] = useState('')
	const [inputPassword, setInputPassword] = useState('')
	const [inputEmail, setInputEmail] = useState('')
	const [inputAddress, setInputAddress] = useState('')
	const [inputIsAdmin, setInputIsAdmin] = useState(false)
	const [profilePreview, setProfilePreview] = useState(null)
	const [profileFile, setProfileFile] = useState(null)
	function addUser() {
		const formData = new FormData()
		formData.append('inputUserName', inputUserName)
		formData.append('inputPassword', inputPassword)
		formData.append('inputEmail', inputEmail || '')
		formData.append('inputAddress', inputAddress || '')
		formData.append('inputIsAdmin', inputIsAdmin)
		formData.append('profileFile', profileFile || null)
		apiPost('/addUser', formData).then((data)=> {
			alert(data.message)
			setShowAddUserModal(false)
			setRefresh(prev => !prev)
			setInputUserName('')
			setInputPassword('')
			setInputEmail('')
			setInputAddress('')
			setInputIsAdmin(false)
			URL.revokeObjectURL(profilePreview)
			setProfilePreview(null)
		})
	}
	// Change profile file when uploaded profile changed
	async function profileOnChange(e) {
		const image = e.target.files[0]
		const squaredImage = await imageCompression(image, options)
		if(squaredImage) {
			URL.revokeObjectURL(profilePreview)
			setProfilePreview(URL.createObjectURL(squaredImage))
			setProfileFile(squaredImage)
		}
	}

	// Function to delete user
	function deleteUser() {
		apiDelete('/deleteUser', {selectedUser}).then((data)=> {
			alert(data.message)
			setShowDeleteUserModal(false)
			setSelectedUser(null)
			setRefresh(prev => !prev)
		})
	}
	
	// New variables for editing user
	const [newInputUserName, setNewInputUserName] = useState('')
	const [newInputPassword, setNewInputPassword] = useState('')
	const [newInputEmail, setNewInputEmail] = useState('')
	const [newInputAddress, setNewInputAddress] = useState('')
	const [newInputIsAdmin, setNewInputIsAdmin] = useState('')
	const [newProfilePreview, setNewProfilePreview] = useState(null)
	const [newProfileFile, setNewProfileFile] = useState(null)
	useEffect(()=> {
		if(!selectedUser) return
		setNewInputUserName(selectedUser.userName || '')
		setNewInputPassword(selectedUser.password || '')
		setNewInputEmail(selectedUser.email || '')
		setNewInputAddress(selectedUser.adress || '')
		setNewInputIsAdmin(selectedUser.isAdmin || false)
		setNewProfilePreview(selectedUser.imagePath || null)
	}, [selectedUser])
	// Change new profile file when uploaded profile picture changed
	async function newProfileOnChange(e) {
		const image = e.target.files[0]
		const squaredImage = await imageCompression(image, options)
		if(squaredImage) {
			URL.revokeObjectURL(newProfilePreview)
			setNewProfilePreview(URL.createObjectURL(squaredImage))
			setNewProfileFile(squaredImage)
		}
	}

	// Function to edit user
	function editUser() {
		const formData = new FormData()
		formData.append('newInputUserName', newInputUserName || '')
		formData.append('newInputPassword', newInputPassword || '')
		formData.append('newInputEmail', newInputEmail || '')
		formData.append('newInputAddress', newInputAddress || '')
		formData.append('newInputIsAdmin', newInputIsAdmin || false)
		formData.append('oldProfileID', selectedUser.imagePublicID || null)
		formData.append('userID', selectedUser.id || null)
		formData.append('newProfileFile', newProfileFile || null)
		apiPut('/editUser', formData).then((data)=> {
			alert(data.message)
			setRefresh(prev => !prev)
			setShowEditUserModal(false)
			setNewInputUserName('')
			setNewInputPassword('')
			setNewInputEmail('')
			setNewInputAddress('')
			setNewInputIsAdmin(false)
			setNewProfileFile(null)
			setSelectedUser(null)
			URL.revokeObjectURL(newProfilePreview)
			setNewProfilePreview(null)
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
						setShowAddUserModal={setShowAddUserModal}
						setShowDeleteRiceModal={setShowDeleteRiceModal}
						setShowEditRiceModal={setShowEditRiceModal}
						setShowEditCategoryModal={setShowEditCategoryModal}
						setShowEditUserModal={setShowEditUserModal}
						setShowDeleteCategoryModal={setShowDeleteCategoryModal}
						setShowDeleteUserModal={setShowDeleteUserModal}
						setSelectedRice={setSelectedRice}
						setSelectedCategory={setSelectedCategory}
						setSelectedUser={setSelectedUser}
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
						<p  className='text-2xl text-sageGreen font-bold' >DELETE CATEGORY</p>
						<p className='text-6xl text-sageGreen font-semibold' >{selectedCategory.name}</p>
						<div className='w-full flex justify-around items-center'>
							<button onClick={()=> deleteCategory()}  className="p-1 w-1/3 text-lg hover:scale-105 active:scale-95 font-bold rounded-3xl bg-red-500 text-offwhite" >Delete</button>
							<button onClick={()=> {setShowDeleteCategoryModal(false); setSelectedCategory(null)}}  className="p-1 w-1/3 text-lg hover:scale-105 active:scale-95 font-bold rounded-3xl bg-blue-500 text-offwhite" >Cancel</button>
						</div>
					</section>
				</main>
			)}

			{/* Edit category form */}
			{showEditCategoryModal && (
				<main onClick={()=> {setShowEditCategoryModal(false); setSelectedCategory(null)}}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center' >
					<form onSubmit={(e)=> {editCategory(); e.preventDefault()}} onClick={(e)=> e.stopPropagation()}  className="w-1/3 p-6 gap-5 bg-khaki flex flex-col rounded-2xl items-center shadow-2xl">
						<p className='text-2xl text-sageGreen font-bold' >EDIT CATEGORY</p>
						<div className="w-full flex items-center">
							<input type="text" value={newInputCategory} onChange={(e)=> setNewInputCategory(e.target.value)} required  className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="inputCategory"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all' >Category Name</label>
						</div>
						<input type="submit" className=" p-2 px-3 w-full cursor-pointer rounded-full bg-brown hover:scale-105 active:scale-95 text-offwhite font-semibold" />
					</form>
				</main>
			)}

			{/* Rice add form */}
			{showAddRiceModal && (
				<main onClick={()=> setShowAddRiceModal(false)}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center text-white' >
					<form onSubmit={(e)=> {addRice(); e.preventDefault()}} onClick={(e)=> e.stopPropagation()}  className="w-2/3 gap-5 p-6 text-neutral-900 bg-khaki grid grid-cols-2 grid-rows-[auto] rounded-2xl shadow-2xl" >
						<p className='text-2xl text-sageGreen font-bold col-span-2 place-self-center' >ADD RICE</p>
						<div className='border-2 border-sageGreen rounded-xl row-span-8 w-full h-full' >{imagePreview ? (
							<img src={imagePreview} alt="Rice Image.png" className='w-full h-full rounded-xl' />
							) : (<p className='flex justify-center items-center w-full h-full text-sageGreen opacity-50 text-4xl' >No Image Selected</p>)}
						</div>
						<div className='w-full relative flex'>
							<label htmlFor="riceImage"  className='w-1/3 text-center text-offwhite rounded-full p-2 px-3 cursor-pointer bg-brown hover:scale-105 active:scale-95' >Upload Image</label>
							<input type="file" id="riceImage" onChange={(e)=> imageOnChange(e)} accept='image/*' required  className='hidden' />
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

			{/* Delete rice confirmation */}
			{showDeleteRiceModal && (
				<main onClick={()=> {setShowDeleteRiceModal(false); setSelectedRice(null)}}  className='absolute top-0 left-0 w-full h-full bg-gray-950/70 flex justify-center items-center text-neutral-900' >
					<section onClick={(e)=> e.stopPropagation()}  className="p-10 gap-10 justify-center relative bg-khaki flex flex-col rounded-2xl items-center shadow-2xl" >
						<p  className='text-2xl text-sageGreen font-bold' >DELETE RICE</p>
						<p className='text-6xl text-sageGreen font-semibold' >{selectedRice.name}</p>
						<p className='text-sageGreen text-3xl -mt-10'>{selectedRice.company}</p>
						<div className='w-full flex justify-around items-center'>
							<button onClick={()=> deleteRice()}  className="p-1 w-1/3 text-lg hover:scale-105 active:scale-95 font-bold rounded-full bg-red-500 text-offwhite" >Delete</button>
							<button onClick={()=> {setShowDeleteRiceModal(false); setSelectedRice(null)}}  className="p-1 w-1/3 text-lg hover:scale-105 active:scale-95 font-bold rounded-full bg-blue-500 text-offwhite" >Cancel</button>
						</div>
					</section>
				</main>
			)}

			{/* Edit rice form */}
			{showEditRiceModal && (
				<main onClick={()=> {setShowEditRiceModal(false); setSelectedRice(null)}}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center text-white' >
					<form onSubmit={(e)=> {editRice(); e.preventDefault()}} onClick={(e)=> e.stopPropagation()}  className="w-2/3 gap-5 p-6 text-neutral-900 bg-khaki grid grid-cols-2 grid-rows-[auto] rounded-2xl shadow-2xl" >
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
						<input type="submit" className=" p-2 px-3 w-full cursor-pointer rounded-full bg-brown hover:scale-103 active:scale-95 text-offwhite font-semibold text-lg" />
					</form>
				</main>
			)}

			{/* Add user form */}
			{showAddUserModal && (
				<main onClick={()=> setShowAddUserModal(false)}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center text-white' >
					<form onSubmit={(e)=> {addUser(); e.preventDefault()}} onClick={(e)=> e.stopPropagation()}  className="w-2/3 gap-5 p-6 text-neutral-900 bg-khaki grid grid-cols-2 grid-rows-[auto] rounded-2xl shadow-2xl" >
						<p className='text-2xl text-sageGreen font-bold col-span-2 place-self-center' >ADD USER</p>
						<div className='border-2 border-sageGreen rounded-full row-span-8 w-full h-full' >
							{profilePreview ? (
								<img src={profilePreview} alt="User Image.png" className='w-full h-full rounded-full' />
								) : (<p className='flex justify-center items-center w-full h-full text-sageGreen opacity-50 text-4xl' >No image Selected</p>)
							}
						</div>
						<div className='w-full relative flex'>
							<label htmlFor="userImage"  className='w-1/3 text-center text-offwhite rounded-full p-2 px-3 cursor-pointer bg-brown hover:scale-105 active:scale-95' >Upload Image</label>
							<input type="file" id="userImage" onChange={(e)=> profileOnChange(e)} accept='image/*'  className='hidden' />
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={inputUserName} onChange={(e)=> setInputUserName(e.target.value)} required name="userName" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="userName"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all' >Username</label>
						</div>
						<div className="w-full flex items-center">
							<input type="password" value={inputPassword} onChange={(e)=> setInputPassword(e.target.value)} required name="userPassword"  className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="userPassword" className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-valid:text-xs peer-valid:-mt-15 absolute ml-4 transition-all' >Password</label>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={inputEmail} onChange={(e)=> setInputEmail(e.target.value)} placeholder='' name="email" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="email"  className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-mt-15 absolute ml-4 transition-all' >Email</label>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={inputAddress} onChange={(e)=> setInputAddress(e.target.value)} placeholder='' name="address" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="address"  className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[:not(:placeholder-shown):valid]:text-xs peer-[:not(:placeholder-shown):valid]:-mt-15 absolute ml-4 transition-all' >Address</label>
						</div>
						<div className='w-full flex items-center'>
							<input type="checkbox" checked={inputIsAdmin} onChange={(e)=> setInputIsAdmin(e.target.checked)} id="isAdmin" className='scale-150 ml-1 mr-2 cursor-pointer active:scale-130' />
							<label htmlFor="isAdmin" className='text-lg select-none' >Admin</label>
						</div>
						<input type="submit" className=" p-2 px-3 w-full cursor-pointer rounded-full bg-brown hover:scale-103 active:scale-95 text-offwhite font-semibold text-lg" />
					</form>
				</main>
			)}

			{/* Delete user confirmation */}
			{showDeleteUserModal && (
				<main onClick={()=> {setShowDeleteUserModal(false); setSelectedUser(null)}}  className='absolute top-0 left-0 w-full h-full bg-gray-950/70 flex justify-center items-center text-neutral-900' >
					<section onClick={(e)=> e.stopPropagation()}  className="p-10 gap-10 min-w-1/4 justify-center relative bg-khaki flex flex-col rounded-2xl items-center shadow-2xl" >
						<p  className='text-2xl text-sageGreen font-bold' >DELETE USER</p>
						<p className='text-6xl text-sageGreen font-semibold' >{selectedUser.userName}</p>
						<p className='text-3xl text-sageGreen -mt-10' >{selectedUser.isAdmin === true ? 'Admin' : 'Customer'}</p>
						<div className='w-full flex justify-around items-center'>
							<button onClick={()=> deleteUser()}  className="p-1 w-1/3 text-lg hover:scale-105 active:scale-95 font-bold rounded-3xl bg-red-500 text-offwhite" >Delete</button>
							<button onClick={()=> setShowDeleteUserModal(false)}  className="p-1 w-1/3 text-lg hover:scale-105 active:scale-95 font-bold rounded-3xl bg-blue-500 text-offwhite" >Cancel</button>
						</div>
					</section>
				</main>
			)}

			{/* Edit user form */}
			{showEditUserModal && (
				<main onClick={()=> {setShowEditUserModal(false); setSelectedUser(null)}}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center text-white' >
					<form onSubmit={(e)=> {editUser(); e.preventDefault()}} onClick={(e)=> e.stopPropagation()}  className="w-2/3 gap-5 p-6 text-neutral-900 bg-khaki grid grid-cols-2 grid-rows-[auto] rounded-2xl shadow-2xl" >
						<p className='text-2xl text-sageGreen font-bold col-span-2 place-self-center' >EDIT USER</p>
						<div className='border-2 border-sageGreen rounded-full row-span-8 w-full h-full relative select-none' >
							{newProfilePreview ? (
								<>
								<img src={newProfilePreview} alt="User Image.png" className='w-full h-full rounded-full' />
								<FontAwesomeIcon icon={faCircleXmark} className='text-3xl  text-sageGreen top-[7%] absolute right-[7%] cursor-pointer active:scale-90' />
								</>
								) : (<p className='flex justify-center items-center w-full h-full text-sageGreen opacity-50 text-4xl' >No image uploaded</p>)
							}
						</div>
						<div className='w-full relative flex'>
							<label htmlFor="userImage"  className='w-1/3 text-center text-offwhite rounded-full p-2 px-3 cursor-pointer bg-brown hover:scale-105 active:scale-95' >Upload Image</label>
							<input type="file" id="userImage" onChange={(e)=> newProfileOnChange(e)} accept='image/*'  className='hidden' />
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={newInputUserName} onChange={(e)=> setNewInputUserName(e.target.value)} required name="userName" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="userName"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all' >Username</label>
						</div>
						<div className="w-full flex items-center">
							<input type="password" value={newInputPassword} onChange={(e)=> setNewInputPassword(e.target.value)} required name="userPassword"  className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="userPassword" className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-valid:text-xs peer-valid:-mt-15 absolute ml-4 transition-all' >Password</label>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={newInputEmail} onChange={(e)=> setNewInputEmail(e.target.value)} placeholder='' name="email" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="email"  className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-mt-15 absolute ml-4 transition-all' >Email</label>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={newInputAddress} onChange={(e)=> setNewInputAddress(e.target.value)} placeholder='' name="address" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="address"  className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[:not(:placeholder-shown):valid]:text-xs peer-[:not(:placeholder-shown):valid]:-mt-15 absolute ml-4 transition-all' >Address</label>
						</div>
						<div className='w-full flex items-center'>
							<input type="checkbox" checked={newInputIsAdmin} onChange={(e)=> setNewInputIsAdmin(e.target.checked)} id="isAdmin" className='scale-150 ml-1 mr-2 cursor-pointer active:scale-130' />
							<label htmlFor="isAdmin" className='text-lg select-none' >Admin</label>
						</div>
						<input type="submit" className=" p-2 px-3 w-full cursor-pointer rounded-full bg-brown hover:scale-103 active:scale-95 text-offwhite font-semibold text-lg" />
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


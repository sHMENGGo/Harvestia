import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Login from './pages/login'
import SideBar from './components/sideBar'
import Home from './pages/home'
import Admin from './pages/admin'
import Profile from './pages/profile'
import Checkout from './pages/checkout'
import RiceInfo from './pages/riceInfo'
import { apiPost, apiGet, apiDelete, apiPut } from './components/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons'
import imageCompression from 'browser-image-compression'
import toast, { Toaster } from 'react-hot-toast'

export default function App() {
	const [show_add_category_modal, set_show_add_category_modal] = useState(false)
	const [show_add_rice_modal, set_show_add_rice_modal] = useState(false)
	const [show_add_user_modal, set_show_add_user_modal] = useState(false)
	const [show_logout_modal, set_show_logout_modal] = useState(false)
	const [selected_rice, set_selected_rice] = useState(null)
	const [show_edit_rice_modal, set_show_edit_rice_modal] = useState(false)
	const [show_edit_category_modal, set_show_edit_category_modal] = useState(false)
	const [show_edit_user_modal, set_show_edit_user_modal] = useState(false)
	const [show_delete_rice_modal, set_show_delete_rice_modal] = useState(false)
	const [show_delete_category_modal, set_show_delete_category_modal] = useState(false)
	const [selected_user, set_selected_user] = useState(null)
	const [show_delete_user_modal, set_show_delete_user_modal] = useState(false)
	const [refresh, set_refresh] = useState(false)
	const hide_sidebar_on = ['/login', '/register', '/recoverAccount']
	const location = useLocation()
	const navigate = useNavigate()
	const options = {
		maxWidthOrHeight: 1920,
		useWebWorker: true
	}

	// Set value to sidebar and value to home
	const [show_category, set_show_category] = useState(0)

	// Check if theres's existing token
	const [user, set_user] = useState(null)
	const [is_loading, set_is_loading] = useState(true)
	const [valid_login, set_valid_login] = useState(false)
	useEffect(()=> {
		const checkToken = async ()=> {
			try {
				console.log("Checking token...")
				const data = await apiGet('/verifyToken')
				if(data.user) {
					set_valid_login(true)
					set_user(data.user)
					console.log(data.message)
					toast.success('Welcome back ' + data.user.username + '!')
				}
				else {
					set_valid_login(false)
					console.log("No user found.")
				}
			} catch(err) {
				console.error('Checking token failed ', err)
				set_valid_login(false)
			} finally {set_is_loading(false)}
		}
		checkToken()
	}, [valid_login])

	// Redirect to login page if there's no token
	const [prev_location, set_prev_location] = useState(useLocation())
	useEffect(()=> {
		if(valid_login === true) {
			if(prev_location.pathname === '/login' || prev_location.pathname === '/riceInfo' || prev_location.pathname === '/register' || prev_location.pathname === '/recoverAccount') {navigate('/home', {replace:true})}
			else {navigate(prev_location, {replace:true}); set_prev_location(prev => prev)}}
		else {navigate('/login', {replace:true})}
	}, [valid_login])

	// Fetch categories from the server
	const [categories, set_categories] = useState([])
	useEffect(()=> {
		if(valid_login) {apiGet('/getCategories').then((data)=> {set_categories(data.categories)})}
	}, [valid_login, refresh])

	// Fetch Users from server
	const [users, set_users] = useState([])
	useEffect(()=> {
		if(valid_login) {apiGet('/getUsers').then((data)=> set_users(data.users))}
	}, [valid_login, refresh])
	const total_users = users?.length || 0

	// Fetch rices from server
	const [rices, set_rices] = useState([])
	useEffect(()=> {
		if(valid_login) {apiGet('/getRices').then((data)=> set_rices(data.rices ? data.rices : []))}
	}, [valid_login, refresh])
	const total_rices = rices.length || 0
	console.log(rices)

	// Send category to the server
	const [input_category, set_input_category] = useState('')
	function add_category() {
		apiPost('/addCategory', {input_category: input_category}).then((data)=> {
			toast(data.message)
			set_input_category('')
			set_show_add_category_modal(false)
			set_refresh(prev => !prev)
		})
	}

	// Function to delete category
	const [selected_category, set_selected_category] = useState(null)
	function deleteCategory() {
		apiDelete('/deleteCategory', {selected_category: selected_category}).then((data)=> {
			toast(data.message)
			set_show_delete_category_modal(false)
			set_refresh(prev => !prev)
		})
	}
	
	// New variables for editing category
	const [new_input_category, set_new_input_category] = useState('')
	const [category_id, set_category_id] = useState(null)
	useEffect(()=> {
		if(!selected_category) return
		set_new_input_category(selected_category.name || '')
		set_category_id(selected_category.id || null)
	}, [selected_category])

	// Function to edit category
	function editCategory() {
		apiPut('/editCategory', {new_input_category: new_input_category, category_id: category_id}).then((data)=> {
			toast(data.message)
			set_show_edit_category_modal(false)
			set_refresh(prev => !prev)
			set_new_input_category('')
			set_selected_category(null)
			set_category_id(null)
		})
	}

	// Send rice to the server
	const [input_rice, set_input_rice] = useState('')
	const [input_company, set_input_company] = useState('')
	const [input_category_name, set_input_category_name] = useState('')
	const [input_price, set_input_price] = useState('')
	const [input_stock, set_input_stock] = useState('')
	const [input_kg25, set_input_kg25] = useState(false)
	const [input_kg50, set_input_kg50] = useState(false)
	const [input_weight, set_input_weight] = useState('')
	const [input_description, set_input_description] = useState('')
	const [image_preview, set_image_preview] = useState(null)
	const [image_file, set_image_file] = useState(null)
	function add_rice() {
		// find category id of input category name
		const category = categories.find(c => c.name === input_category_name)
		const selected_category_id = category ? category.id : null
		// send data to server with new rice image
		const formData = new FormData()
		formData.append('input_rice', input_rice)
		formData.append('input_company', input_company)
		formData.append('input_category_id', selected_category_id)
		formData.append('input_price', input_price)
		formData.append('input_stock', input_stock)
		formData.append('input_kg25', input_kg25)
		formData.append('input_kg50', input_kg50)
		formData.append('input_weight', input_weight)
		formData.append('input_description', input_description)
		formData.append('image_file', image_file)
		apiPost('/addRice', formData).then((data)=> {
			toast(data.message)
			set_show_add_rice_modal(false)
			set_refresh(prev => !prev)
			set_input_rice('')
			set_input_company('')
			set_input_category_name(null)
			set_input_price('')
			set_input_stock('')
			set_input_kg25(false)
			set_input_kg50(false)
			set_input_weight('')
			set_input_description('')
			URL.revokeObjectURL(image_preview)
			set_image_preview(null)
			set_image_file(null)
		})
	}
	// Change image file when uploaded image changed
	async function image_on_change(e) {
		const image = e.target.files[0]
		const squaredImage = await imageCompression(image, options)
		if(squaredImage) {
			URL.revokeObjectURL(image_preview)
			set_image_preview(URL.createObjectURL(squaredImage))
			set_image_file(squaredImage)
		}
		else set_image_file(null)
	}

	// Function to delete rice
	function delete_rice() {
		apiDelete('/deleteRice', {selected_rice: selected_rice}).then((data)=> {
			toast(data.message)
			set_show_delete_rice_modal(false)
			set_refresh(prev => !prev)
		})
	}

	// New variables for editing rice
	const [new_input_rice, set_new_input_rice] = useState('')
	const [new_input_company, set_new_input_company] = useState('')
	const [new_input_category_name, set_new_input_category_name] = useState('')
	const [new_input_price, set_new_input_price] = useState('')
	const [new_input_stock, set_new_input_stock] = useState('')
	const [new_input_25kg, set_new_input_25kg] = useState(false)
	const [new_input_50kg, set_new_input_50kg] = useState(false)
	const [new_input_weight, set_new_input_weight] = useState('')
	const [new_input_description, set_new_input_description] = useState('')
	const [new_image_preview, set_new_image_preview] = useState(null)
	const [new_image_file, set_new_image_file] = useState(null)
	useEffect(()=> {
		if(!selected_rice) return
		set_new_input_rice(selected_rice.name || '')
		set_new_input_company(selected_rice.company || '')
		// Find category name of selected rice
		const selected_edit_category = categories.find(c => c.id === selected_rice.category_id)
		set_new_input_category_name(selected_edit_category?.name || '')
		set_new_input_price(selected_rice.price || '')
		set_new_input_stock(selected_rice.stock || '')
		set_new_input_25kg(selected_rice.is_25kg || false)
		set_new_input_50kg(selected_rice.is_50kg || false)
		set_new_input_weight(selected_rice.weight_kg || '')
		set_new_input_description(selected_rice.description || '')
		set_new_image_preview(selected_rice.image_path || '')
	}, [selected_rice])
	// Change new image file when uploaded image changed
	async function new_image_on_change(e) {
		const image = e.target.files[0]
		const squaredImage = await imageCompression(image, options)
		if(squaredImage) {
			URL.revokeObjectURL(new_image_preview)
			set_new_image_preview(URL.createObjectURL(squaredImage))
			set_new_image_file(squaredImage)
		}
	}

	// Function to edit rice
	function edit_rice() {
		// find category of new category name
		const selected_category = categories.find(c => c.name === new_input_category_name)
		// send data to server with new rice image
		const formData = new FormData()
		formData.append('new_input_rice', new_input_rice || '')
		formData.append('new_input_company', new_input_company || '')
		formData.append('selected_category_id', selected_category ? selected_category.id : null)
		formData.append('new_input_price', new_input_price || '')
		formData.append('new_input_stock', new_input_stock || '')
		formData.append('new_input_25kg', new_input_25kg || false)
		formData.append('new_input_50kg', new_input_50kg || false)
		formData.append('new_input_weight', new_input_weight || '')
		formData.append('new_input_description', new_input_description || '')
		formData.append('old_image_id', selected_rice.image_public_id || null)
		formData.append('rice_id', selected_rice.id || null)
		formData.append('new_image_file', new_image_file || null)
		apiPut('/editRice', formData).then((data)=> {
			toast(data.message)
			set_refresh(prev => !prev)
			set_show_edit_rice_modal(false)
			set_new_input_rice('')
			set_new_input_company('')
			set_new_input_category_name('')
			set_new_input_price('')
			set_new_input_stock('')
			set_new_input_25kg(false)
			set_new_input_50kg(false)
			set_new_input_weight('')
			set_new_input_description('')
			set_new_image_file(null)
			set_selected_rice(null)
			URL.revokeObjectURL(new_image_preview)
			set_new_image_preview(null)
		})
	}

	// Function to add user
	const [input_username, set_input_username] = useState('')
	const [input_password, set_input_password] = useState('')
	const [input_email, set_input_email] = useState('')
	const [input_address, set_input_address] = useState('')
	const [input_is_admin, set_input_is_admin] = useState(false)
	const [profile_preview, set_profile_preview] = useState(null)
	const [profile_file, set_profile_file] = useState(null)
	function add_user() {
		const formData = new FormData()
		formData.append('input_username', input_username)
		formData.append('input_password', input_password)
		formData.append('input_email', input_email || '')
		formData.append('input_address', input_address || '')
		formData.append('input_is_admin', input_is_admin)
		formData.append('profile_file', profile_file || null)
		apiPost('/addUser', formData).then((data)=> {
			toast(data.message)
			set_show_add_user_modal(false)
			set_refresh(prev => !prev)
			set_input_username('')
			set_input_password('')
			set_input_email('')
			set_input_address('')
			set_input_is_admin(false)
			URL.revokeObjectURL(profile_preview)
			set_profile_preview(null)
		})
	}
	// Change profile file when uploaded profile changed
	async function profile_on_change(e) {
		const image = e.target.files[0]
		const squaredImage = await imageCompression(image, options)
		if(squaredImage) {
			URL.revokeObjectURL(profile_preview)
			set_profile_preview(URL.createObjectURL(squaredImage))
			set_profile_file(squaredImage)
		}
	}

	// Function to delete user
	function delete_user() {
		apiDelete('/deleteUser', {selected_user: selected_user}).then((data)=> {
			toast(data.message)
			set_show_delete_user_modal(false)
			set_selected_user(null)
			set_refresh(prev => !prev)
		})
	}
	
	// New variables for editing user
	const [new_input_username, set_new_input_username] = useState('')
	const [new_input_password, set_new_input_password] = useState('')
	const [new_input_email, set_new_input_email] = useState('')
	const [new_input_address, set_new_input_address] = useState('')
	const [new_input_is_admin, set_new_input_is_admin] = useState('')
	const [new_profile_preview, set_new_profile_preview] = useState(null)
	const [new_profile_file, set_new_profile_file] = useState(null)
	useEffect(()=> {
		if(!selected_user) return
		set_new_input_username(selected_user.username || '')
		set_new_input_password(selected_user.password || '')
		set_new_input_email(selected_user.email || '')
		set_new_input_address(selected_user.address || '')
		set_new_input_is_admin(selected_user.is_admin || false)
		set_new_profile_preview(selected_user.image_path || null)
	}, [selected_user])
	// Change new profile file when uploaded profile picture changed
	async function new_profile_on_change(e) {
		const image = e.target.files[0]
		const squaredImage = await imageCompression(image, options)
		if(squaredImage) {
			URL.revokeObjectURL(new_profile_preview)
			set_new_profile_preview(URL.createObjectURL(squaredImage))
			set_new_profile_file(squaredImage)
		}
	}

	// Function to edit user
	function editUser() {
		const formData = new FormData()
		formData.append('new_input_username', new_input_username || '')
		formData.append('new_input_password', new_input_password || '')
		formData.append('new_input_email', new_input_email || '')
		formData.append('new_input_address', new_input_address || '')
		formData.append('new_input_is_admin', new_input_is_admin || false)
		formData.append('old_profile_id', selected_user.image_public_id || null)
		formData.append('user_id', selected_user.id || null)
		formData.append('new_profile_file', new_profile_file || null)
		apiPut('/editUser', formData).then((data)=> {
			toast(data.message)
			set_refresh(prev => !prev)
			set_show_edit_user_modal(false)
			set_new_input_username('')
			set_new_input_password('')
			set_new_input_email('')
			set_new_input_address('')
			set_new_input_is_admin(false)
			set_new_profile_file(null)
			set_selected_user(null)
			URL.revokeObjectURL(new_profile_preview)
			set_new_profile_preview(null)
		})
	}

	// Prevent app to render if there's no user, wait for token checking
	if(is_loading) return <div className="w-full top-0 flex justify-center items-center absolute h-full family-roboto"><p className='text-9xl opacity-50'>Loading...</p></div>

	// Logout function
	function logout() {
		set_valid_login(false)
		set_show_logout_modal(false)
		apiGet('/logout')
		navigate('/login', {replace:true})
		toast.success('Logged out successfully!')
		set_prev_location(location)
	}

   return(
		<main className="flex w-full family-roboto absolute justify-center items-center top-0 text-neutral-800 bg-[url('./assets/rice_BG.jpg')] bg-center bg-cover">
			<section className="w-[80%] left-[10%] h-screen overflow-auto relative text-neutral-900">
				<Routes>
					<Route path='/' element={<Navigate to={valid_login ? '/home' : '/login'} replace />} />
					<Route path='/login' element={<Login set_valid_login={set_valid_login} valid_login={valid_login} />}/>
					<Route path='/register' element={<Navigate to='/login'/>}/>
					<Route path='/recoverAccount' element={<Navigate to='/login'/>}/>
					<Route path='/checkout' element={<Checkout />}/>
					<Route path='/riceInfo' element={<RiceInfo selected_rice={selected_rice} />}/>
					<Route path='/profile' element={<Profile user={user} set_show_logout_modal={set_show_logout_modal} options={options} set_refresh={set_refresh} />}/>
					<Route path='/home' element={<Home 
						show_category={show_category} 
						categories={categories}
						rices={rices}
						set_selected_rice={set_selected_rice}
					/>} />
					<Route path='/admin' element={<Admin 
						set_show_add_category_modal={set_show_add_category_modal} 
						set_show_add_rice_modal={set_show_add_rice_modal} 
						set_show_add_user_modal={set_show_add_user_modal}
						set_show_delete_rice_modal={set_show_delete_rice_modal}
						set_show_edit_rice_modal={set_show_edit_rice_modal}
						set_show_edit_category_modal={set_show_edit_category_modal}
						set_show_edit_user_modal={set_show_edit_user_modal}
						set_show_delete_category_modal={set_show_delete_category_modal}
						set_show_delete_user_modal={set_show_delete_user_modal}
						set_selected_rice={set_selected_rice}
						set_selected_category={set_selected_category}
						set_selected_user={set_selected_user}
						users={users}
						categories={categories}
						total_users={total_users}
						rices={rices}
						total_rices={total_rices}
					/>}/>
				</Routes>
				<Toaster toastOptions={{
					duration: 1500,
					style: {
						background: '#af4c0f',
						color: '#FFFFFF',
						fontWeight: 'bold',
					}
				}}/>
			</section>

			{/* Show sidebar but not in login */}
			{!hide_sidebar_on.includes(location.pathname) && <SideBar 
				set_show_category={set_show_category} 
				categories={categories}
				user={user}
				refresh={refresh} 
			/>} 

			{/* Category add form */}
			{show_add_category_modal && (
				<main onClick={()=> set_show_add_category_modal(false)}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center' >
					<form onSubmit={(e)=> {add_category(); e.preventDefault()}} onClick={(e)=> e.stopPropagation()}  className="w-1/3 p-6 gap-5 bg-khaki flex flex-col rounded-2xl items-center shadow-2xl">
						<p className='text-2xl text-sageGreen font-bold' >ADD NEW CATEGORY</p>
						<div className="w-full flex items-center">
							<input type="text" value={input_category} onChange={(e)=> set_input_category(e.target.value)} required name="inputCategory" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="inputCategory"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all pointer-events-none' >Category Name</label>
						</div>
						<input type="submit" className=" p-2 px-3 w-full cursor-pointer rounded-full bg-brown text-offwhite font-semibold" />
					</form>
				</main>
			)}

			{/* Delete category confirmation */}
			{show_delete_category_modal && (
				<main onClick={()=> {set_show_delete_category_modal(false); set_selected_category(null)}}  className='absolute top-0 left-0 w-full h-full bg-gray-950/70 flex justify-center items-center text-neutral-900' >
					<section onClick={(e)=> e.stopPropagation()}  className="p-10 gap-10 justify-center relative bg-khaki flex flex-col rounded-2xl items-center shadow-2xl" >
						<p  className='text-2xl text-sageGreen font-bold' >DELETE CATEGORY</p>
						<p className='text-6xl text-sageGreen font-semibold' >{selected_category.name}</p>
						<div className='w-full flex justify-around items-center'>
							<button onClick={()=> deleteCategory()}  className="p-1 w-1/3 text-lg font-bold rounded-3xl bg-red-500 text-offwhite" >Delete</button>
							<button onClick={()=> {set_show_delete_category_modal(false); set_selected_category(null)}}  className="p-1 w-1/3 text-lg font-bold rounded-3xl bg-blue-500 text-offwhite" >Cancel</button>
						</div>
					</section>
				</main>
			)}

			{/* Edit category form */}
			{show_edit_category_modal && (
				<main onClick={()=> {set_show_edit_category_modal(false); set_selected_category(null)}}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center' >
					<form onSubmit={(e)=> {editCategory(); e.preventDefault()}} onClick={(e)=> e.stopPropagation()}  className="w-1/3 p-6 gap-5 bg-khaki flex flex-col rounded-2xl items-center shadow-2xl">
						<p className='text-2xl text-sageGreen font-bold' >EDIT CATEGORY</p>
						<div className="w-full flex items-center">
							<input type="text" value={new_input_category} onChange={(e)=> set_new_input_category(e.target.value)} required  className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="inputCategory"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all' >Category Name</label>
						</div>
						<input type="submit" className=" p-2 px-3 w-full rounded-full bg-brown text-offwhite font-semibold" />
					</form>
				</main>
			)}

			{/* Rice add form */}
			{show_add_rice_modal && (
				<main onClick={()=> set_show_add_rice_modal(false)}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center text-white' >
					<form onSubmit={(e)=> {add_rice(); e.preventDefault()}} onClick={(e)=> e.stopPropagation()}  className="w-2/3 gap-5 p-6 text-neutral-900 bg-khaki flex flex-col justify-center rounded-2xl shadow-2xl" >
						<p className='text-2xl text-sageGreen font-bold place-self-center' >ADD RICE</p>
						<section className='w-full flex relative gap-4'>
							{/* Image container (left side) */}
							<div className='w-full relative flex flex-col gap-4 justify-center'>
								<div className='border-2 border-sageGreen rounded-xl w-full h-full' >{image_preview ? (
									<img src={image_preview} alt="Rice Image.png" className='w-full h-full rounded-xl' />
									) : (<p className='flex justify-center items-center w-full h-full text-sageGreen opacity-50 text-4xl' >No Image Selected</p>)}
								</div>
								<div className='relative flex place-self-center '>
									<label htmlFor="riceImage"  className='text-center text-offwhite rounded-full p-2 px-3 cursor-pointer bg-brown hover:scale-103 active:scale-100' >Upload Image *</label>
									<input type="file" id="riceImage" onChange={(e)=> image_on_change(e)} accept='image/*' required  className='hidden' />
								</div>
							</div>
							{/* Input fields (right side) */}
							<div className='w-full flex flex-col gap-5 overflow-auto h-100 no-scrollbar'>
								<div className="w-full flex items-center relative">
									<input type="text" value={input_rice} onChange={(e)=> set_input_rice(e.target.value)} required name="riceName" className="peer flex-1 border rounded-3xl p-2 px-3" />
									<label htmlFor="riceName"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all pointer-events-none'>Rice Name *</label>
								</div>
								<div className="w-full flex items-center relative">
									<input type="text" value={input_company} onChange={(e)=> set_input_company(e.target.value)} name="riceCompany" placeholder=' '  className="peer flex-1 border rounded-3xl p-2 px-3" />
									<label htmlFor="riceCompany" className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:-mt-15 absolute ml-4 transition-all pointer-events-none' >Company</label>
								</div>
								<select onChange={(e) => set_input_category_name(e.target.value)} name="category" className='border w-full p-2 px-3 rounded-full text-lg' >
									<option selected disabled required  className='bg-khaki text-lg' >Select Category *</option>
									{categories.map((category)=> (
										<option key={category.id} value={category.name} className='bg-khaki text-lg' >{category.name}</option>
									))}
								</select>
								<div className="w-full flex items-center relative">
									<input type="text" value={input_price} onChange={(e)=> set_input_price(e.target.value)} required name="price" className="peer flex-1 border rounded-3xl p-2 px-3" />
									<label htmlFor="price"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all pointer-events-none' >Price *</label>
								</div>
								<div className="w-full flex items-center relative">
									<input type="text" value={input_stock} onChange={(e)=> set_input_stock(e.target.value)} required name="stock" className="peer flex-1 border rounded-3xl p-2 px-3" />
									<label htmlFor="stock"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all pointer-events-none' >Stock *</label>
								</div>
								<div className='w-full flex items-center' >
									<input type="checkbox" checked={input_kg25} onChange={(e)=> set_input_kg25(e.target.checked)} id='25kg' className='scale-120 ml-1' />
									<label htmlFor="25kg" className='text-lg ml-1' >25KG</label>
									<input type="checkbox" checked={input_kg50} onChange={(e)=> set_input_kg50(e.target.checked)} id='50kg' className='scale-120 ml-4' />
									<label htmlFor="50kg" className='ml-1 mr-4 text-lg' >50KG</label>
									<div className="w-full flex items-center relative">
										<input type="text" value={input_weight} onChange={(e)=> set_input_weight(e.target.value)} name="weight" placeholder=' '  className="peer flex-1 border rounded-3xl p-2 px-3" />
										<label htmlFor="weight" className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:-mt-15 absolute ml-4 transition-all pointer-events-none' >Custom weight in KG</label>
									</div>
								</div>
								<div className="w-full flex items-center relative">
									<textarea value={input_description} onChange={(e)=> set_input_description(e.target.value)} placeholder='' id="description" className="peer flex-1 border rounded-lg p-2 h-55" />
									<label htmlFor="description"  className='text-lg select-none peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:-mt-13 peer-focus:text-xs peer-focus:-mt-13 absolute ml-2 mb-46 transition-all pointer-events-none' >Description</label>
								</div>
								<input type="submit" className=" p-2 px-3 w-full rounded-full bg-brown text-offwhite font-semibold text-lg" />
							</div>
						</section>
					</form>
				</main>
			)}

			{/* Delete rice confirmation */}
			{show_delete_rice_modal && (
				<main onClick={()=> {set_show_delete_rice_modal(false); set_selected_rice(null)}}  className='absolute top-0 left-0 w-full h-full bg-gray-950/70 flex justify-center items-center text-neutral-900' >
					<section onClick={(e)=> e.stopPropagation()}  className="p-10 gap-10 justify-center relative bg-khaki flex flex-col rounded-2xl items-center shadow-2xl" >
						<p  className='text-2xl text-sageGreen font-bold' >DELETE RICE</p>
						<p className='text-6xl text-sageGreen font-semibold' >{selected_rice.name}</p>
						<p className='text-sageGreen text-3xl -mt-10'>{selected_rice.company}</p>
						<div className='w-full flex justify-around items-center'>
							<button onClick={()=> delete_rice()}  className="p-1 w-1/3 text-lg font-bold rounded-full bg-red-500 text-offwhite" >Delete</button>
							<button onClick={()=> {set_show_delete_rice_modal(false); set_selected_rice(null)}}  className="p-1 w-1/3 text-lg font-bold rounded-full bg-blue-500 text-offwhite" >Cancel</button>
						</div>
					</section>
				</main>
			)}

			{/* Edit rice form */}
			{show_edit_rice_modal && (
				<main onClick={()=> {set_show_edit_rice_modal(false); set_selected_rice(null)}}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center text-white' >
					<form onSubmit={(e)=> {edit_rice(); e.preventDefault()}} onClick={(e)=> e.stopPropagation()}  className="w-2/3 gap-5 p-6 text-neutral-900 bg-khaki flex flex-col justify-center rounded-2xl shadow-2xl" >
						<p className='text-2xl text-sageGreen font-bold place-self-center' >EDIT RICE</p>
						<section className='w-full flex relative gap-4'>
							<div className='w-full relative flex flex-col gap-4 justify-center'>
								<div className='border-2 border-sageGreen rounded-xl w-full h-full' >
									{new_image_preview ? (
										<img src={new_image_preview} alt="Rice Image.png" className='w-full h-full rounded-xl' />
									) : (<p className='flex justify-center items-center w-full h-full text-sageGreen opacity-50 text-4xl' >No Image Selected</p>)}
								</div>
								<div className='relative flex place-self-center '>
									<label htmlFor="riceImage"  className='text-center text-offwhite rounded-full p-2 px-3 cursor-pointer bg-brown hover:scale-103 active:scale-100' >Upload Image</label>
									<input type="file" id="riceImage" onChange={(e)=> new_image_on_change(e)} accept='image/*'  className='hidden' />
								</div>
							</div>
							<div className='w-full flex flex-col gap-5 overflow-auto h-100 no-scrollbar'>
								<div className="w-full flex items-center relative">
									<input type="text" value={new_input_rice} onChange={(e)=> set_new_input_rice(e.target.value)} required name="riceName" className="peer flex-1 border rounded-3xl p-2 px-3" />
									<label htmlFor="riceName"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all pointer-events-none'>Rice Name *</label>
								</div>
								<div className="w-full flex items-center relative">
									<input type="text" value={new_input_company} onChange={(e)=> set_new_input_company(e.target.value)} name="riceCompany" placeholder=' '  className="peer flex-1 border rounded-3xl p-2 px-3" />
									<label htmlFor="riceCompany" className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:-mt-15 absolute ml-4 transition-all pointer-events-none' >Company</label>
								</div>
								<select value={new_input_category_name} onChange={(e) => set_new_input_category_name(e.target.value)} name="category" className='border w-full p-2 px-3 rounded-full text-lg' >
									<option selected disabled required  className='bg-khaki text-lg' >Select Category *</option>
									{categories.map((category)=> (
										<option key={category.id} value={category.name} className='bg-khaki text-lg' >{category.name}</option>
									))}
								</select>
								<div className="w-full flex items-center relative">
									<input type="text" value={new_input_price} onChange={(e)=> set_new_input_price(e.target.value)} required name="price" className="peer flex-1 border rounded-3xl p-2 px-3" />
									<label htmlFor="price"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all pointer-events-none' >Price *</label>
								</div>
								<div className="w-full flex items-center relative">
									<input type="text" value={new_input_stock} onChange={(e)=> set_new_input_stock(e.target.value)} required name="stock" className="peer flex-1 border rounded-3xl p-2 px-3" />
									<label htmlFor="stock"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all pointer-events-none' >Stock *</label>
								</div>
								<div className='w-full flex items-center' >
									<input type="checkbox" checked={new_input_25kg} onChange={(e)=> set_new_input_25kg(e.target.checked)} id='new_25kg' className='scale-120 ml-1' />
									<label htmlFor="new_25kg" className='text-lg ml-1' >25KG</label>
									<input type="checkbox" checked={new_input_50kg} onChange={(e)=> set_new_input_50kg(e.target.checked)} id='new_50kg' className='scale-120 ml-4' />
									<label htmlFor="new_50kg" className='ml-1 mr-4 text-lg' >50KG</label>
									<div className="w-full flex items-center relative">
										<input type="text" value={new_input_weight} onChange={(e)=> set_new_input_weight(e.target.value)} name="weight" placeholder=' '  className="peer flex-1 border rounded-3xl p-2 px-3" />
										<label htmlFor="weight" className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:-mt-15 absolute ml-4 transition-all pointer-events-none' >Custom weight in KG</label>
									</div>
								</div>
								<div className="w-full flex items-center relative">
									<textarea value={new_input_description} onChange={(e)=> set_new_input_description(e.target.value)} placeholder='' id="description" className="peer flex-1 border rounded-lg p-2 h-55" />
									<label htmlFor="description"  className='text-lg select-none peer-[&:not(:placeholder-shown)]:text-xs peer-[&:not(:placeholder-shown)]:-mt-13 peer-focus:text-xs peer-focus:-mt-13 absolute ml-2 mb-46 transition-all pointer-events-none' >Description</label>
								</div>
								<input type="submit" className=" p-2 px-3 w-full rounded-full bg-brown text-offwhite font-semibold text-lg" />
							</div>
						</section>
					</form>
				</main>
			)}

			{/* Add user form */}
			{show_add_user_modal && (
				<main onClick={()=> set_show_add_user_modal(false)}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center text-white' >
					<form onSubmit={(e)=> {add_user(); e.preventDefault()}} onClick={(e)=> e.stopPropagation()}  className="w-2/3 gap-5 p-6 text-neutral-900 bg-khaki grid grid-cols-2 grid-rows-[auto] rounded-2xl shadow-2xl" >
						<p className='text-2xl text-sageGreen font-bold col-span-2 place-self-center' >ADD USER</p>
						<div className='border-2 border-sageGreen rounded-full row-span-8 w-full h-full' >
							{profile_preview ? (
								<img src={profile_preview} alt="User Image.png" className='w-full h-full rounded-full' />
								) : (<p className='flex justify-center items-center w-full h-full text-sageGreen opacity-50 text-4xl' >No image Selected</p>)
							}
						</div>
						<div className='w-full relative flex'>
							<label htmlFor="userImage"  className='w-1/3 text-center text-offwhite rounded-full p-2 px-3 cursor-pointer bg-brown hover:scale-103 active:scale-100' >Upload Image</label>
							<input type="file" id="userImage" onChange={(e)=> profile_on_change(e)} accept='image/*'  className='hidden' />
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={input_username} onChange={(e)=> set_input_username(e.target.value)} required name="username" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="username"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all' >Username</label>
						</div>
						<div className="w-full flex items-center">
							<input type="password" value={input_password} onChange={(e)=> set_input_password(e.target.value)} required name="userPassword"  className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="userPassword" className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-valid:text-xs peer-valid:-mt-15 absolute ml-4 transition-all' >Password</label>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={input_email} onChange={(e)=> set_input_email(e.target.value)} placeholder='' name="email" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="email"  className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-mt-15 absolute ml-4 transition-all' >Email</label>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={input_address} onChange={(e)=> set_input_address(e.target.value)} placeholder='' name="address" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="address"  className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[:not(:placeholder-shown):valid]:text-xs peer-[:not(:placeholder-shown):valid]:-mt-15 absolute ml-4 transition-all' >Address</label>
						</div>
						<div className='w-full flex items-center'>
							<input type="checkbox" checked={input_is_admin} onChange={(e)=> set_input_is_admin(e.target.checked)} id="isAdmin" className='scale-150 ml-1 mr-2 cursor-pointer active:scale-130' />
							<label htmlFor="isAdmin" className='text-lg select-none' >Admin</label>
						</div>
						<input type="submit" className=" p-2 px-3 w-full cursor-pointer rounded-full bg-brown text-offwhite font-semibold text-lg" />
					</form>
				</main>
			)}

			{/* Delete user confirmation */}
			{show_delete_user_modal && (
				<main onClick={()=> {set_show_delete_user_modal(false); set_selected_user(null)}}  className='absolute top-0 left-0 w-full h-full bg-gray-950/70 flex justify-center items-center text-neutral-900' >
					<section onClick={(e)=> e.stopPropagation()}  className="p-10 gap-10 min-w-1/4 justify-center relative bg-khaki flex flex-col rounded-2xl items-center shadow-2xl" >
						<p  className='text-2xl text-sageGreen font-bold' >DELETE USER</p>
						<p className='text-6xl text-sageGreen font-semibold' >{selected_user.username}</p>
						<p className='text-3xl text-sageGreen -mt-10' >{selected_user.is_admin === true ? 'Admin' : 'Customer'}</p>
						<div className='w-full flex justify-around items-center'>
							<button onClick={()=> delete_user()}  className="p-1 w-1/3 text-lg font-bold rounded-3xl bg-red-500 text-offwhite" >Delete</button>
							<button onClick={()=> set_show_delete_user_modal(false)}  className="p-1 w-1/3 text-lg font-bold rounded-3xl bg-blue-500 text-offwhite" >Cancel</button>
						</div>
					</section>
				</main>
			)}

			{/* Edit user form */}
			{show_edit_user_modal && (
				<main onClick={()=> {set_show_edit_user_modal(false); set_selected_user(null)}}  className='absolute top-0 left-0 w-full h-full bg-neutral-950/70 flex justify-center items-center text-white' >
					<form onSubmit={(e)=> {editUser(); e.preventDefault()}} onClick={(e)=> e.stopPropagation()}  className="w-2/3 gap-5 p-6 text-neutral-900 bg-khaki grid grid-cols-2 grid-rows-[auto] rounded-2xl shadow-2xl" >
						<p className='text-2xl text-sageGreen font-bold col-span-2 place-self-center' >EDIT USER</p>
						<div className='border-2 border-sageGreen rounded-full row-span-8 w-full h-full relative select-none' >
							{new_profile_preview ? (
								<>
								<img src={new_profile_preview} alt="User Image.png" className='w-full h-full rounded-full' />
								<FontAwesomeIcon icon={faCircleXmark} className='text-3xl  text-sageGreen top-[7%] absolute right-[7%] cursor-pointer active:scale-90' />
								</>
								) : (<p className='flex justify-center items-center w-full h-full text-sageGreen opacity-50 text-4xl' >No image uploaded</p>)
							}
						</div>
						<div className='w-full relative flex'>
							<label htmlFor="userImage"  className='w-1/3 text-center text-offwhite rounded-full p-2 px-3 cursor-pointer bg-brown hover:scale-103 active:scale-100' >Upload Image</label>
							<input type="file" id="userImage" onChange={(e)=> new_profile_on_change(e)} accept='image/*'  className='hidden' />
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={new_input_username} onChange={(e)=> set_new_input_username(e.target.value)} required name="username" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="username"  className='text-lg select-none peer-focus:text-xs peer-valid:text-xs peer-focus:-mt-15 peer-valid:-mt-15 absolute ml-4 transition-all pointer-events-none' >Username</label>
						</div>
						<div className="w-full flex items-center">
							<input type="password" value={new_input_password} onChange={(e)=> set_new_input_password(e.target.value)} required name="userPassword"  className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="userPassword" className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-valid:text-xs peer-valid:-mt-15 absolute ml-4 transition-all pointer-events-none' >Password</label>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={new_input_email} onChange={(e)=> set_new_input_email(e.target.value)} placeholder='' name="email" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="email"  className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:-mt-15 absolute ml-4 transition-all pointer-events-none' >Email</label>
						</div>
						<div className="w-full flex items-center">
							<input type="text" value={new_input_address} onChange={(e)=> set_new_input_address(e.target.value)} placeholder='' name="address" className="peer flex-1 border rounded-3xl p-2 px-3" />
							<label htmlFor="address"  className='text-lg select-none peer-focus:text-xs peer-focus:-mt-15 peer-[:not(:placeholder-shown):valid]:text-xs peer-[:not(:placeholder-shown):valid]:-mt-15 absolute ml-4 transition-all pointer-events-none' >Address</label>
						</div>
						<div className='w-full flex items-center'>
							<input type="checkbox" checked={new_input_is_admin} onChange={(e)=> set_new_input_is_admin(e.target.checked)} id="isAdmin" className='scale-150 ml-1 mr-2 cursor-pointer active:scale-130' />
							<label htmlFor="isAdmin" className='text-lg select-none' >Admin</label>
						</div>
						<input type="submit" className=" p-2 px-3 w-full cursor-pointer rounded-full bg-brown text-offwhite font-semibold text-lg" />
					</form>
				</main>
			)}

			{/* Logout confirmation */}
			{show_logout_modal && (
				<main onClick={()=> set_show_logout_modal(false)}  className='absolute top-0 left-0 w-full h-full bg-gray-950/70 flex justify-center items-center' >
					<section onClick={(e)=> e.stopPropagation()}  className="w-1/2 p-6 gap-4 justify-center bg-khaki flex flex-col items-center rounded-2xl" >
						<p className='text-2xl text-sageGreen' >LOG OUT</p>
						<div className="w-full flex justify-around items-center" >
							<button onClick={()=> logout()}  className="p-1 w-1/4 text-lg font-semibold bg-red-500 text-offwhite rounded-full" >Logout</button>
							<button onClick={()=> set_show_logout_modal(false)}  className=" p-1 w-1/4 text-lg bg-sageGreen text-offwhite font-semibold rounded-full" >Cancel</button>
						</div>
					</section>
				</main>
			)}
		</main>
   )
}


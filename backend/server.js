import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import multer from 'multer'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { prisma } from './lib/prisma'
dotenv.config()

// Create App server
const app = express()
app.use(cors({origin:"http://localhost:5173", credentials:true}))
app.use(express.json())
app.use(cookieParser())
app.listen(5000)

// Configure cloudinary
cloudinary.config({
  	cloud_name: 'drsa7wppl',
  	api_key: process.env.CLOUDINARY_KEY,
  	api_secret: process.env.CLOUDINARY_SECRET
})

// Configure rice image storage in cloudinary
const storageRiceImage = new CloudinaryStorage({
  	cloudinary: cloudinary,
  	params: {
    	folder: 'Rice-Image',
    	allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  	}
})
const uploadRiceImage = multer({storage: storageRiceImage})

// Configure user profile image storage in cloudinary
const storageProfileImage = new CloudinaryStorage({
  	cloudinary: cloudinary,
	params: {
	 	folder: 'Profile-Image',
	 	allowed_formats: ['jpg', 'jpeg', 'png', 'webp']
  	}
})
const uploadProfileImage = multer({storage: storageProfileImage})

// Verify login credentials in database and generate token
app.post('/api/login', async (req, res) => {
  	const { username, password} = req.body
  	try {
    	const user = await prisma.User.findUnique({ where: {username} })
    	if(!user || user.password !== password) return res.status(401).json({ error: 'Incorrect username or password' })
    	const access_token = jwt.sign({ id: user.id, username: user.username, is_admin: user.is_admin }, process.env.JWT_SECRET_KEY, { expiresIn: '30m'})
    	const refresh_token = jwt.sign({ id: user.id, username: user.username, is_admin: user.is_admin }, process.env.JWT_SECRET_KEY, { expiresIn: '1h'})

    // Store access token in cookie
    	res.cookie("access_token", access_token, {
      	httpOnly: true,
      	secure: false,
      	sameSite: "strict",
      	maxAge: 30 * 60 * 1000
    	})

    // Store refresh token in cookie
    	res.cookie("refresh_token", refresh_token, {
      	httpOnly: true,
      	secure: false,
      	sameSite: "strict",
      	maxAge: 60 * 60 * 1000
    	})
    	res.status(200).json({valid_login: true})
  	} catch(err) {
		console.error('Prisma error: ', err)
		res.status(500).json({ error: 'Login went wrong', err })
	}
})

// Function to verify token
function verify_token(req, res, next) {
  	const token = req.cookies.access_token
  	if(!token) return res.json({error: "No token found"})
  	try {
    	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    	req.user = decoded
    	next()
  	} catch(err) {return res.status(403).json({error: "Invalid or expired token"})}
}

// Verify if current user is logged in
app.get('/api/verifyToken', verify_token, async (req, res)=> {
  	const current_token = req.user
  	const current_user = await prisma.User.findUnique({where: {id: current_token.id}})
  	res.status(200).json({message: "User is logged in", user: current_user || null})
})

// Function to verify admin
function verify_admin(req, res, next) {
	const token = req.cookies.access_token
  	if(!token) return res.json({error: "No token found"})
  	try {
    	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    	req.user = decoded
	  	next()
	} catch(err) {return res.status(403).json({error: "Invalid or expired token"})}
}

// Verify if current user is admin
app.get('/api/verifyAdmin', verify_token, verify_admin, (req, res)=> {
  	const is_admin = req.user.is_admin
  	res.json({is_admin})
})

// Logout
app.get('/api/logout', verify_token, async (req,res)=> {
  	res.clearCookie("access_token", {
    	httpOnly: true,
    	secure: false,
    	sameSite: "strict"
  	})
  	res.clearCookie("refresh_token", {
    	httpOnly: true,
    	secure: false,
    	sameSite: "strict"
  	})
  	res.json({message: "Logged out successfully"})
})

// Get categories from database
app.get('/api/getCategories', verify_token, async (req, res)=> {
  	try {
    	const categories = await prisma.Category.findMany()
    	res.status(200).json({ categories })
  	} catch(err) {res.status(500).json({ error: 'Fetching Categories from database failed', err})}
})

// Add category to database
app.post('/api/addCategory', verify_token, verify_admin, async (req, res)=> {
  	const { input_category } = req.body
  	try {
    	await prisma.Category.create({ data: { name: input_category } })
    	res.status(201).json({ message: 'Category created successfully!' })
  	} catch(err) {res.status(500).json({ error: 'Posting Category to database failed', err})}
})

// Delete category from database
app.delete('/api/deleteCategory', verify_token, verify_admin, async (req, res)=> {
	const {selected_category} = req.body
  	try {
    	await prisma.Category.delete({where: {id: selected_category.id}})
    	res.status(200).json({message: 'Category deleted successfully!'})
  	} catch(err) {
    	console.error('Prisma error: ', err)
    	res.status(500).json({message: 'Category deletion failed', err})
  	}
})

// Edit category from database
app.put('/api/editCategory', verify_token, verify_admin, async (req, res)=> {
	const {new_input_category, category_id} = req.body
	try {
		await prisma.Category.update({where: {id: category_id},
			data: {name: new_input_category}
		})
		res.status(200).json({message: 'Category edited successfully'})
	}
	catch(err) {
		console.error('Prisma error: ', err)
	 	res.status(500).json({ message: 'Editing Category in database failed', err})
	}
})

// Get Rices from database
app.get('/api/getRices', verify_token, async (req, res)=>{
  	try {
    	const rices = await prisma.Rice.findMany({
			orderBy: {id: 'asc'}, 
			include: {category: true, reviews: true}
		})
    	res.status(200).json({ rices })
  	} catch(err) {
    	console.error('Prisma error:', err)
    	res.status(500).json({ message: 'Fetching Rices from database failed ', err})
  	}
})

// Add rice to database
app.post('/api/addRice', verify_token, verify_admin, uploadRiceImage.single('image_file'), async (req, res)=> {
  	const {input_rice, input_company, input_category_id, input_price, input_stock, input_25kg, input_50kg, input_weight, input_description} = req.body
  	try {
    	if (!req.file) {return res.status(400).json({message: 'No image upload'})}
    	await prisma.Rice.create({data: {
      	name: input_rice, 
      	company: input_company, 
			category_id: parseInt(input_category_id),
      	price: parseFloat(input_price), 
      	stock: parseInt(input_stock), 
			is_25kg: Boolean(input_25kg),
			is_50kg: Boolean(input_50kg),
      	weight_kg: parseFloat(input_weight),
		 	description: input_description,
      	image_path: req.file.path,
      	image_public_id: req.file.filename
    	}})
    	res.status(200).json({message: 'Rice added successfully!'})
  	} catch(err) {
    	console.error('Prisma error: ', err)
    	res.status(500).json({ message: 'Posting Rice to database failed', err})
  	}
})

// Delete rice from database
app.delete('/api/deleteRice', verify_token, verify_admin, async (req, res)=> {
  	const {selected_rice} = req.body
  	try {
    	if(selected_rice.image_public_id) await cloudinary.uploader.destroy(selected_rice.image_public_id)
    	await prisma.Rice.delete({where: {id: selected_rice.id}})
    	res.status(200).json({message: 'Rice deleted successfully!'})
  	} catch(err) {
    	console.error('Prisma error: ', err)
    	res.status(500).json({message: 'Rice deletion failed', err})
  	}
})

// Edit rice in database
app.put('/api/editRice', verify_token, verify_admin, uploadRiceImage.single('new_image_file'), async (req, res)=> {
  	const {new_input_rice, new_input_company, selected_category_id, new_input_price, new_input_stock, new_input_25kg, new_input_50kg, new_input_weight, new_input_description, old_image_id, rice_id} = req.body
	try {
		const update_data = {
			name: new_input_rice,
			company: new_input_company,
			category_id: parseInt(selected_category_id),
			price: parseFloat(new_input_price),
			stock: parseInt(new_input_stock),
			is_25kg: new_input_25kg == 'true' ? true : false,
			is_50kg: new_input_50kg == 'true' ? true : false,
			weight_kg: parseFloat(new_input_weight),
			description: new_input_description
		}
		if (req.file && req.file.path) {
			await cloudinary.uploader.destroy(old_image_id || '')
			update_data.image_path = req.file.path
			update_data.image_public_id = req.file.filename
		}
		await prisma.Rice.update({where: {id: parseInt(rice_id)}, data: update_data})
		res.status(200).json({message: 'Rice edited successfully!'})
	} catch(err) {
	 	console.error('Prisma error: ', err)
	 	res.status(500).json({ message: 'Editing Rice in database failed', err})
  	}
})

// Get Users from database
app.get('/api/getUsers', verify_token, verify_admin, async (req, res)=>{
  	try {
   	const users = await prisma.User.findMany()
    	res.status(200).json({ users })
 	} catch(err) {res.status(500).json({ message: 'Fetching Users from database failed', err})}
})

// Add user to database
app.post('/api/addUser', verify_token, verify_admin, uploadProfileImage.single('profile_file'), async (req, res)=> {
  	const {input_username, input_password, input_email, input_address, input_is_admin} = req.body
	try {
		await prisma.User.create({data: {
			username: input_username,
			password: input_password,
			email: input_email,
			address: input_address || null,
			is_admin: Boolean(input_is_admin),
			image_path: req.file ? req.file.path : null,
			image_public_id: req.file ? req.file.filename : null
		}})
		res.status(201).json({ message: 'User created successfully!' })
	} catch(err) {
	 	console.error('Prisma error: ', err)
	 	res.status(500).json({ message: 'Posting User to database failed', err})
  	}
})

// Delete user from database
app.delete('/api/deleteUser', verify_token, verify_admin, async (req, res)=> {
  	const {selected_user} = req.body
	try {
	 	await prisma.User.delete({where: {id: selected_user.id}})
	 	res.status(200).json({message: 'User deleted successfully!'})
  	} catch(err) {
	 	console.error('Prisma error: ', err)
	 	res.status(500).json({message: 'User deletion failed', err})
  	}
})

// Edit user in database
app.put('/api/editUser', verify_token, verify_admin, uploadProfileImage.single('new_profile_file'), async (req, res)=> {
  	const {new_input_username, new_input_password, new_input_email, new_input_address, new_input_is_admin, old_profile_id, user_id} = req.body
	try {
		const update_data = {
			username: new_input_username || null,
			password: new_input_password || null,
			email: new_input_email,
			address: new_input_address || null,
			is_admin: new_input_is_admin == 'true' ? true : false
		}
		if (req.file && req.file.path) {
			await cloudinary.uploader.destroy(old_profile_id)
			update_data.image_path = req.file.path
			update_data.image_public_id = req.file.filename
		}
		await prisma.User.update({where: {id: parseInt(user_id)}, data: update_data})
		res.status(200).json({message: 'User edited successfully!'})
	} catch(err) {
	 	console.error('Prisma error: ', err)
	 	res.status(500).json({ message: 'Editing User in database failed', err})
  	}
})

// Edit self profile in database
app.put('/api/editProfile', verify_token, uploadProfileImage.single('new_picture_file'), async (req, res)=> {
  	const {new_username, new_password, new_email, new_address, user_id, old_picture_id} = req.body
	try {
		const update_data = {
			username: new_username || null,
			password: new_password || null,
			email: new_email,
			address: new_address || null
		}
		if (req.file && req.file.path) {
			await cloudinary.uploader.destroy(old_picture_id)
			update_data.image_path = req.file.path
			update_data.image_public_id = req.file.filename
		}
		await prisma.User.update({where: {id: parseInt(user_id)}, data: update_data})
		res.status(200).json({message: 'Profile edited successfully!'})
	} catch(err) {
	 	console.error('Prisma error: ', err)
	 	res.status(500).json({ message: 'Editing Profile in database failed', err})
  	}
})
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

// Verify login credentials in database and generate token
app.post('/api/login', async (req, res) => {
  	const { userName, userPassword} = req.body
  	try {
    	const user = await prisma.User.findUnique({ where: {userName} })
    	if(!user || user.password !== userPassword) return res.status(401).json({ error: 'Invalid credentials' })
    	const accessToken = jwt.sign({ userID: user.id, userName: user.userName, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: '30m'})
    	const refreshToken = jwt.sign({ userID: user.id, userName: user.userName, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: '1h'})
    
    // Store access token in cookie
    	res.cookie("accessToken", accessToken, {
      	httpOnly: true,
      	secure: false,
      	sameSite: "strict",
      	maxAge: 30 * 60 * 1000
    	})

    // Store refresh token in cookie
    	res.cookie("refreshToken", refreshToken, {
      	httpOnly: true,
      	secure: false,
      	sameSite: "strict",
      	maxAge: 60 * 60 * 1000
    	})
    	res.status(200).json({validLogin: true})
  	} catch(err) {res.status(500).json({ error: 'Login went wrong', err })}
})

// Function to verify token
function verifyToken(req, res, next) {
  	const token = req.cookies.accessToken
  	if(!token) {return res.status(401).json({error: "Not logged in"})}
  	try {
    	const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
    	req.user = decoded
    	next()
  	} catch(err) {return res.status(403).json({error: "Invalid or expired token"})}
}

// Verify if current user is logged in
app.get('/api/verifyToken', verifyToken, async (req, res)=> {
  	const currentToken = req.user
  	const currentUser = await prisma.User.findUnique({where: {id: currentToken.userID}})
  	res.json({message: "User is logged in", user: currentUser || null})
})

// Function to verify admin
function verifyAdmin(req, res, next) {
  	if(!req.user || !req.user.isAdmin) {return res.status(403).json({error: "Access denied"})}
  	next()
}

// Verify if current user is admin
app.get('/api/verifyAdmin', verifyToken, verifyAdmin, (req, res)=> {
  	const isAdmin = req.user.isAdmin
  	res.json({isAdmin})
})

// Logout
app.get('/api/logout', verifyToken, async (req, res)=> {
  	res.clearCookie("accessToken", {
    	httpOnly: true,
    	secure: false,
    	sameSite: "strict"
  	})
  	res.clearCookie("refreshToken", {
    	httpOnly: true,
    	secure: false,
    	sameSite: "strict"
  	})
  	res.json({message: "Logged out successfully"})
})

// Add category to database
app.post('/api/addCategory', verifyToken, verifyAdmin, async (req, res)=> {
  	const { inputCategory } = req.body
  	try {
    	await prisma.Category.create({ data: { name: inputCategory } })
    	res.status(201).json({ message: 'Category created successfully!' })
  	} catch(err) {res.status(500).json({ error: 'Posting Category to database failed', err})}
})

// Get categories from database
app.get('/api/getCategories', verifyToken, async (req, res)=> {
  	try {
    	const categories = await prisma.Category.findMany()
    	res.status(200).json({ categories })
  	} catch(err) {res.status(500).json({ error: 'Fetching Categories from database failed', err})}
})

// Delete category from database
app.delete('/api/deleteCategory', verifyToken, verifyAdmin, async (req, res)=> {
  	try {
    	const {selectedCategory} = req.body
    	await prisma.Category.delete({where: {id: selectedCategory.id}})
    	res.status(200).json({message: 'Category deleted successfully!'})
  	} catch(err) {
    	console.error('Prisma error: ', err)
    	res.status(500).json({message: 'Category deletion failed', err})
  	}
})

// Add rice to database
app.post('/api/addRice', verifyToken, verifyAdmin, uploadRiceImage.single('imageFile'), async (req, res)=> {
  	const {inputRice, inputCompany, inputCategoryID, inputPrice, inputStock, inputWeight} = req.body
  	try {
    	if (!req.file) {return res.status(400).json({message: 'No image upload'})}
    	await prisma.Rice.create({data: {
      	name: inputRice, 
      	company: inputCompany, 
      	categoryID: parseInt(inputCategoryID),
      	price: parseFloat(inputPrice), 
      	stock: parseInt(inputStock), 
      	weightKG: parseFloat(inputWeight),
      	imagePath: req.file.path,
      	imagePublicID: req.file.filename
    	}})
    	res.status(200).json({message: 'Rice added successfully!'})
  	} catch(err) {
    	console.error('Prisma error: ', err)
    	res.status(500).json({ message: 'Posting Rice to database failed', err})
  	}
})

// Delete rice from database
app.delete('/api/deleteRice', verifyToken, verifyAdmin, async (req, res)=> {
  	const {selectedRice} = req.body
  	try {
    	if(selectedRice.imagePublicID) await cloudinary.uploader.destroy(selectedRice.imagePublicID)
    	await prisma.Rice.delete({where: {id: selectedRice.id}})
    	res.status(200).json({message: 'Rice deleted successfully!'})
  	} catch(err) {
    	console.error('Prisma error: ', err)
    	res.status(500).json({message: 'Rice deletion failed', err})
  	}
})

// Edit rice in database
app.put('/api/editRice', verifyToken, verifyAdmin, uploadRiceImage.single('newImageFile'), async (req, res)=> {
  	const {newInputRice, newInputCompany, selectedCategoryID, newInputPrice, newInputStock, newInputWeight, oldImageID, oldRiceID} = req.body
	try {
    	if (!req.file) {return res.status(400).json({message: 'No image upload'})}
		if (oldImageID) {await cloudinary.uploader.destroy(oldImageID)}
		await prisma.Rice.update({where: {id: parseInt(oldRiceID)},
			data: {
				name: newInputRice,
				company: newInputCompany,
				categoryID: parseInt(selectedCategoryID),
				price: parseFloat(newInputPrice),
				stock: parseInt(newInputStock),
				weightKG: parseFloat(newInputWeight),
				imagePath: req.file.path,
				imagePublicID: req.file.filename
			}
		})
		res.status(200).json({message: 'Rice edited successfully!'})
	} catch(err) {
	 	console.error('Prisma error: ', err)
	 	res.status(500).json({ message: 'Editing Rice in database failed', err})
  	}
})

// Get Rices from database
app.get('/api/getRices', verifyToken, async (req, res)=>{
  	try {
    	const rices = await prisma.Rice.findMany({include: {category: {select: {name: true}}}})
    	res.status(200).json({ rices })
  	} catch(err) {
    	console.error('Prisma error:', err)
    	res.status(500).json({ message: 'Fetching Rices from database failed ', err})
  	}
})

// Get Users from database
app.get('/api/getUsers', verifyToken, verifyAdmin, async (req, res)=>{
  	try {
   	const users = await prisma.User.findMany()
    	res.status(200).json({ users })
 	} catch(err) {res.status(500).json({ message: 'Fetching Users from database failed', err})}
})

// Add user to database
app.post('/api/addUser', verifyToken, async (req, res)=> {
	
})
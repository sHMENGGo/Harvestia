import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());

app.listen(5000, () => console.log('Server is running on localhost:5000'));

const prisma = new PrismaClient();

// Verify credentials in database and generate token
app.post('/api/login', async (req, res) => {
  const { userName, userPassword} = req.body
  try {
    const user = await prisma.User.findUnique({ where: {userName} })
    if(!user || user.userPassword !== userPassword) return res.status(401).json({ error: 'Invalid credentials' })
    
    const token = jwt.sign({ userID: user.userID, userName: user.userName, isAdmin: user.isAdmin }, process.env.JWT_SECRET_KEY, { expiresIn: '1h'})
    res.json({ token })
  } catch(err) {res.status(500).json({ error: 'Something went wrong', err })}
})

// Add category to database
app.post('/api/addCategory', async (req, res) => {
  const { inputCategory } = req.body
  try {
    await prisma.Category.create({ data: { categoryName: inputCategory } })
    res.status(201).json({ message: 'Category created successfully!' })
  } catch(err) {res.status(500).json({ error: 'Posting Category to database failed', err})}
})

// Get categories from database
app.get('/api/getCategories', async (req, res)=> {
  try {
    const categories = await prisma.Category.findMany({include: { subCategories: true }})
    res.status(201).json({ categories })
  } catch(err) {res.status(500).json({ message: 'Fetching Categories from database failed', err})}
})

// Get Books from database
app.get('/api/getBooks', async (req, res)=>{
  try {
    const books = await prisma.Book.findMany({include: { category: { select: { categoryName: true }}, subCategory: { select: { subCategoryName: true }}}})
    res.status(201).json({ books })
  } catch(err) {res.status(500).json({ message: 'Fetching Books from database failed', err})}
})

// Get Users from database
app.get('/api/getUsers', async (req, res)=>{
  try {
    const users = await prisma.User.findMany()
    res.status(201).json({ users })
  } catch(err) {res.status(500).json({ message: 'Fetching Users from database failed', err})}
})
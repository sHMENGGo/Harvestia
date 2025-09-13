import axios from "axios"

// Fetch Users from server
export async function fetchUsers() {
   try {
      const res = await axios.get('http://localhost:5000/api/getUsers')
      return res.data.users
   } catch(err) {console.error('Error fetching Users from server', err); return[]}
}

// Fetch Categories from server
export async function fetchCategories() {
   try {
      const res = await axios.get('http://localhost:5000/api/getCategories')
      return res.data.categories
   } catch(err) {console.error('Error fetching categories from server'); return[]}
}

// Fetch Books from server
export async function fetchBooks() {
   try {
      const res = await axios.get('http://localhost:5000/api/getBooks')
      return res.data.books
   } catch(err) {console.error('Error fetching Books from server', err); return[]}
} 
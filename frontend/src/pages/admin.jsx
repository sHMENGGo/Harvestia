import { fetchBooks } from "../components/dataTransfer"
import { fetchUsers } from "../components/dataTransfer"
import { use, useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons"

export default function admin() {
	// Fetch Books from server
	const [books, setBooks] = useState([])
	const [categories, setCategories] = useState([])
	const [subCategories, setSubCategories] = useState([])
	useEffect(()=> {
		fetchBooks().then(setBooks)
	}, [])
	const totalBooks = books.length;

	// Fetch Users from server
	const [users, setUsers] = useState([])
	useEffect(()=> {
		fetchUsers().then(setUsers)
	}, [])
	const totalUsers = users.length;

   return (
		<main className=" grid grid-cols-4 grid-rows-10 gap-4 w-full p-4 relative text-offwhite">

			<section className="backdrop-blur-2xl border-l-5 border-brown p-2 shadow-2xl rounded-lg w-full h-full flex flex-col" >
				<p className="text-2xl opacity-50 border-b-2 pb-2 w-full text-center mb-3">TOTAL BOOKS</p>
				<p className="text-6xl text-center">{totalBooks}</p>
			</section>

			<section className="backdrop-blur-2xl border-l-5 border-brown p-2 shadow-2xl rounded-lg w-full h-full flex flex-col" >
				<p className="text-2xl opacity-50 border-b-2 pb-2 w-full text-center mb-3">TOTAL CUSTOMERS</p>
				<p className="text-6xl text-center">{totalUsers}</p>
			</section>

			<section className="backdrop-blur-2xl border-l-5 border-brown p-2 shadow-2xl rounded-lg w-full h-full flex flex-col" >
				<p className="text-2xl opacity-50 border-b-2 pb-2 w-full text-center mb-3">TOTAL SALES</p>
				<p className="text-6xl text-center">$3,289</p>
			</section>

			<section className="backdrop-blur-2xl border-l-5 border-brown p-2 shadow-2xl rounded-lg w-full h-full flex flex-col" >
				<p className="text-2xl opacity-50 border-b-2 pb-2 w-full text-center mb-3">OUT OF STOCKS</p>
				<p className="text-6xl text-center">2</p>
			</section>

			{/* Inventory Section */}
			<section className="backdrop-blur-2xl border-l-5 border-brown p-2 shadow-2xl rounded-lg w-full h-full flex col-span-4 flex-col" >
				<p className="text-2xl opacity-50 w-full text-center mb-3">INVENTORY</p>
				<p className="absolute bg-green-950 right-5 top-3 text-offwhite p-1 px-10 rounded-lg hover:bg-green-800 text-sm font-semibold text-center cursor-pointer" >Add Book</p>
				<input type="text" placeholder="Search book"  className="absolute p-1 rounded top-2 left-2 border border-gray-300/20 hover:border-gray-300/50 w-[30%]" />
				<table>
					<thead className="border-b-2 border-gray-300/50 border-t-2 text-xl">
						<tr>
							<th>Title</th>
							<th>Author</th>
							<th>Category</th>
							<th>Sub-Category</th>
							<th>Price</th>
							<th>Stock</th>
							<th>Status</th>
						</tr>
					</thead>

					<tbody className="text-center">
						{books.map((book) => (
							<tr key={book.bookID} className="border-b border-gray-300/20 hover:bg-gray-950/20">
								<td>{book.bookTitle}</td>
								<td>{book.bookAuthor}</td>
								<td>{book.category?.categoryName}</td>
								<td>{book.subCategory?.subCategoryName}</td>
								<td>${book.bookPrice}</td>
								<td>{book.bookStock}</td>
								<td>{book.bookStock > 0 ? 'Available' : 'No Stock'}</td>
								<td className="flex-row flex justify-center">
									<p className="mr-2 bg-blue-950 w-1/3 mb-1 mt-1 text-offwhite text-xl p-1 rounded-lg hover:bg-blue-800 font-semibold cursor-pointer" ><FontAwesomeIcon icon={faEdit}/></p>
									<p className="mr-2 bg-red-950 w-1/3 mb-1 mt-1 text-offwhite text-xl p-1 rounded-lg hover:bg-red-800 font-semibold cursor-pointer" ><FontAwesomeIcon icon={faTrash}/></p>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
			
			{/* Category Section */}
			<section className="backdrop-blur-2xl border-l-5 border-brown p-2 shadow-2xl rounded-lg w-full h-full flex col-span-4 flex-col" >
				<p className="text-2xl opacity-50 border-b-2 pb-2 w-full text-center mb-3">CATEGORY</p>
				<p className="absolute bg-green-950 right-5 top-3 text-offwhite p-1 px-10 rounded-lg hover:bg-green-800 text-sm font-semibold text-center cursor-pointer" >Add Category</p>
				<input type="text" placeholder="Search category name"  className="absolute p-1 rounded top-2 left-2 border border-gray-300/20 hover:border-gray-300/50 w-[30%]" />
				<table>
					<thead>
						<tr>
							<th colSpan='2' className="text-2xl font-semibold">Category Name</th>
							<th colSpan='2' className="text-2xl font-semibold" >Sub-Category Name</th>
						</tr>
					</thead>

					<tbody className="text-center">
						<tr>
							<td>CategoryName</td>
							<td className="flex flex-row justify-end">
								<p className="mr-2 bg-blue-950 w-1/3 text-offwhite p-2 font-semibold rounded-lg hover:bg-blue-800 cursor-pointer" >Edit</p>
								<p className="mr-2 bg-red-950 cursor-pointer hover:bg-red-800 font-semibold w-1/3 text-offwhite p-2 rounded-lg" >Delete</p>
							</td>

							<td>Sub-CategoryName</td>
							<td className="flex flex-row justify-end">
								<p className="mr-2 bg-blue-950 w-1/3 text-offwhite p-2 rounded-lg hover:bg-blue-800 font-semibold cursor-pointer" >Edit</p>
								<p className="mr-2 bg-red-950 cursor-pointer hover:bg-red-800 font-semibold w-1/3 text-offwhite p-2 rounded-lg" >Delete</p>
							</td>
						</tr>
					</tbody>
				</table>

			</section>

		</main>
   )
}
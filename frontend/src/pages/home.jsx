import { use, useEffect, useState } from "react"
import { fetchBooks } from "../components/dataTransfer"

export default function home() {
	// Fetch Books from server
	const [books, setBooks] = useState([])
	useEffect(()=> {
		fetchBooks().then(setBooks)
	}, [])

	console.log(books)
	return (
		<main className="gap-4 w-full relative text-offwhite">

			<section>

			</section>
		</main>
	)
}
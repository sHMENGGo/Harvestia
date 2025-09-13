import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons'
import { fetchCategories } from './dataTransfer'

export default function sideBar({setShowCategoryModal}) {
	const [showSubCategories, setShowSubCategories] = useState('')

	// Check if the token is admin
	const [isAdmin, setIsAdmin] = useState(null)
	useEffect(()=> {
		const token = localStorage.getItem('token')
		if(token) {const decoded = jwtDecode(token); setIsAdmin(decoded.isAdmin)}
	}, [])

	// Fetch categories from the server
	const [categories, setCategories] = useState([])
	const [subCategories, setSubCategories] = useState([])
	useEffect(()=> {
		fetchCategories().then((data)=> {
			setCategories(data)
			setSubCategories(data.flatMap(category => category.subCategories))
		})
	}, [])


	const [selectedCategory, setSelectedCategory] = useState(null)
	const [selectedSubCategory, setSelectedSubCategory] = useState(null)

   return (
		<main className='absolute overflow-auto left-0 w-[80%] md:w-[20%] h-full backdrop-blur-2xl shadow-2xl text-offwhite' >
			<section className=' w-full h-[40%] flex gap-9 pt-4 flex-col' >
				<div className='pr-[5%] flex justify-end items-center w-full' >
					<FontAwesomeIcon icon={faBars} className='absolute text-xl lg:text-3xl left-[5%] cursor-pointer' />
					<FontAwesomeIcon icon={faCartShopping} className='text-xl lg:text-3xl cursor-pointer mr-2' />
					<FontAwesomeIcon icon={faUser} className=' text-xl lg:text-3xl cursor-pointer' />
				</div>

				<Link to={'/Home'}>
					<img src="/liberiumLogo.png" alt="Liberium-Logo" className='rounded-3xl w-[50%] aspect-square place-self-center shadow-2xl hover:scale-105' />
					<p className='text-xl lg:text-2xl text-offwhite place-self-center font-thin'>L I B E R I U M</p>
				</Link>
			</section>

			<section className=' w-full h-3/4 indent-5' >
				{/* Show Admin tab if user is admin */}
				{isAdmin && (<Link to={'/Admin'}><p  className=' text-white p-2 text-lg lg:text-xl font-normal hover:bg-gray-800/30' >Admin</p></Link>)}

				{/* Display all categories */}
				{categories.map((category) => (
					<div  key={category.categoryID}>
						<p onClick={()=> setSelectedCategory((prev)=> prev?.categoryID === category.categoryID ? null : category)}  className={`${selectedCategory?.categoryID === category.categoryID ? 'bg-gray-800/30' : ''} p-2 text-lg hover:bg-gray-800/30 cursor-pointer`} >{category.categoryName}</p>
						
						{selectedCategory?.categoryID === category.categoryID && subCategories?.filter(subCategory => subCategory.categoryID === selectedCategory.categoryID).map((subCategory)=> (
								<div key={subCategory.subCategoryID} onClick={()=> setSelectedSubCategory((prev)=> prev?.subCategoryID === subCategory.subCategoryID ? null : subCategory)}  className='text-sm' >
									<Link to={`/${selectedCategory.categoryName}/${subCategory.subCategoryName}`} ><p className='p-1 text-white font-normal hover:bg-gray-800/30 pl-4'>{subCategory.subCategoryName}</p></Link>
								</div>
						))}
					</div>
				))}

				{isAdmin && (<p onClick={()=> setShowCategoryModal(true)}  className=' w-8/10 place-self-center rounded-3xl indent-0 text-center text-gray-950 bg-offwhite p-2 text-lg hover:bg-gray-950/60 cursor-pointer font-semibold' >Add Category</p>)}
			</section>
		</main>
	)
}
import { useEffect, useState } from 'react'
import { data, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons'
import { apiGet } from './api'

export default function sideBar({setShowCategory, refresh}) {
	// Verify if current user is admin
	const [isAdmin, setIsAdmin] = useState(false)
	useEffect(()=> {
		apiGet('/verifyAdmin').then((data)=> {
		setIsAdmin(data.isAdmin)
		})
	}, [])

	// Fetch categories from the server
	const [categories, setCategories] = useState([])
	useEffect(()=> {
		apiGet('/getCategories').then((data)=> {
			setCategories(data.categories)
		})
	}, [refresh])

   return (
		<main className='absolute flex flex-col items-center overflow-auto left-0 w-[80%] md:w-[20%] h-full bg-khaki' >
			<section className=' w-full h-[40%] flex gap-9 pt-4 flex-col' >
				<div className='pr-[5%] flex justify-end items-center w-full' >
					<FontAwesomeIcon icon={faBars} className='absolute text-sageGreen lg:text-3xl left-[5%] cursor-pointer hover:scale-110 active:scale-95' />
					<FontAwesomeIcon icon={faCartShopping} className='text-xl lg:text-3xl cursor-pointer mr-2 text-sageGreen hover:scale-110 active:scale-95' />
					<Link to={'/profile'}><FontAwesomeIcon icon={faUser} className=' text-xl lg:text-3xl cursor-pointer hover:scale-110 text-sageGreen active:scale-95' /></Link>
				</div>

				<Link to={'/home'} onClick={()=> setShowCategory(0)} >
					{/* <img src="/liberiumLogo.png" alt="Liberium-Logo" className='rounded-3xl w-[50%] aspect-square place-self-center shadow-2xl hover:scale-105' /> */}
					<p className='text-xl lg:text-2xl text-sageGreen place-self-center'>H A R V E S T I A</p>
				</Link>
			</section><br />

			<section className=' w-full indent-5 ' >
				{/* Show Admin tab if user is admin */}
				{isAdmin && (<Link to={'/Admin'}><p  className=' text-sageGreen p-2 text-lg lg:text-xl font-normal hover:bg-neutral-400/20 active:bg-neutral-700/30' >Admin</p></Link>)}

				{/* Display all categories */}
				{categories.map((category) => (
					<Link to={'/home'} onClick={()=> setShowCategory(category.id)} >
						<p key={category.id}  className="p-2 text-lg hover:bg-neutral-400/20 cursor-pointer text-sageGreen active:bg-neutral-700/30" >{category.name}</p>
					</Link>
				))}
			</section>
		</main>
	)
}
import { useEffect, useState } from 'react'
import { data, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons'
import { apiGet } from './api'
import Logo from '../assets/harvestia.png'

export default function sideBar({setShowCategory, categories}) {
	// Verify if current user is admin
	const [isAdmin, setIsAdmin] = useState(false)
	useEffect(()=> {
		apiGet('/verifyAdmin').then((data)=> {
		setIsAdmin(data.isAdmin)
		})
	}, [])

   return (
		<main className='absolute flex flex-col items-center overflow-auto left-0 w-[80%] md:w-[20%] h-full bg-khaki' >
			<section className=' w-full h-[40%] flex gap-18 pt-4 flex-col' >
				<div className='pr-[5%] flex justify-end items-center w-full' >
					<FontAwesomeIcon icon={faBars} className='absolute text-sageGreen lg:text-3xl left-[5%] cursor-pointer hover:scale-110 active:scale-95' />
					<FontAwesomeIcon icon={faCartShopping} className='text-xl lg:text-3xl cursor-pointer mr-2 text-sageGreen hover:scale-110 active:scale-95' />
					<Link to={'/profile'}><FontAwesomeIcon icon={faUser} className=' text-xl lg:text-3xl cursor-pointer hover:scale-110 text-sageGreen active:scale-95' /></Link>
				</div>
				<Link to={'/home'} onClick={()=> setShowCategory(0)} ><img src={Logo} alt="Harvestia Logo" className=' hover:scale-105 w-9/10 place-self-center' /></Link>
			</section><br />

			<section className=' w-full indent-5 ' >
				{/* Show Admin tab if user is admin */}
				{isAdmin && (<Link to={'/admin'}><p  className=' text-sageGreen p-2 text-lg lg:text-xl font-normal hover:bg-neutral-400/20 active:bg-neutral-700/30' >Admin</p></Link>)}

				{/* Display all categories */}
				{categories.map((category) => (
					<Link to={'/home'} key={category.id} onClick={()=> setShowCategory(category.id)} >
						<p  className="p-2 text-lg hover:bg-neutral-400/20 cursor-pointer text-sageGreen active:bg-neutral-700/30" >{category.name}</p>
					</Link>
				))}
			</section>
		</main>
	)
}
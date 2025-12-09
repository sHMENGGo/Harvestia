import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartArrowDown, faStar } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"
export default function home({showCategory, rices, categories, setSelectedRice}) {
	const navigate = useNavigate()
	
	// Filter rices based on category
	const [filteredRices, setFilteredRices] = useState([])
	useEffect(()=> {
		if(rices) {
			setFilteredRices(showCategory !== 0 ? rices.filter(rice => rice.categoryID === showCategory) : rices)
		}
	}, [showCategory, rices])

	// Filter category name
	const [categoryName, setCategoryName] = useState('')
	useEffect(()=> {
		if(showCategory === 0) {setCategoryName('ALL RICE')} 
		else {
			const category = categories.find(c => c.id === showCategory)
			setCategoryName(category ? category.name.toUpperCase() : '')
		}
	})
	
	return (
		<main className="gap-4 w-full p-4 h-full relative flex flex-col box-border">
			<h1 className="text-6xl font-bold text-offwhite" >{categoryName}</h1>
			<br />
			<section className="w-full flex gap-6 h-full flex-wrap p-2" >
				{/* Rice cards */}
				{filteredRices.map((filteredRice)=> (
					<div key={filteredRice.id} onClick={()=> {navigate('/riceInfo'); setSelectedRice(filteredRice)}}  className="w-[30%] h-fit bg-khaki rounded-lg flex justify-start items-start relative cursor-pointer">
						<div className="w-1/2 h-full rounded-l-lg" ><img src={filteredRice.imagePath} alt='No image available' className="h-full place-self-center aspect-square rounded-l-lg" /></div>
						<div className="w-1/2 right-0 h-full p-2 relative gap-1 flex flex-col justify-start">
							<p className="text-xl font-semibold">{filteredRice.name}</p>
							<p className="opacity-80">{filteredRice.company}</p>
							<p className="opacity-80">{filteredRice.weightKG} kg</p>
							<p className="text-sageGreen font-semibold">₱ {filteredRice.price}</p>
							<p className="opacity-80" >2421 sold</p>
							<p className="opacity-80" ><FontAwesomeIcon icon={faStar} className="text-yellow-500 opacity-100"/> 3.5</p>
							<button onClick={(e)=> {navigate('/checkout', {replace:true}); e.stopPropagation()}}  className="bottom-1 absolute right-1 bg-brown p-1 px-2 text-offwhite rounded">Buy Now</button>
						</div>
					</div>
				))}
			</section>
		</main>
	)
}
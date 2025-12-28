import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartArrowDown, faStar } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from "react-router-dom"
export default function home({show_category, rices, categories, set_selected_rice}) {
	const navigate = useNavigate()
	
	// Filter rices based on category
	const [filtered_rices, set_filtered_rices] = useState([])
	useEffect(()=> {
		if(rices) {
			set_filtered_rices(show_category !== 0 ? rices.filter(rice => rice.category_id === show_category) : rices)
		}
	}, [show_category, rices])

	// Filter category name
	const [category_name, set_category_name] = useState('')
	useEffect(()=> {
		if(show_category === 0) {set_category_name('ALL RICE')} 
		else {
			const category = categories.find(c => c.id === show_category)
			set_category_name(category ? category.name.toUpperCase() : '')
		}
	})
	
	return (
		<main className="gap-4 w-full p-4 h-full relative flex flex-col box-border">
			<h1 className="text-7xl font-bold text-khaki" >{category_name}</h1>
			<br />
			<section className="w-full flex gap-6 h-full flex-wrap p-2" >
				{/* Rice cards */}
				{filtered_rices.map((filtered_rice)=> (
					<div key={filtered_rice.id} onClick={()=> {navigate('/riceInfo'); set_selected_rice(filtered_rice)}}  className="w-[30%] h-fit bg-khaki rounded-lg flex justify-start items-start relative cursor-pointer">
						<div className="w-1/2 h-full rounded-l-lg" ><img src={filtered_rice.image_path} alt='No image available' className="h-full place-self-center aspect-square rounded-l-lg" /></div>
						<div className="w-1/2 right-0 h-full p-2 relative gap-1 flex flex-col justify-start">
							<p className="text-xl font-semibold">{filtered_rice.name}</p>
							<p className="opacity-80">{filtered_rice.company}</p>
							<p className="opacity-80">{filtered_rice.weight_kg} kg</p>
							<p className="text-sageGreen font-semibold">₱ {filtered_rice.price}</p>
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
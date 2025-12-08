import { use, useEffect, useState } from "react"
import { apiGet } from "../components/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartArrowDown, faStar } from '@fortawesome/free-solid-svg-icons'
export default function home({showCategory, rices}) {
	// Filter rices based on category
	const [filteredRices, setFilteredRices] = useState([])
	useEffect(()=> {
		if(rices) {
			setFilteredRices(showCategory !== 0 ? rices.filter(rice => rice.categoryID === showCategory) : rices)
		}
	}, [showCategory, rices])
	
	return (
		<main className="gap-4 w-full p-4 h-full relative flex flex-col box-border">
			<br /><br />
			<section className="w-full flex gap-6 h-full flex-wrap p-2" >
				{filteredRices.map((filteredRice)=> (
					<div key={filteredRice.id}  className="w-[30%] h-[35%] bg-khaki rounded-lg flex justify-start items-start relative">
						<div className="w-1/2 h-full rounded-l-lg" ><img src={filteredRice.imagePath} alt='No image available' className="h-full place-self-center aspect-square rounded-l-lg" /></div>
						<div className="w-1/2 right-0 h-full p-2 relative gap-1 flex flex-col justify-start">
							<p className="text-xl font-semibold truncate">{filteredRice.name}</p>
							<p className="opacity-80">{filteredRice.company}</p>
							<p className="opacity-80">{filteredRice.weightKG} kg</p>
							<p className="text-sageGreen font-semibold">₱ {filteredRice.price}</p>
							<p className="opacity-80" >2421 sold</p>
							<p className="opacity-80" ><FontAwesomeIcon icon={faStar} className="text-yellow-500 opacity-100"/> 3.5</p>
							<button className="bottom-1 absolute right-1 bg-sageGreen p-1 px-2 text-offwhite rounded">Buy Now</button>
						</div>
					</div>
				))}
			</section>
		</main>
	)
}
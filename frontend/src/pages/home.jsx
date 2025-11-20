import { use, useEffect, useState } from "react"
import { apiGet } from "../components/api"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCartArrowDown, faStar } from '@fortawesome/free-solid-svg-icons'
export default function home({showCategory, refresh}) {
	// Fetch rices from server
	const [rices, setRices] = useState([])
	useEffect(()=> {
		apiGet('/getRices').then((data)=> {setRices(data.rices) || []})
	}, [refresh])

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
					<div key={filteredRice.id}  className="w-[30%] h-[35%] bg-khaki cursor-pointer hover:scale-102 active:scale-98 rounded-lg flex justify-start items-start relative">
						<div className="w-1/2 h-full rounded-l-lg" ><img src={`http://localhost:5000${filteredRice.imagePath}`} alt='No image available' className="h-full place-self-center aspect-square" /></div>
						<div className="w-1/2 right-0 h-full p-2 relative gap-1 flex flex-col justify-start">
							<p className="text-xl font-semibold truncate">{filteredRice.name}</p>
							<p className="text-sm opacity-80">{filteredRice.company}</p>
							<p className="opacity-80">{filteredRice.weightKG} kg</p>
							<p className="text-sageGreen">₱ {filteredRice.price}</p>
							<p className="opacity-80"><FontAwesomeIcon icon={faStar} className="text-yellow-400 opacity-100"/> 3.5  <span className="opacity-50">|</span> <span>2421</span> sold</p>
							{/* <button className="bottom-0 absolute left-0 bg-blue-800 hover: w-1/3 h-[25%] rounded-bl-lg"><FontAwesomeIcon icon={faCartArrowDown} className="text-xl" /></button>
							<button className="bottom-0 absolute right-0 bg-amber-800 w-2/3 h-[25%] rounded-br-lg">Buy Now</button> */}
						</div>
					</div>
				))}
			</section>
		</main>
	)
}
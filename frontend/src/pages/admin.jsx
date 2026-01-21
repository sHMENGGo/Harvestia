import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faTrash, faUser } from "@fortawesome/free-solid-svg-icons"
import Toaster from "../components/toaster"
import { useState } from "react"

export default function admin({set_show_add_category_modal, set_selected_category, set_show_delete_category_modal, set_show_add_rice_modal, set_show_add_user_modal, set_show_delete_rice_modal, set_show_delete_user_modal, set_show_edit_rice_modal, set_show_edit_category_modal, set_show_edit_user_modal, set_selected_rice, set_selected_user, users, total_users, categories, rices, total_rices}) {
	// Calculate out of stocks rices
	const [out_of_stocks, set_out_of_stocks] = useState(0)
	rices.forEach(rice => {
		if(rice.stock <= 0) {set_out_of_stocks(prev => prev + 1)}
	})


   return (
		<main className=" grid grid-cols-4 gap-4 w-full p-4 auto-rows-auto">
			<section className="bg-khaki border-l-5 border-brown p-3 shadow-2xl rounded-lg w-full flex flex-col relative auto-rows-auto" ><p className="text-2xl opacity-50 border-b-2 pb-2 w-full text-center mb-3">TOTAL RICES</p><p className="text-5xl text-center text-sageGreen">{total_rices}</p></section>
			<section className="bg-khaki border-l-5 border-brown p-3 shadow-2xl rounded-lg w-full flex flex-col auto-rows-auto" ><p className="text-2xl opacity-50 border-b-2 pb-2 w-full text-center mb-3">TOTAL CUSTOMERS</p><p className="text-5xl text-center text-sageGreen">{total_users}</p></section>
			<section className="bg-khaki border-l-5 border-brown p-3 shadow-2xl rounded-lg w-full flex flex-col auto-rows-auto" ><p className="text-2xl opacity-50 border-b-2 pb-2 w-full text-center mb-3">TOTAL SALES</p><p className="text-5xl text-center text-sageGreen">Nan</p></section>
			<section className="bg-khaki border-l-5 border-brown p-3 shadow-2xl rounded-lg w-full flex flex-col auto-rows-auto" ><p className="text-2xl opacity-50 border-b-2 pb-2 w-full text-center mb-3">OUT OF STOCKS</p><p className="text-5xl text-center text-sageGreen">{out_of_stocks}</p></section>

			{/* Inventory Section */}
			<section className="backdrop-blur-2xl bg-khaki border-l-5 border-brown p-2 shadow-2xl rounded-lg w-full h-full flex col-span-4 flex-col" >
				<p className="text-2xl opacity-70 w-full text-center mb-3">INVENTORY</p>
				<button onClick={()=> set_show_add_rice_modal(true)}  className="absolute bg-brown right-5 top-3 text-offwhite p-1 px-10 rounded-lg font-semibold text-center" >Add Rice</button>
				<input type="text" placeholder="Search rice"  className="absolute p-1 rounded top-2 left-2 border border-neutral-900/50 hover:border-neutral-900 focus:outline-1 w-[30%]" />
				<table>
					<thead className="border-b-2 border-neutral-900/50 border-t-2 text-xl text-sageGreen">
						<tr>
							<th>Name</th>
							<th>Company</th>
							<th>Category</th>
							<th>25KG</th>
							<th>50KG</th>
							<th>Custom Weight (kg)</th>
							<th>Price</th>
							<th>Stock</th>
							<th>Rating</th>
							<th>Status</th>
						</tr>
					</thead>
					<tbody className="text-center">
						{rices.map((rice) => (
							<tr key={rice.id} className="border-b border-gray-400/20 hover:bg-neutral-400/20">
								<td>{rice.name}</td>
								<td>{rice.company}</td>
								<td>{rice.category?.name}</td>
								<td>{rice.is_25kg ? 'Yes' : 'No'}</td>
								<td>{rice.is_50kg ? 'Yes' : 'No'}</td>
								<td>{rice.weight_kg}</td>
								<td>₱ {rice.price}</td>
								<td>{rice.stock}</td>
								<td>{rice.rating}</td>
								<td>{rice.stock > 0 ? 'Available' : 'No Stock'}</td>
								<td className="flex-row flex justify-center">
									<button  className=" text-xl p-1 rounded-lg hover:text-blue-500 font-semibold" ><FontAwesomeIcon icon={faEdit} onClick={()=> {set_show_edit_rice_modal(true); set_selected_rice(rice)}} /></button>
									<button  className=" text-xl p-1 rounded-lg hover:text-red-500 font-semibold" ><FontAwesomeIcon icon={faTrash} onClick={()=> {set_show_delete_rice_modal(true); set_selected_rice(rice)}} /></button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
			
			{/* Category Section */}
			<section className=" bg-khaki border-l-5 border-brown p-2 shadow-2xl rounded-lg w-full h-full flex col-span-4 flex-col relative" >
				<p className="text-2xl opacity-70 border-b-2 pb-2 w-full text-center mb-3">CATEGORY</p>
				<button onClick={()=> set_show_add_category_modal(true)}  className=" bg-brown absolute right-5 top-3 text-offwhite p-1 px-8 rounded-lg font-semibold text-center" >Add Category</button>
				<input type="text" placeholder="Search category"  className=" p-1 absolute rounded top-2 left-2 border border-neutral-900/50 hover:border-neutral-900 focus:outline-1 w-[30%]" />
				<div className="flex flex-row gap-4">
					{/* Show Categories */}
					<table className="w-1/2 border-r border-gray-300/20">
						<thead><tr><th colSpan='2' className="text-2xl font-semibold">Category Name</th></tr></thead>
						<tbody>
							{categories.map((category) => (
								<tr key={category.id} className="border-b border-neutral-400/20 hover:bg-neutral-400/20" >
									<td>{category.name}</td>
									<td className="flex-row flex justify-center">
										<button  className=" text-xl p-1 rounded-lg hover:text-blue-500 font-semibold" ><FontAwesomeIcon icon={faEdit} onClick={()=> {set_show_edit_category_modal(true); set_selected_category(category)}} /></button>
										<button  className=" text-xl p-1 rounded-lg hover:text-red-500 font-semibold" ><FontAwesomeIcon icon={faTrash} onClick={()=> {set_show_delete_category_modal(true); set_selected_category(category)}} /></button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* User Section */}
			<section className="backdrop-blur-2xl bg-khaki border-l-5 border-brown p-2 shadow-2xl rounded-lg w-full h-full flex col-span-4 flex-col" >
				<p className="text-2xl opacity-70 w-full text-center mb-3">USER</p>
				<button onClick={()=> set_show_add_user_modal(true)}  className="absolute bg-brown right-5 top-3 text-offwhite p-1 px-10 rounded-lg font-semibold text-center" >Add User</button>
				<input type="text" placeholder="Search user"  className="absolute p-1 rounded top-2 left-2 border border-neutral-900/50 hover:border-neutral-900 focus:outline-1 w-[30%]" />
				<table>
					<thead className="border-b-2 border-neutral-900/50 border-t-2 text-xl text-sageGreen">
						<tr>
							<td></td>
							<th>User Name</th>
							<th>Password</th>
							<th>Email</th>
							<th>Admin</th>
							<th>Adress</th>
						</tr>
					</thead>
					<tbody className="text-center items-center">
						{users?.map((user) => (
							<tr key={user.id} className="border-b border-gray-400/20 hover:bg-neutral-400/20 h-15">
								<td className=" w-[5%] relative" >
									{user.image_path ? (
										<img src={user.image_path} alt="Profile Image" className="border border-sageGreen rounded w-full aspect-square place-self-center absolute" />
										) : (<FontAwesomeIcon icon={faUser} className="text-3xl text-neutral-600/50" />)
									}
								</td>
								<td>{user.username}</td>
								<td>{user.password}</td>
								<td>{user.email}</td>
								<td>{String(user.is_admin)}</td>
								<td>{user.address}</td>
								<td className="flex-row flex justify-center">
									<button  className=" text-xl p-1 rounded-lg hover:text-blue-500 font-semibold" ><FontAwesomeIcon icon={faEdit} onClick={()=> {set_show_edit_user_modal(true); set_selected_user(user)}}/></button>
									<button  className=" text-xl p-1 rounded-lg hover:text-red-500 font-semibold" ><FontAwesomeIcon icon={faTrash} onClick={()=> {set_show_delete_user_modal(true); set_selected_user(user)}} /></button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		<Toaster/>
		</main>
   )
}
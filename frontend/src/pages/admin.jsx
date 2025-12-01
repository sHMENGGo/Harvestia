import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons"

export default function admin({
	setShowAddCategoryModal, 
	setSelectedCategory, 
	setShowDeleteCategoryModal, 
	setShowAddRiceModal, 
	setShowDeleteRiceModal, 
	setShowEditRiceModal,
	setShowEditCategoryModal,
	setSelectedRice, 
	users, 
	totalUsers, 
	categories,
	rices,
	totalRices
}) {

   return (
		<main className=" grid grid-cols-4 gap-4 w-full p-4 auto-rows-auto">
			<section className="bg-khaki border-l-5 border-brown p-3 shadow-2xl rounded-lg w-full flex flex-col relative auto-rows-auto" ><p className="text-xl opacity-50 border-b-2 pb-2 w-full text-center mb-3">TOTAL SACKS OF RICE</p><p className="text-5xl text-center text-sageGreen">{totalRices}</p></section>
			<section className="bg-khaki border-l-5 border-brown p-3 shadow-2xl rounded-lg w-full flex flex-col auto-rows-auto" ><p className="text-2xl opacity-50 border-b-2 pb-2 w-full text-center mb-3">TOTAL CUSTOMERS</p><p className="text-5xl text-center text-sageGreen">{totalUsers}</p></section>
			<section className="bg-khaki border-l-5 border-brown p-3 shadow-2xl rounded-lg w-full flex flex-col auto-rows-auto" ><p className="text-2xl opacity-50 border-b-2 pb-2 w-full text-center mb-3">TOTAL SALES</p><p className="text-5xl text-center text-sageGreen">₱ 3,289</p></section>
			<section className="bg-khaki border-l-5 border-brown p-3 shadow-2xl rounded-lg w-full flex flex-col auto-rows-auto" ><p className="text-2xl opacity-50 border-b-2 pb-2 w-full text-center mb-3">OUT OF STOCKS</p><p className="text-5xl text-center text-sageGreen">2</p></section>

			{/* Inventory Section */}
			<section className="backdrop-blur-2xl bg-khaki border-l-5 border-brown p-2 shadow-2xl rounded-lg w-full h-full flex col-span-4 flex-col" >
				<p className="text-2xl opacity-70 w-full text-center mb-3">INVENTORY</p><p onClick={()=> setShowAddRiceModal(true)}  className="absolute bg-brown right-5 top-3 text-offwhite p-1 px-10 rounded-lg hover:scale-105 active:scale-95 font-semibold text-center cursor-pointer" >Add Rice</p>
				<input type="text" placeholder="Search rice"  className="absolute p-1 rounded top-2 left-2 border border-neutral-900/50 hover:border-neutral-900 focus:outline-1 w-[30%]" />
				<table>
					<thead className="border-b-2 border-neutral-900/50 border-t-2 text-xl text-sageGreen">
						<tr>
							<th>Name</th>
							<th>Company</th>
							<th>Category</th>
							<th>Weight (kg)</th>
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
								<td>{rice.weightKG}</td>
								<td>₱ {rice.price}</td>
								<td>{rice.stock}</td>
								<td>{rice.rating}</td>
								<td>{rice.stock > 0 ? 'Available' : 'No Stock'}</td>
								<td className="flex-row flex justify-center">
									<p className=" text-xl p-1 rounded-lg hover:text-blue-500 hover:scale-110 font-semibold cursor-pointer" ><FontAwesomeIcon icon={faEdit} onClick={()=> {setShowEditRiceModal(true); setSelectedRice(rice)}} /></p>
									<p className=" text-xl p-1 rounded-lg hover:text-red-500 hover:scale-110 font-semibold cursor-pointer" ><FontAwesomeIcon icon={faTrash} onClick={()=> {setShowDeleteRiceModal(true); setSelectedRice(rice)}} /></p>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
			
			{/* Category Section */}
			<section className=" bg-khaki border-l-5 border-brown p-2 shadow-2xl rounded-lg w-full h-full flex col-span-4 flex-col relative" >
				<p className="text-2xl opacity-70 border-b-2 pb-2 w-full text-center mb-3">CATEGORY</p>
				<p onClick={()=> setShowAddCategoryModal(true)}  className=" bg-brown absolute right-5 top-3 text-offwhite p-1 px-8 rounded-lg hover:scale-105 active:scale-95 font-semibold text-center cursor-pointer" >Add Category</p>
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
										<p className=" text-xl p-1 rounded-lg hover:text-blue-500 hover:scale-110 font-semibold cursor-pointer" ><FontAwesomeIcon icon={faEdit} onClick={()=> {setShowEditCategoryModal(true); setSelectedCategory(category)}} /></p>
										<p className=" text-xl p-1 rounded-lg hover:text-red-500 hover:scale-110 font-semibold cursor-pointer" ><FontAwesomeIcon icon={faTrash} onClick={()=> {setShowDeleteCategoryModal(true); setSelectedCategory(category)}} /></p>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* User Section */}
			<section className="backdrop-blur-2xl bg-khaki border-l-5 border-brown p-2 shadow-2xl rounded-lg w-full h-full flex col-span-4 flex-col" >
				<p className="text-2xl opacity-70 w-full text-center mb-3">USER</p><p onClick={()=> setShowAddRiceModal(true)}  className="absolute bg-brown right-5 top-3 text-offwhite p-1 px-10 rounded-lg hover:scale-105 active:scale-95 font-semibold text-center cursor-pointer" >Add User</p>
				<input type="text" placeholder="Search user"  className="absolute p-1 rounded top-2 left-2 border border-neutral-900/50 hover:border-neutral-900 focus:outline-1 w-[30%]" />
				<table>
					<thead className="border-b-2 border-neutral-900/50 border-t-2 text-xl text-sageGreen">
						<tr>
							<th>User Name</th>
							<th>Password</th>
							<th>Email</th>
							<th>Admin</th>
							<th>Adress</th>
							<th>Image Path</th>
						</tr>
					</thead>
					<tbody className="text-center">
						{users.map((user) => (
							<tr key={user.id} className="border-b border-gray-400/20 hover:bg-neutral-400/20">
								<td>{user.userName}</td>
								<td>{user.password}</td>
								<td>{user.email}</td>
								<td>{String(user.isAdmin)}</td>
								<td>{user.address}</td>
								<td>{user.imagePath}</td>
								<td className="flex-row flex justify-center">
									<p className=" text-xl p-1 rounded-lg hover:text-blue-500 hover:scale-110 font-semibold cursor-pointer" ><FontAwesomeIcon icon={faEdit}/></p>
									<p className=" text-xl p-1 rounded-lg hover:text-red-500 hover:scale-110 font-semibold cursor-pointer" ><FontAwesomeIcon icon={faTrash} onClick={()=> {setShowDeleteRiceModal(true); setSelectedRice(rice)}} /></p>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</main>
   )
}
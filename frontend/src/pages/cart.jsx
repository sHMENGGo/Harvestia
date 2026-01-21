import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { use, useState, useEffect } from "react"
import { apiDelete, apiGet } from "../components/api"
import toast from "react-hot-toast"
import Toaster from "../components/toaster"

export default function cart({}) {
   // Refresh cart items
   const [refresh, set_refresh] = useState(false)

   // Handle remove or buy all buttons visibility
   const [multiple_action, set_multiple_action] = useState(false)

   // Get cart items
   const [cart_items, set_cart_items] = useState([])
   useEffect(()=> {
      apiGet('/getCart').then((data)=> {set_cart_items(data.cart_items)})
   }, [refresh])

   // Select all checkbox
   function select_all(e) {
      const isChecked = e.target.checked
      if(isChecked) {set_multiple_action(true)} else {set_multiple_action(false)}
      const updated_items = cart_items.map((item)=> ({...item, isChecked: isChecked}))
      set_cart_items(updated_items)
   }

   // Select individual checkbox
   function select_item(e, id) {
      if(e.target.checked) {set_multiple_action(true)} else {set_multiple_action(false)}
      const updated_items = cart_items.map(item => item.id === id ? {...item, isChecked: !item.isChecked} : item)
      set_cart_items(updated_items)
   }
   // Remove individual item
   function remove_item(id) {
      apiDelete('/removeItem', {item_id: id}).then((data)=> {
         if(data.success){
         toast.success('Item removed from cart')
         set_refresh(prev => !prev)}
      })
   }

   // Remove all selected items
   function remove_all() {
      const item_ids = cart_items.filter(item => item.isChecked).map(item => item.id)
      apiDelete('/removeMultipleItems', {item_ids: item_ids}).then((data)=> {
         if(data.success){
         toast.success('Selected items removed from cart')
         set_refresh(prev => !prev)}
      })
   }

   return (
      <main className="h-full relative p-4 box-border" >
			<section className="h-full w-full bg-khaki rounded-2xl flex p-4 gap-4 relative flex-col" >
            <div className="flex justify-between" >
               <h1 className="text-2xl text-sageGreen font-semibold" >Cart</h1>
               <input type="text" placeholder="Search product"  className=" p-1 h-10 place-self-end rounded-xl border border-neutral-900/50 hover:border-neutral-900 focus:outline-1 w-[30%]" />
            </div><br />
            <div className="place-self-end gap-4 flex" >
               {multiple_action && (
                  <>
                  <button onClick={remove_all}  className="rounded-lg bg-brown p-1 px-2 text-offwhite" >Remove all selected</button>
                  <button className="bg-sageGreen p-1 px-2 rounded-lg text-offwhite" >Buy all selected</button>
                  </>
               )}
               <input type="checkbox" onChange={select_all} id="select_all" className="scale-150 ml-5" />
               <label htmlFor="select_all" className="text-lg -ml-2 p-1" >Select All</label>
            </div>
            <div className="w-full flex flex-wrap gap-4 overflow-auto p-1 no-scrollbar" >
               {/* product cards */}
               {cart_items.map((item)=> (
                  <div key={item.id}  className="w-[32%] h-fit bg-khaki shadow-[0_0_4px_black] rounded-lg flex justify-start items-start relative" >
                     <div className="w-1/2 h-full rounded-l-lg" ><img src={item.rice.image_path} alt='Rice image' className="h-full place-self-center aspect-square rounded-l-lg" /></div>
                     <div className="w-1/2 right-0 h-full p-2 relative gap-1 flex flex-col justify-start">
                        <p className="text-xl font-semibold">{item.rice.name}</p>
                        <p className="opacity-80">{item.rice.company}</p>
                        <p className="opacity-80">{item.weight} kg</p>
                        <div className="flex justify-between" >
                           <p className="opacity-80" >Quantity: {item.quantity}</p>
                           <p className="text-sageGreen font-semibold">₱ {item.price}</p>
                        </div>
                        <div className="flex relative justify-between items-end" >
                           <button onClick={(e)=> {remove_item(item.id);e.stopPropagation()}} className="underline" >Remove</button>
                           <button onClick={(e)=> e.stopPropagation()}  className="bg-brown p-1 px-2 text-offwhite rounded-lg" >Buy Now</button>
                        </div>
                     </div>
                     <input type="checkbox" checked={item.isChecked} onChange={(e)=> select_item(e, item.id)} onClick={(e)=> e.stopPropagation()}  className="scale-150 absolute left-2 top-2" />
                  </div>
               ))}
            </div>
			</section>
      <Toaster/>
		</main>
   )
}
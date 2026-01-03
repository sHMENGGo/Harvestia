import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faCartArrowDown, faStar, faUser } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { apiPost } from "../components/api"
import toast, { Toaster } from "react-hot-toast"

export default function riceInfo({selected_rice, user}) {
   const navigate = useNavigate()

   // Add to cart
   function add_to_cart(selected_rice) {
      apiPost('/addToCart', {selected_rice}).then((data)=> {
         toast(data.message)
         set_add_to_cart(null)
      })
   }

   // Quantity changer
   const [quantity, set_quantity] = useState(1)
   function add_quantity() {set_quantity(quantity + 1)}
   function subtract_quantity() {if(quantity > 1) set_quantity(quantity - 1)}

   // Update price based on quantity
   const [price, set_price] = useState(selected_rice.price)
   useEffect(()=> {
      set_price(selected_rice.price * quantity)
   }, [quantity])

   return (
      <main className="h-full relative p-4 box-border" >
         <section className="h-fit bg-khaki rounded-2xl flex flex-col p-4 gap-4 relative" >
            <FontAwesomeIcon icon={faArrowLeft} className="text-4xl text-sageGreen cursor-pointer hover:scale-103 active:scale-100" onClick={()=> navigate('/home')} />
            {/* Details */}
            <div className="flex relative">
               <div className="w-1/3 h-full rounded-lg" ><img src={selected_rice.image_path} alt='No image available' className="h-full w-full object-cover rounded-lg" /></div>
               <div className="w-2/3 h-1/4 grid grid-cols-2 auto-rows-max grid-flow-col" >
                  <p className="text-5xl font-bold col-start-1">{selected_rice.name}</p>
                  <p className="text-2xl col-start-1 mb-10">{selected_rice.company}</p><br />
                  <p className="text-4xl font-semibold col-start-1 mb-5">{selected_rice.is_25kg ? 25 : selected_rice.is_50kg ? 50 : selected_rice.weight_kg} KG</p>
                  <p className="text-4xl text-sageGreen font-semibold col-start-1 mb-10">₱{price}</p><br />
                  <p className="text-2xl col-start-1" ><FontAwesomeIcon icon={faStar} className="text-yellow-500"/> 3.5</p>
                  <p className="text-2xl opacity-80 col-start-1" >2421 Sold</p>
                  <div className="border row-start-3" >
                     {selected_rice.is_25kg && (<p className="text-xl border rounded" >25 kg Available</p>)}
                  </div>
                  <div className="flex justify-between w-2/5 h-fit p-1 text-xl font-semibold border-2 border-brown rounded-full row-start-4 ml-[60%]" >
                     <button onClick={subtract_quantity} className="w-1/3" >-</button>
                     <p className="w-1/2 text-center ponter select-none border-x border-neutral-950/30" >{quantity}</p>
                     <button onClick={add_quantity}  className="w-1/3" >+</button>
                  </div>
                  <div className=" flex justify-between row-start-5 row-span-2 -ml-[30%]" >
                     <button  className="p-3 px-12 bg-brown rounded-xl text-2xl text-offwhite" >Buy Now</button>
                     <button onClick={()=> {add_to_cart(selected_rice)}}  className="p-3 ml-5 px-8 bg-sageGreen rounded-xl text-2xl text-offwhite" ><FontAwesomeIcon icon={faCartArrowDown} className="text-offwhite" />Add To Cart</button>
                  </div>
               </div>
            </div>
            {/* Description */}
            <div className="flex flex-col text-neutral-800">
               <h1 className="text-lg font-semibold">Description</h1>
               {selected_rice.description ? (<p className="inset-shadow-neutral-700 inset-shadow-[0_0_3px] rounded-xl p-2" >{selected_rice.description}</p>) : (<p className="inset-shadow-neutral-700 inset-shadow-[0_0_3px] rounded-xl p-2 text-center text-neutral-500" >No description</p>)}
            </div>
            {/* Reviews */}
            <div>
               <h1 className="text-lg font-semibold">Reviews</h1>
               <div className="p-2 flex flex-col gap-3" >
                  {/* Reviews Cards */}
                  <div className="rounded-lg shadow-[0_0_2px] p-2 flex flex-col" >
                     <div className="flex" >
                        <FontAwesomeIcon icon={faUser} className="text-2xl text-sageGreen" />
                        <p className="font-semibold text-xl ml-2">Juan Dela Cruz</p>
                        <p className="text-xl font-semibold ml-2" ><FontAwesomeIcon icon={faStar} className="text-yellow-500"/>4</p>
                     </div><br />
                     <p className="" >Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, porro quam sit fuga debitis iure. Obcaecati commodi maxime ipsam nobis, error quisquam officia et, inventore eaque possimus voluptates provident ratione?</p>
                  </div>

                  <div className="rounded-lg shadow-[0_0_2px] p-2 flex flex-col" >
                     <div className="flex" >
                        <FontAwesomeIcon icon={faUser} className="text-2xl text-sageGreen" />
                        <p className="font-semibold text-xl ml-2">Juan Dela Cruz</p>
                        <p className="text-xl font-semibold ml-2" ><FontAwesomeIcon icon={faStar} className="text-yellow-500"/>4</p>
                     </div><br />
                     <p className="" >Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus, porro quam sit fuga debitis iure. Obcaecati commodi maxime ipsam nobis, error quisquam officia et, inventore eaque possimus voluptates provident ratione?</p>
                  </div>
               </div>
            </div>

         <Toaster/>
         </section>
      </main>
   )
}
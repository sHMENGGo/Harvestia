import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faCartArrowDown, faStar, faUser } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { apiPost } from "../components/api"
import toast, { Toaster } from "react-hot-toast"

export default function riceInfo({selected_rice, user}) {
   const navigate = useNavigate()

  

   // Quantity changer
   const [quantity, set_quantity] = useState(1)
   function add_quantity() {set_quantity(quantity + 1)}
   function subtract_quantity() {if(quantity > 1) set_quantity(quantity - 1)}

   // Available weights
   const [weights, set_weights] = useState([])
   const [displayed_weight, set_displayed_weight] = useState()
   const [selected_weight, set_selected_weight] = useState()
   useEffect(()=> {
      let available_weights = []
      if(selected_rice.is_25kg) available_weights.push(25)
      if(selected_rice.is_50kg) available_weights.push(50)
      if(selected_rice.weight_kg) available_weights.push(selected_rice.weight_kg)
      set_weights(available_weights)
      set_displayed_weight(available_weights[0])
      set_selected_weight(available_weights[0])
   }, [selected_rice])

   // Update price based on quantity and weight
   const [price, set_price] = useState(selected_rice.price)
   useEffect(()=> {
      set_price(selected_rice.price * quantity)
      if(selected_weight) {
         set_displayed_weight(selected_weight)
         if(weights.includes(50) && selected_weight === 50) {
            set_price(prev => prev * 2)
         }
      }
   }, [quantity, selected_weight])

   // Get reviews for the selected rice
   const [reviews, set_reviews] = useState([])
   useEffect(()=> {
      apiPost('/getReviews', {rice_id: selected_rice.id}).then((data)=> {
         set_reviews(data.reviews)
      })
   }, [selected_rice])

   // Add to cart
   function add_to_cart(selected_rice) {
      apiPost('/addToCart', {selected_rice, price, quantity, selected_weight}).then((data)=> {
         toast(data.message)
         set_price(selected_rice.price)
         set_quantity(1)
         set_selected_weight(weights[0])
      })
   }
   
   return (
      <main className="h-full relative p-4 box-border" >
         <section className="h-fit bg-khaki rounded-2xl flex flex-col p-4 gap-4 relative" >
            <FontAwesomeIcon icon={faArrowLeft} className="text-4xl text-sageGreen cursor-pointer hover:scale-103 active:scale-100" onClick={()=> navigate('/home')} />
            {/* Selected rice details */}
            <div className="flex relative">
               <div className="w-1/3 h-full rounded-lg" ><img src={selected_rice.image_path} alt='No image available' className="h-full w-full object-cover rounded-lg" /></div>
               <div className="w-2/3 h-1/4 grid grid-cols-2 auto-rows-max grid-flow-col" >
                  <p className="text-5xl font-bold col-start-1">{selected_rice.name}</p>
                  <p className="text-2xl col-start-1 mb-10">{selected_rice.company}</p><br />
                  <p className="text-2xl col-start-1 mb-5" >{selected_rice.category?.name}</p>
                  <p className="text-4xl font-semibold col-start-1 mb-5">{displayed_weight} KG</p>
                  <p className="text-4xl text-sageGreen font-semibold col-start-1 mb-10">₱{price}</p><br />
                  <p className="text-2xl col-start-1" ><FontAwesomeIcon icon={faStar} className="text-yellow-500"/> 3.5</p>
                  <p className="text-2xl opacity-80 col-start-1" >2421 Sold</p>
                  {/* Weight Options */}
                  <div className="row-start-4 wrap gap-1 flex justify-end" >
                     {weights.map((weight, index)=> (
                        <button key={index} onClick={()=> set_selected_weight(weight)}  className={` ${displayed_weight === weight ? 'border-2 border-sageGreen' : 'border-none'} px-3 py-1 h-fit bg-brown rounded-full text-offwhite`} >{weight} KG</button>
                     ))}
                  </div>
                  {/* Quantity Selector */}
                  <div className="flex justify-between w-2/5 h-fit p-1 text-xl font-semibold border-2 border-brown rounded-full row-start-5 ml-[60%]" >
                     <button onClick={subtract_quantity} className="w-1/3" >-</button>
                     <p className="w-1/2 text-center ponter select-none border-x border-neutral-950/30" >{quantity}</p>
                     <button onClick={add_quantity}  className="w-1/3" >+</button>
                  </div>
                  <div className=" flex justify-between row-start-6 row-span-2 -ml-[30%]" >
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
            <div className="" >
               <h1 className="text-lg font-semibold">Reviews</h1>
               <div className="flex flex-col gap-3" >
                  {/* Reviews Cards */}
                  {reviews.length > 0 ? reviews.map((review)=> (
                     <div key={review.id}  className="rounded-lg shadow-[0_0_2px] p-2 flex flex-col" >
                        <div className="flex" >
                           {review.user.image_path ? <img src={review.user.image_path} alt="No image" className="w-10 h-10 rounded-full object-cover"/> : <FontAwesomeIcon icon={faUser} className="text-2xl text-sageGreen" />}
                           <p className="font-semibold text-xl ml-2">{review.user.username}</p>
                           <p className="text-xl font-semibold ml-2" >
                              {/* Create empty array with the size of review.rating value */}
                              {Array.from({length: review.rating}, (_, i) => (
                                 <FontAwesomeIcon key={i} icon={faStar} className="text-yellow-500"/>
                              ))}
                           </p>
                        </div><br />
                        <p className="" >{review.comment}</p>
                     </div>
                  )) : (<p className="inset-shadow-neutral-700 inset-shadow-[0_0_3px] rounded-xl p-2 text-center text-neutral-500" >No reviews</p>)}
               </div>
            </div>

         <Toaster/>
         </section>
      </main>
   )
}
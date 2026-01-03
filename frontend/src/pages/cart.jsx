import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function cart({}) {
   const [cart_items, set_cart_items] = useState([])

   return (
      <main className="h-full relative p-4 box-border" >
			<section className="h-full w-full bg-khaki rounded-2xl flex p-4 gap-4 relative flex-col" >
            <div className="flex justify-between" >
               <h1 className="text-2xl text-sageGreen font-semibold" >Cart</h1>
               <input type="text" placeholder="Search product"  className=" p-1 h-10 place-self-end rounded border border-neutral-900/50 hover:border-neutral-900 focus:outline-1 w-[30%]" />
            </div><br />
            <div className="place-self-end" >
               <input type="checkbox" id="select_all" className="scale-150" />
               <label htmlFor="select_all" className="text-lg pl-2" >Select All</label>
            </div>
            <div className="w-full flex flex-wrap gap-4 overflow-auto p-1 no-scrollbar" >
               {/* product cards */}
               <div  className="w-[32%] h-fit bg-khaki shadow-[0_0_4px_black] rounded-lg flex justify-start items-start relative cursor-pointer" >
                  <div className="w-1/2 h-full rounded-l-lg" ><img src="img.png" alt='No image available' className="h-full place-self-center aspect-square rounded-l-lg" /></div>
                  <div className="w-1/2 right-0 h-full p-2 relative gap-1 flex flex-col justify-start">
                     <p className="text-xl font-semibold">rice name</p>
                     <p className="opacity-80">company</p>
                     <p className="opacity-80">25 kg</p>
                     <p className="text-sageGreen font-semibold">₱ 1500</p>
                     <div className="flex justify-between relative" >
                        <button onClick={(e)=> e.stopPropagation()}  className="bg-brown p-1 px-2 text-offwhite rounded" >Buy Now</button>
                        <input type="checkbox" onClick={(e)=> e.stopPropagation()}  className="scale-150 absolute right-1 bottom-1" />
                     </div>
                  </div>
               </div>

            </div>
			</section>
		</main>
   )
}
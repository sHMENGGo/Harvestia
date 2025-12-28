import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowLeft, faCartArrowDown, faStar, faUser } from "@fortawesome/free-solid-svg-icons"


export default function riceInfo({selected_rice}) {
   return (
      <main className="h-full relative p-4 box-border" >
         <section className="h-fit bg-khaki rounded-2xl flex flex-col p-4 gap-4 relative" >
            <FontAwesomeIcon icon={faArrowLeft} className="text-4xl text-sageGreen" />
            {/* Details */}
            <div className="flex">
               <div className="w-1/3 h-full rounded-lg" ><img src={selected_rice.image_path} alt='No image available' className="h-full w-full object-cover rounded-lg" /></div>
               <div className="w-2/3 h-full flex flex-col gap-3 relative" >
                  <p className="text-5xl font-bold">{selected_rice.name}</p>
                  <p className="text-2xl">{selected_rice.company}</p><br />
                  <p className="text-4xl font-semibold">{selected_rice.weight_kg} KG</p>
                  <p className="text-4xl text-sageGreen font-semibold">₱{selected_rice.price}</p><br />
                  <p className="text-2xl" ><FontAwesomeIcon icon={faStar} className="text-yellow-500"/> 3.5</p>
                  <p className="text-2xl opacity-80" >2421 Sold</p>
                  <div className=" flex justify-end absolute bottom-0 right-0" >
                     <button className="p-3 px-12 bg-brown rounded-xl text-2xl text-offwhite"  >Buy Now</button>
                     <button className="p-3 ml-5 px-8 bg-sageGreen rounded-xl text-2xl text-offwhite" ><FontAwesomeIcon icon={faCartArrowDown} className="text-offwhite" />Add To Cart</button>
                  </div>
               </div>
            </div>
            {/* Description */}
            <div className="flex flex-col text-neutral-800">
               <h1 className="text-lg font-semibold">Description</h1>
               <p className="inset-shadow-neutral-700 inset-shadow-[0_0_3px] rounded-xl p-2" >Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est architecto, inventore molestiae ducimus earum illum perspiciatis veniam harum eligendi sapiente fugit esse, aperiam numquam perferendis ipsum sequi similique distinctio unde.</p>
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
         </section>
      </main>
   )
}
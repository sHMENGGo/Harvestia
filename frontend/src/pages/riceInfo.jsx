
export default function riceInfo({selectedRice}) {
   return (
      <main className="h-full relative p-4 box-border" >
         <section className="h-full bg-khaki rounded-2xl flex p-4 gap-4 relative" >
            <div className="w-1/3 h-full rounded-lg" >
               <img src={selectedRice.imagePath} alt='No image available' className="h-full w-full object-cover rounded-lg" />
            </div>
            <div className="w-2/3 h-full flex flex-col gap-4" >
               <h1 className="text-4xl font-bold">{selectedRice.name}</h1>
               <p className="text-xl font-semibold">Company: {selectedRice.company}</p>
               <p className="text-xl font-semibold">Weight: {selectedRice.weightKG} kg</p>
               <p className="text-xl font-semibold">Price: ₱ {selectedRice.price}</p>
               <p className="text-lg">{selectedRice.description}</p>
            </div>
         </section>
      </main>
   )
}
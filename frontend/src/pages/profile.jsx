import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faEdit } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import imageCompression from "browser-image-compression"
import { apiPut } from "../components/api"

export default function profile({user, set_show_logout_modal, options, set_refresh}) {
   const [edit_mode, set_edit_mode] = useState(false)
   const [show_purchase, set_show_purchase] = useState('history')

   // Edit profile update states
   const [new_username, set_new_username] = useState(user.username)
   const [new_password, set_new_password] = useState(user.password)
   const [new_email, set_new_email] = useState(user.email)
   const [new_address, set_new_address] = useState(user.address)
   const [new_picture_preview, set_new_picture_preview] = useState(user.image_path)
   const [new_picture_file, set_new_picture_file] = useState(null)
   useEffect(() => {
      if(!user) return
      set_new_username(user.username)
      set_new_password(user.password)
      set_new_email(user.email)
      set_new_address(user.address)
      set_new_picture_preview(user.image_path)
   }, [user])
   // Change new picture when uploaded picture changed
   async function new_picture_on_change(e) {
      const image = e.target.files[0]
      const squaredImage = await imageCompression(image, options)
      if(squaredImage) {
         URL.revokeObjectURL(new_picture_preview)
         set_new_picture_preview(URL.createObjectURL(squaredImage))
         set_new_picture_file(squaredImage)
      }
   }

   // Edit info function
   function edit_profile() {
      const formData = new FormData()
      formData.append('new_username', new_username || '')
      formData.append('new_password', new_password || '')
      formData.append('new_email', new_email || '')
      formData.append('new_address', new_address || '')
      formData.append('user_id', user.id)
      formData.append('old_picture_id', user.image_public_id || null)
      formData.append('new_picture_file', new_picture_file || null)
      apiPut('/editProfile', formData).then((data)=> {
         alert(data.message)
         set_refresh(prev => !prev)
         set_edit_mode(false)
      })
   }

   // Reset credentials when cancel edit mode
   function cancel_edit_mode() {
      set_new_username(user.username)
      set_new_password(user.password)
      set_new_email(user.email)
      set_new_address(user.address)
      set_new_picture_preview(user.image_path)
      set_new_picture_file(null)
      set_edit_mode(false)
   }

   return (
      <main className="h-full relative p-4 box-border">
         <section className="h-full bg-khaki rounded-2xl flex p-4 gap-4 relative" >
            {/* Purchases */}
            <div className="w-1/2 flex flex-col justify-center items-center" >
               <h1 className="text-2xl text-sageGreen font-semibold place-self-start" >My Purchases</h1><br />
               <div className=" w-full flex justify-around" >
                  <button onClick={()=> set_show_purchase('history')}  className={`${show_purchase === 'history' ? 'border-b-2 font-semibold' : ''} text-brown `} >Purchase History</button>
                  <button onClick={()=> set_show_purchase('pay')}  className={`${show_purchase === 'pay' ? 'border-b-2 font-semibold' : ''} text-brown`} >To Pay</button>
                  <button onClick={()=> set_show_purchase('ship')}  className={`${show_purchase === 'ship' ? 'border-b-2 font-semibold' : ''} text-brown`} >To Ship</button>
                  <button onClick={()=> set_show_purchase('receive')}  className={`${show_purchase === 'receive' ? 'border-b-2 font-semibold' : ''} text-brown`} >To Receive</button>
                  <button onClick={()=> set_show_purchase('rate')}  className={`${show_purchase === 'rate' ? 'border-b-2 font-semibold' : ''} text-brown`} >To Rate</button>
               </div>
               <div className=" w-full h-full flex justify-center items-center" >
                  {show_purchase === 'history' && (<p className="text-3xl opacity-50" >No purchase history</p>)}
                  {show_purchase === 'pay' && (<p className="text-3xl opacity-50" >No orders to pay</p>)}
                  {show_purchase === 'ship' && (<p className="text-3xl opacity-50" >No orders to ship</p>)}
                  {show_purchase === 'receive' && (<p className="text-3xl opacity-50" >No orders to receive</p>)}
                  {show_purchase === 'rate' && (<p className="text-3xl opacity-50" >No orders to rate</p>)}
               </div>
            </div>
            {/* User credentials */}
            <button onClick={()=> set_show_logout_modal(true)}  className="p-1 px-4 rounded-full bg-brown text-offwhite right-4 absolute" >Logout</button>
            <form onSubmit={(e)=> {edit_profile(); e.preventDefault()}}  className="w-1/2 flex flex-col items-center gap-2 border-l border-sageGreen-50 pl-4" >
               <h1 className="text-2xl text-sageGreen font-semibold place-self-start" >Personal Information</h1>
               <div className="border-sageGreen relative border-2 bg-khaki w-1/2 rounded-full aspect-square flex justify-center items-center" >
                  {user.image_path ? <img src={new_picture_preview}  className='w-full h-full rounded-full absolute' /> : <FontAwesomeIcon icon={faUser} className='absolute text-sageGreen text-9xl' />}
               </div>
               <label htmlFor="photoUpload"  className={`${edit_mode ? 'opacity-100' : 'opacity-70'} text-sm text-offwhite w-1/5 flex items-center justify-center bg-brown p-1 rounded-lg cursor-pointer hover:scale-103 active:scale-100`} >Upload photo</label>
               <input type="file" id="photoUpload" disabled={!edit_mode} onChange={(e)=> new_picture_on_change(e)}  className=" hidden" />
               <div className="w-full flex items-center">
                  <label htmlFor="name">Username: </label>
                  <input type="text" value={new_username} onChange={edit_mode ? (e)=> set_new_username(e.target.value) : null} id="name"  className={`${edit_mode ? 'opacity-100' : 'opacity-70'} ml-2 flex-1 border rounded-3xl p-1 px-3`} />
               </div>
               <div className=" w-full flex items-center">
                  <label htmlFor="pswrd">Password: </label>
                  <input type="password" value={new_password} onChange={edit_mode ? (e)=> set_new_password(e.target.value) : null} id="pswrd"  className={`${edit_mode ? 'opacity-100' : 'opacity-70'} ml-2 flex-1 border rounded-3xl p-1 px-3`} />
               </div>
               <div className=" w-full flex items-center">
                  <label htmlFor="email">Email: </label>
                  <input type="email" value={new_email} onChange={edit_mode ? (e)=> set_new_email(e.target.value) : null} id="email"  className={`${edit_mode ? 'opacity-100' : 'opacity-70'} ml-2 flex-1 border rounded-3xl p-1 px-3`} />
               </div>
               <div className=" w-full flex items-center">
                  <label htmlFor="address">Shipping Address: </label>
                  <textarea value={new_address} onChange={edit_mode ? (e)=> set_new_address(e.target.value) : null} id="address" className={`${edit_mode ? 'opacity-100' : 'opacity-70'} flex-1 h-20 border ml-2 p-1 rounded-lg`} ></textarea>
               </div>
               {edit_mode ? (
                  <div className="flex gap-4">
                     <input type="submit" className='bg-sageGreen bg-brown p-1 px-4  rounded-full bg-brown text-offwhite' />
                     <button onClick={()=> cancel_edit_mode()} className="p-1 px-4 bg-brown text-offwhite rounded-full" >Cancel</button>
                  </div>
               ) : (
                  <button onClick={()=> {edit_mode ? set_edit_mode(false) : set_edit_mode(true)}}  className={`${edit_mode ? 'bg-sageGreen' : 'bg-brown'} p-1 px-4  rounded-full bg-brown text-offwhite`} ><FontAwesomeIcon icon={faEdit}/> Edit Details</button>
               )}
            </form>
         </section>
      </main>
   )
}
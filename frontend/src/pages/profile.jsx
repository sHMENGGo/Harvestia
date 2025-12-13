import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faEdit } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import imageCompression from "browser-image-compression"
import { apiPut } from "../components/api"

export default function profile({user, setShowLogoutModal, options, setRefresh}) {
   const [editMode, setEditMode] = useState(false)

   const [showPurchase, setShowPurchase] = useState('history')

   // Edit profile update states
   const [newUserName, setNewUserName] = useState(user.userName)
   const [newPassword, setNewPassword] = useState(user.password)
   const [newEmail, setNewEmail] = useState(user.email)
   const [newAddress, setNewAddress] = useState(user.address)
   const [newPicturePreview, setNewPicturePreview] = useState(user.imagePath)
   const [newPictureFile, setNewPictureFile] = useState(null)
   useEffect(() => {
      if(!user) return
      setNewUserName(user.userName)
      setNewPassword(user.password)
      setNewEmail(user.email)
      setNewAddress(user.address)
      setNewPicturePreview(user.imagePath)
   }, [user])
   // Change new picture when uploaded picture changed
   async function newPictureOnChange(e) {
      const image = e.target.files[0]
      const squaredImage = await imageCompression(image, options)
      if(squaredImage) {
         URL.revokeObjectURL(newPicturePreview)
         setNewPicturePreview(URL.createObjectURL(squaredImage))
         setNewPictureFile(squaredImage)
      }
   }

   // Edit info function
   function editProfile() {
      const formData = new FormData()
      formData.append('newUserName', newUserName || '')
      formData.append('newPassword', newPassword || '')
      formData.append('newEmail', newEmail || '')
      formData.append('newAddress', newAddress || '')
      formData.append('userID', user.id)
      formData.append('oldPictureID', user.imagePublicID || null)
      formData.append('newPictureFile', newPictureFile || null)
      apiPut('/editProfile', formData).then((data)=> {
         alert(data.message)
         setRefresh(prev => !prev)
         setEditMode(false)
      })
   }

   return (
      <main className="h-full relative p-4 box-border">
         <section className="h-full bg-khaki rounded-2xl flex p-4 gap-4 relative" >
            {/* Purchases */}
            <div className="w-1/2 flex flex-col justify-center items-center" >
               <h1 className="text-2xl text-sageGreen font-semibold place-self-start" >My Purchases</h1><br />
               <div className=" w-full flex justify-around" >
                  <button onClick={()=> setShowPurchase('history')}  className={`${showPurchase === 'history' ? 'border-b-2 font-semibold' : ''} text-brown `} >Purchase History</button>
                  <button onClick={()=> setShowPurchase('pay')}  className={`${showPurchase === 'pay' ? 'border-b-2 font-semibold' : ''} text-brown`} >To Pay</button>
                  <button onClick={()=> setShowPurchase('ship')}  className={`${showPurchase === 'ship' ? 'border-b-2 font-semibold' : ''} text-brown`} >To Ship</button>
                  <button onClick={()=> setShowPurchase('receive')}  className={`${showPurchase === 'receive' ? 'border-b-2 font-semibold' : ''} text-brown`} >To Receive</button>
                  <button onClick={()=> setShowPurchase('rate')}  className={`${showPurchase === 'rate' ? 'border-b-2 font-semibold' : ''} text-brown`} >To Rate</button>
               </div>
               <div className=" w-full h-full flex justify-center items-center" >
                  {showPurchase === 'history' && (<p className="text-3xl opacity-50" >No purchase history</p>)}
                  {showPurchase === 'pay' && (<p className="text-3xl opacity-50" >No orders to pay</p>)}
                  {showPurchase === 'ship' && (<p className="text-3xl opacity-50" >No orders to ship</p>)}
                  {showPurchase === 'receive' && (<p className="text-3xl opacity-50" >No orders to receive</p>)}
                  {showPurchase === 'rate' && (<p className="text-3xl opacity-50" >No orders to rate</p>)}
               </div>
            </div>
            {/* User credentials */}
            <button onClick={()=> setShowLogoutModal(true)}  className="p-1 px-4 rounded-full bg-brown text-offwhite right-4 absolute" >Logout</button>
            <form onSubmit={(e)=> {editProfile(); e.preventDefault()}}  className="w-1/2 flex flex-col items-center gap-2 border-l border-sageGreen-50 pl-4" >
               <h1 className="text-2xl text-sageGreen font-semibold place-self-start" >Personal Information</h1>
               <div className="border-sageGreen relative border-2 bg-khaki w-1/2 rounded-full aspect-square flex justify-center items-center" >
                  {user.imagePath ? <img src={newPicturePreview}  className='w-full h-full rounded-full absolute' /> : <FontAwesomeIcon icon={faUser} className='absolute text-sageGreen text-9xl' />}
               </div>
               <label htmlFor="photoUpload"  className={`${editMode ? 'opacity-100' : 'opacity-70'} text-sm text-offwhite w-1/5 flex items-center justify-center bg-brown p-1 rounded-lg cursor-pointer hover:scale-103 active:scale-100`} >Upload photo</label>
               <input type="file" id="photoUpload" disabled={!editMode} onChange={(e)=> newPictureOnChange(e)}  className=" hidden" />
               <div className="w-full flex items-center">
                  <label htmlFor="name">Username: </label>
                  <input type="text" value={newUserName} onChange={editMode ? (e)=> setNewUserName(e.target.value) : null} id="name"  className={`${editMode ? 'opacity-100' : 'opacity-70'} ml-2 flex-1 border rounded-3xl p-1 px-3`} />
               </div>
               <div className=" w-full flex items-center">
                  <label htmlFor="pswrd">Password: </label>
                  <input type="password" value={newPassword} onChange={editMode ? (e)=> setNewPassword(e.target.value) : null} id="pswrd"  className={`${editMode ? 'opacity-100' : 'opacity-70'} ml-2 flex-1 border rounded-3xl p-1 px-3`} />
               </div>
               <div className=" w-full flex items-center">
                  <label htmlFor="email">Email: </label>
                  <input type="email" value={newEmail} onChange={editMode ? (e)=> setNewEmail(e.target.value) : null} id="email"  className={`${editMode ? 'opacity-100' : 'opacity-70'} ml-2 flex-1 border rounded-3xl p-1 px-3`} />
               </div>
               <div className=" w-full flex items-center">
                  <label htmlFor="address">Shipping Address: </label>
                  <textarea value={newAddress} onChange={editMode ? (e)=> setNewAddress(e.target.value) : null} id="address" className={`${editMode ? 'opacity-100' : 'opacity-70'} flex-1 h-20 border ml-2 p-1 rounded-lg`} ></textarea>
               </div>
               {editMode ? (
                  <input type="submit" className='bg-sageGreen bg-brown p-1 px-4  rounded-full bg-brown text-offwhite' />
               ) : (
                  <button onClick={()=> {editMode ? setEditMode(false) : setEditMode(true)}}  className={`${editMode ? 'bg-sageGreen' : 'bg-brown'} p-1 px-4  rounded-full bg-brown text-offwhite`} ><FontAwesomeIcon icon={faEdit}/> Edit Details</button>
               )}
            </form>
         </section>
      </main>
   )
}
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faEdit } from "@fortawesome/free-solid-svg-icons"
import { useState } from "react"
import { apiPut } from "../components/api"

export default function profile({user}) {
   console.log('user: ', user)

   const [editMode, setEditMode] = useState(false)
   const [newUserName, setNewUserName] = useState(user.userName)
   const [newPswrd, setNewPswrd] = useState(user.password)
   const [newEmail, setNewEmail] = useState(user.email)
   const [newAddress, setNewAddress] = useState(user.address)

   return (
      <main className="h-full relative p-4 box-border">
         <section className="h-full bg-khaki rounded-2xl grid grid-cols-2 grid-rows-10 p-4 relative" >
            <div className="border-sageGreen relative place-self-center border-2 bg-khaki row-span-5 w-1/2 rounded-full aspect-square flex justify-center items-center" >
               <img src="img.jpg"  className='w-full h-full rounded-full' />
               <FontAwesomeIcon icon={faUser} className='absolute text-sageGreen text-9xl' />
            </div>
            <label htmlFor="photoUpload" className="text-sm col-start-1 place-self-center text-offwhite w-1/4 h-1/2 flex items-center justify-center bg-brown p-1 rounded-lg cursor-pointer hover:scale-105 active:scale-95" >Upload photo</label>
            <input type="file" id="photoUpload"  className=" hidden" /><br />
            <div className="w-full flex items-center col-start-1">
               <label htmlFor="name">Name: </label>
               <input type="text" value={newUserName} onChange={editMode ? (e)=> setNewUserName(e.target.value) : null} id="name"  className={`${editMode ? 'opacity-100' : 'opacity-70'} ml-2 flex-1 border rounded-3xl p-1 px-3`} />
            </div>
            <div className=" w-full flex items-center col-start-1">
               <label htmlFor="pswrd">Password: </label>
               <input type="password" value={newPswrd} onChange={editMode ? (e)=> setNewPswrd(e.target.value) : null} id="pswrd"  className={`${editMode ? 'opacity-100' : 'opacity-70'} ml-2 flex-1 border rounded-3xl p-1 px-3`} />
            </div>
            <div className=" w-full flex items-center col-start-1">
               <label htmlFor="email">Email: </label>
               <input type="email" value={newEmail} onChange={editMode ? (e)=> setNewEmail(e.target.value) : null} id="email"  className={`${editMode ? 'opacity-100' : 'opacity-70'} ml-2 flex-1 border rounded-3xl p-1 px-3`} />
            </div>
            <div className=" w-full flex items-center col-start-1">
               <label htmlFor="address">Shipping Address: </label>
               <input type="text" value={newAddress} onChange={editMode ? (e)=> setNewAddress(e.target.value) : null} id="address"  className={`${editMode ? 'opacity-100' : 'opacity-70'} ml-2 flex-1 border rounded-3xl p-1 px-3`} />
            </div>
            <button onClick={()=> {editMode ? setEditMode(false) : setEditMode(true)}}  className={`${editMode ? 'bg-sageGreen' : 'bg-brown'} p-1 w-1/4 h-full place-self-center text-lg rounded-full col-start-1 bg-brown text-offwhite hover:scale-105 active:scale-95`} >{editMode ? 'Save Changes' : 'Edit Details'}</button>
         </section>
      </main>
   )
}
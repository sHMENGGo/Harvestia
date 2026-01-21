import { Toaster } from "react-hot-toast"

export default function toaster() {
   return (
     <Toaster toastOptions={{
         duration: 1500,
         style: {
            background: '#af4c0f',
            color: '#FFFFFF',
            fontWeight: 'bold',
         }
      }}/>
   )
}

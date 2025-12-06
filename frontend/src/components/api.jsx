import axios from "axios"

export async function apiPost(url, data) {
   try {
      const res = await axios.post(`http://localhost:5000/api${url}`, data, {withCredentials:true})
      return res.data
   } catch(err) {
      console.error("Error posting data", err)
      return err.response.data
   }
}

export async function apiGet(url) {
   try {
      const res = await axios.get(`http://localhost:5000/api${url}`, {withCredentials:true})
      return res.data
   } catch(err) {console.error("Error fetching data", err)}
}

export async function apiDelete(url, data) {
   try {
      const res = await axios.delete(`http://localhost:5000/api${url}`, {data: data, withCredentials:true})
      return res.data
   } catch(err) {console.error("Error deleting data", err)}
}

export async function apiPut(url, data) {
   try {
      const res = await axios.put(`http://localhost:5000/api${url}`, data, {withCredentials:true})
      return res.data
   } catch(err) {console.error("Error putting data", err)}
}
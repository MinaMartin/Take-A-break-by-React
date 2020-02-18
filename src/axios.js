import axios from "axios"
const instance = axios.create({
    baseURL:"https://take-a-break-b6ab5.firebaseio.com/"
})

export default instance;
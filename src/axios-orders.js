import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-my-burger-a0248-default-rtdb.firebaseio.com/'
})

export default instance;
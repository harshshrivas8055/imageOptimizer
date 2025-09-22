import {configureStore} from '@reduxjs/toolkit'
import authSlice from './authSlice'
import imageSlice from './imageSlice'
const Store = configureStore({
    reducer:{
        auth:authSlice,
        image:imageSlice
    }
})

export default Store;
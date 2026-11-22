import {getAuth} from 'firebase-admin/auth'
import {User} from '../models/user.model.js'
import {app} from '../config/firebase.js'

export const login = async (req,res) => {
    try {
        const {token} = req.body
        const decoded = await getAuth(app).verifyIdToken(token)
        const user = await User.findOne



    } catch (error) {
        
    }

}
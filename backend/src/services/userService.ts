import User from "../models/User";
import bcrypt from "bcrypt";
import {where} from "sequelize";
import { UpdateUserData } from "../types/user";
const SALT = Number(process.env.BCRYPT_SALT_ROUNDS || 12);
const getInforUser = async (userId: number) => {
    try {
        const user = await User.findOne({
            where: {
                id: userId
            }, attributes: ["firstName", "lastName", "phone", "email"]
        });
        return user;
    } catch (error) {
        throw error;
    }
};

const updateInforUser = async (userId: number, data: UpdateUserData ) => {
   try{
       await User.update(data, {
           where: {
               id: userId
           }
       });
       return true;
   }
   catch(error){
    throw error;
   }   
};

const changePasswordUser = async (userId: number, currentPassword: string, newPassword: string) : Promise<boolean>  => {
    try {
        const user = await User.findByPk(userId);
        if (!user) throw new Error("User not found");
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) throw new Error("Current password is incorrect");
        const hashedNewPassword = await bcrypt.hash(newPassword, SALT);
        user.password = hashedNewPassword;
        await user.save();
        return true; 
    } catch (error) {
        throw error;
    }
};

export default {
    getInforUser,
    updateInforUser,
    changePasswordUser,
};
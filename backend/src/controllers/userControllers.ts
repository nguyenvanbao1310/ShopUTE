import { Request, Response, NextFunction } from "express";
import { User } from "../models/User"; 
import userService from "../services/userService";
import { AuthRequest } from "../middleware/auth";
const getInforUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id;
        const user = await userService.getInforUser(userId);
        res.json(user);
    } catch (error) {
        next(error);
    }
};


const updateInforUser = async (req: AuthRequest , res: Response, next: NextFunction) => {
    try {
       const userId = req.user.id; 
       const data = req.body;
       if ('role' in req.body || 'password' in req.body) {
           return res.status(400).json({ message: "Không được phép cập nhật trường này" });
       }
       const result = await userService.updateInforUser(userId, data);
       res.json({ message: "Cập nhật thông tin thành công!" });
    } catch (error) {
        next(error);
    }
};


const changePasswordUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
    const userId = req.user.id; 
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Missing password fields" });
    }
    await userService.changePasswordUser(userId, currentPassword, newPassword);
    return res.status(200).json({ success: true, message: "Password changed successfully" });
    } catch (error) {
        next(error);
    }
};

export default {
    getInforUser,
    updateInforUser,
    changePasswordUser,
};
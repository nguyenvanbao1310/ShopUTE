import { Model, Optional } from "sequelize";
export interface UserAttributes {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    otp?: string | null;
    otpExpire?: Date | null;
    role: "user" | "admin";
    createdAt?: Date;
    updatedAt?: Date;
}
export interface UserCreationAttributes extends Optional<UserAttributes, "id" | "createdAt" | "updatedAt"> {
}
export declare class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    otp: string | null;
    otpExpire: Date | null;
    role: "user" | "admin";
    readonly createdAt: Date;
    readonly updatedAt: Date;
}
export default User;
//# sourceMappingURL=User.d.ts.map
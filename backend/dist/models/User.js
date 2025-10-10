"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const configdb_1 = __importDefault(require("../config/configdb")); // chỉnh lại đường dẫn tới file config DB của bạn
// 3. Tạo class User kế thừa Sequelize Model
class User extends sequelize_1.Model {
}
exports.User = User;
// 4. Khởi tạo model với schema
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    phone: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: false,
    },
    gender: {
        type: sequelize_1.DataTypes.BOOLEAN,
        allowNull: true,
    },
    birthday: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
    },
    avatar_url: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    otp: {
        type: sequelize_1.DataTypes.STRING(10),
        allowNull: true,
    },
    otpExpire: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM("user", "admin"),
        allowNull: false,
        defaultValue: "user",
    },
    loyaltyPoints: {
        type: sequelize_1.DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
    },
}, {
    sequelize: configdb_1.default, // truyền kết nối DB
    tableName: "users",
    modelName: "User",
    timestamps: true, // để Sequelize tự sinh createdAt, updatedAt
});
exports.default = User;
//# sourceMappingURL=User.js.map
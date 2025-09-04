import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { logout } from "../store/authSlice";
import UserMenu from "./miniMenu";
  const Header = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        
        {/* Logo + Tên shop */}
        <Link to="/" className="text-2xl font-bold text-green-600">
          UTEShop
        </Link>

        {/* Điều hướng bên phải */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <UserMenu user={user} handleLogout={handleLogout} />
            </div>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-green-600">
                Login
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-green-600">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
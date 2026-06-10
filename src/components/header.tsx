import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { User, Handbag, Search, Menu, X } from "lucide-react";
import { Login } from "./login";
import { Register } from "./register";
import { useAuthModalStore } from "../stores/useAuthModeStore";
import { useAuthStore } from "../stores/useAuthStore";
import { getInitials } from "../utils/auth";
import { useLogout } from "../hooks/useAuth";

export const Header = () => {
  const { authMode, openLogin, close } = useAuthModalStore();

  const { user, isLoggedIn } = useAuthStore();

  const { handleLogout } = useLogout();

  const userInitial = getInitials(user?.userName ?? "");
  return (
    <>
      <header className="w-full pl-4 pr-4">
        <nav
          aria-label="Main navigation"
          className="grid grid-cols-3 h-20 md:h-24 items-center gap-2"
        >
          {/* =========================================LEFT SECTION: CATEGORIES */}
          {/* =======MOBILE ONLY: Dropdown Menu */}
          <div className="dropdown md:hidden">
            <button>
              <Menu />
            </button>

            {/* TODO: add link to dropdown header*/}
            <ul className="menu dropdown-content">
              <li>
                <NavLink to="/">Women</NavLink>
              </li>
              <li>
                <NavLink to="/">Men</NavLink>
              </li>
              <li>
                <NavLink to="/">Kid</NavLink>
              </li>
            </ul>
          </div>

          {/* =======DESKTOP ONLY: Tabs */}
          <div className="hidden md:flex tabs tabs-border">
            <input
              type="radio"
              name="my_tabs_2"
              className="tab"
              aria-label="Women"
            />
            <div className="tab-content border-base-300 bg-base-100 p-10 hidden">
              Women
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              className="tab"
              aria-label="Men"
              defaultChecked
            />
            <div className="tab-content border-base-300 bg-base-100 p-10 hidden">
              Men
            </div>

            <input
              type="radio"
              name="my_tabs_2"
              className="tab"
              aria-label="Kid"
            />
            <div className="tab-content border-base-300 bg-base-100 p-10 hidden">
              Kid
            </div>
          </div>

          {/* =========================================CENTER SECTION: LOGO */}
          <div className="flex justify-center">
            <Link to="" className="hover:text-gray-500 transition-colors">
              <img
                src={logo}
                className="h-20 md:h-24 w-auto"
                alt="XuXi E-commerce shop home"
              />
            </Link>
          </div>

          {/* =========================================RIGHT SECTION: UTILITIES */}
          {/* TODO: handle search and shopping cart features */}
          <div>
            <div className="flex flex-row items-center justify-end gap-2 md:gap-5">
              <Link
                to=""
                aria-label="Search products"
                className="hover:text-gray-500 transition-colors p-1 hover:cursor-pointer"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              </Link>
              <Link
                to=""
                aria-label="View Shopping Cart"
                className="hover:text-gray-500 transition-colors relative p-1 hover:cursor-pointer"
              >
                <Handbag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />

                {/* TODO: update product quantity */}
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 scale-75 md:scale-100">
                  0
                </span>
              </Link>

              {isLoggedIn ? (
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-ghost btn-circle avatar placeholder"
                  >
                    <div className="bg-neutral w-10 text-neutral-content rounded-full flex items-center justify-center">
                      <span className="font-semibold text-xl select-none">
                        {userInitial}
                      </span>
                    </div>
                  </div>
                  <ul
                    tabIndex={-1}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-40 p-2 shadow"
                  >
                    <li className="menu-title text-xs opacity-90">
                      Hi, {user?.userName}
                    </li>
                    {/* TODO: add link to profile */}
                    <li>
                      <a>Profile</a>
                    </li>
                    <li>
                      <button onClick={handleLogout}>Logout</button>
                    </li>
                  </ul>
                </div>
              ) : (
                <button
                  onClick={openLogin}
                  aria-label="Login"
                  className="hover:text-gray-500 transition-colors p-1 hover:cursor-pointer"
                >
                  <User className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* LOGIN MODAL */}
      <div
        data-testid="login-modal"
        className={`modal ${authMode === "login" ? "modal-open" : ""}`}
      >
        <div className="modal-box border border-base-300 bg-base-100">
          <button
            onClick={close}
            className="btn btn-sm btn-circle absolute right-2 top-2"
          >
            <X />
          </button>
          <Login />
        </div>
        <div className="modal-backdrop" onClick={close} />
      </div>

      {/* REGISTER MODAL */}
      <div className={`modal ${authMode === "register" ? "modal-open" : ""}`}>
        <div className="modal-box border border-base-300 bg-base-100">
          <Register />
        </div>
        <div className="modal-backdrop" onClick={close} />
      </div>
    </>
  );
};

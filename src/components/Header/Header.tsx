import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { User, Handbag, Search } from "lucide-react";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { useAuthStore } from "@/stores/useAuthStore";
import { getInitials } from "@/utils/auth";
import { useLogout } from "@/hooks/useAuth";
import { CategoryNav } from "./CategoryNav";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";

export const Header = () => {
  const { openLogin } = useAuthModalStore();

  const { user, isLoggedIn } = useAuthStore();
  const { handleLogout } = useLogout();

  const userInitial = getInitials(user?.username ?? "");
  return (
    <>
      <header className="w-full fixed top-0 z-50 bg-white">
        <nav
          aria-label="Main navigation"
          className="grid grid-cols-[1fr_auto_1fr] h-14 md:h-16 items-center gap-2 px-5"
        >
          {/* =========================================LEFT SECTION: CATEGORIES */}
          <CategoryNav />

          {/* =========================================CENTER SECTION: LOGO */}
          <div className="flex justify-center relative">
            <Link
              to="/"
              aria-label="XuXi E-commerce shop home"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hover:text-gray-500 transition-colors "
            >
              <img
                src={logo}
                className="h-20 md:h-24 max-w-none w-auto"
                alt="XuXi E-commerce shop home"
              />
            </Link>
          </div>

          {/* =========================================RIGHT SECTION: UTILITIES */}
          {/* TODO: handle search and shopping cart features */}
          <div>
            <div className="flex flex-row items-center justify-end gap-2 md:gap-3">
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
                      Hi, {user?.username}
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

        <LoginModal/>
        <RegisterModal/>
      </header>
    </>
  );
};

import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { User, Handbag, Search } from "lucide-react";
import { useAuthModalStore } from "@/features/auth/stores/useAuthModalStore";
import { useAuthStore } from "@/features/auth/stores/useAuthStore";
import { getInitials } from "@/features/auth/utils/auth";
import { useLogout } from "@/features/auth/hooks/useAuth";
import { CategoryNav } from "../features/category/components/CategoryNav";
import { LoginModal } from "../features/auth/components/LoginModal";
import { RegisterModal } from "../features/auth/components/RegisterModal";
import { useCartStore } from "@/features/cart/stores/useCartStore";
import { useGetCart } from "@/features/cart/hooks/useCart";
import { useMemo, useState } from "react";
import { SearchDrawer } from "@/components/SearchDrawer";

export const Header = () => {
  const { openLogin } = useAuthModalStore();
  const { user } = useAuthStore();
  const { mutate: handleLogout } = useLogout();
  const [isOpenSearchInput, setIsOpenSearchInput] = useState(false);

  const localCart = useCartStore((state) => state.cart);
  const localTotal = useMemo(
    () => localCart.reduce((sum, item) => sum + item.quantity, 0),
    [localCart],
  );

  const { data: dbCart } = useGetCart();
  const dbTotal = useMemo(
    () => (dbCart?.items ?? []).reduce((sum, item) => sum + item.quantity, 0),
    [dbCart?.items],
  );

  const userInitial = getInitials(user?.username ?? "");

  return (
    <>
      <header className="w-full fixed top-0 z-50 bg-white px-5">
        <nav
          aria-label="Main navigation"
          className="grid grid-cols-[1fr_auto_1fr] h-14 md:h-16 items-center gap-2 "
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
          <div>
            <div className="flex flex-row items-center justify-end gap-2 md:gap-3">
              <button
                type="button"
                aria-label="Search products"
                className="hover:text-gray-500 transition-colors p-1 hover:cursor-pointer"
                onClick={() => setIsOpenSearchInput(true)}
              >
                <Search className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
              </button>

              <Link
                to="/cart"
                aria-label="View Shopping Cart"
                className="hover:text-gray-500 transition-colors relative p-1 hover:cursor-pointer"
              >
                <Handbag className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />

                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 scale-75 md:scale-100">
                  {user ? dbTotal : localTotal}
                </span>
              </Link>

              {user ? (
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
                      <button
                        aria-label="logout"
                        onClick={() => handleLogout()}
                      >
                        Logout
                      </button>
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

        <SearchDrawer
          isOpen={isOpenSearchInput}
          onClose={() => setIsOpenSearchInput(false)}
        />

        <LoginModal />
        <RegisterModal />
      </header>
    </>
  );
};

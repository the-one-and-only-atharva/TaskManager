import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAuth } from "../../context/AuthContext.jsx";

const linkBase =
  "px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors";

function ActiveLink({ to, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `${linkBase} ${isActive ? "bg-white/10 text-white" : ""}`
      }
    >
      {children}
    </NavLink>
  );
}

const RouteTransition = ({ children }) => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
        animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
        exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export const withRouteTransition = (Component) => (props) =>
  (
    <RouteTransition>
      <Component {...props} />
    </RouteTransition>
  );

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const hideTimerRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (e.clientY <= 20) {
        setIsOpen(true);
        if (hideTimerRef.current) {
          clearTimeout(hideTimerRef.current);
          hideTimerRef.current = null;
        }
      } else if (!isHovering && !hideTimerRef.current) {
        hideTimerRef.current = setTimeout(() => {
          setIsOpen(false);
          hideTimerRef.current = null;
        }, 500);
      }
    };

    const handleKeyDown = (e) => {
      // Toggle with Cmd/Ctrl+K, close with Escape
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        setIsOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      if (hideTimerRef.current) {
        clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
    };
  }, [isHovering]);

  const onMouseEnterBar = () => {
    setIsHovering(true);
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  };
  const onMouseLeaveBar = () => {
    setIsHovering(false);
    if (!hideTimerRef.current) {
      hideTimerRef.current = setTimeout(() => {
        setIsOpen(false);
        hideTimerRef.current = null;
      }, 700);
    }
  };

  return (
    <div className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      {/* Hover/Touch reveal zone at very top (non-invasive, 20px) */}
      <div
        className="absolute inset-x-0 top-0 h-2 pointer-events-auto"
        onMouseEnter={() => setIsOpen(true)}
        onTouchStart={() => setIsOpen(true)}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { y: -16, opacity: 0 }}
            animate={reduceMotion ? { opacity: 1 } : { y: 0, opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { y: -16, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            onMouseEnter={onMouseEnterBar}
            onMouseLeave={onMouseLeaveBar}
            className="pointer-events-auto backdrop-blur-xl bg-black/40 border-b border-white/10"
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 h-14 flex items-center justify-between">
              <Link
                to="/"
                className="text-white font-semibold tracking-wide hover:opacity-90 transition-opacity"
              >
                TaskManager
              </Link>
              <nav className="flex items-center gap-2">
                <ActiveLink to="/">Home</ActiveLink>
                <ActiveLink to="/canvas">Canvas</ActiveLink>
                {!user && <ActiveLink to="/auth">Sign In</ActiveLink>}
                {user && (
                  <div className="flex items-center gap-2">
                    <ActiveLink to="/profile">Profile</ActiveLink>
                    <button
                      onClick={signOut}
                      className="px-3 py-2 rounded-lg bg-white/10 text-white/80 hover:text-white hover:bg-white/20 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

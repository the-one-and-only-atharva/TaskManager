import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import { Button, Card, FormField, Input } from "../components/ui/ui.jsx";
import bgImage from "../assets/background-gradient-lights.jpg";

function AssetCarousel() {
  const assetModules = useMemo(
    () => import.meta.glob("../assets/*.svg", { eager: true }),
    []
  );
  const assets = useMemo(() => {
    return Object.entries(assetModules)
      .map(([path, mod]) => {
        const url = mod?.default || mod;
        const name = path.split("/").pop();
        return { url, name };
      })
      .filter((a) => typeof a.url === "string");
  }, [assetModules]);

  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (assets.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % assets.length);
    }, 3000);
    return () => clearInterval(id);
  }, [assets.length]);

  if (assets.length === 0) return null;
  const current = assets[index];

  return (
    <div className="relative h-[380px] select-none">
      <AnimatePresence mode="wait">
        <motion.img
          key={current.url}
          src={current.url}
          alt={current.name || "asset"}
          className="absolute right-0 top-1/2 -translate-y-1/2 max-h-[320px] w-auto object-contain drop-shadow-[0_40px_80px_rgba(16,146,238,0.25)]"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </AnimatePresence>
      <div className="absolute right-24 top-8 h-24 w-24 rounded-full bg-orange-500/20 blur-2xl" />
      <div className="absolute right-10 bottom-6 h-20 w-20 rounded-full bg-red-400/15 blur-2xl" />
    </div>
  );
}

export default function Auth() {
  const { signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState(false);
  const [shake, setShake] = useState(false);
  const reduceMotion = useReducedMotion();

  const isValidEmail = useMemo(() => {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isValidEmail) {
      // subtle shake feedback on invalid email
      setShake(true);
      setTimeout(() => setShake(false), 300);
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      await signInWithMagicLink(email);
      setStatus("sent");
      setMessage("Check your email for a magic link to sign in.");
    } catch (err) {
      setStatus("error");
      setMessage(err?.message || "Something went wrong");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <img
        src={bgImage}
        alt=""
        className="absolute inset-0 h-full w-full object-cover brightness-50"
      />

      <div className="relative mt-15 z-10 max-w-7xl mx-auto px-6 sm:px-8 py-20 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Card className="backdrop-blur-2xl p-6 sm:p-8 bg-gradient-to-br from-red-500/20 via-orange-500/20 to-yellow-500/20 border-orange-400/30 rounded-2xl shadow-lg shadow-orange-500/10">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                Welcome
              </h1>
              <p className="text-orange-200/80 mt-1 text-sm">
                We use magic links. No passwords, no hassle.
              </p>

              <motion.form
                onSubmit={onSubmit}
                className="mt-6 space-y-4"
                animate={shake ? { x: [-6, 6, -4, 4, -2, 2, 0] } : { x: 0 }}
                transition={{ duration: 0.35 }}
              >
                <FormField label="Email">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setTouched(true)}
                    placeholder="you@example.com"
                    aria-invalid={touched && !isValidEmail}
                    aria-describedby="email-help"
                    autoComplete="email"
                    className="bg-orange-50/10 border-orange-300/30 text-orange-100 placeholder-orange-300/50 focus:border-orange-400/50 focus:ring-orange-400/30"
                  />
                  <div
                    id="email-help"
                    className="text-xs text-orange-200/70 mt-2"
                  >
                    We'll email you a secure sign-in link.
                  </div>
                  {touched && !isValidEmail && (
                    <div className="text-red-300 text-xs mt-2">
                      Enter a valid email address.
                    </div>
                  )}
                </FormField>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-orange-500/25"
                  disabled={status === "loading" || !isValidEmail}
                  isLoading={status === "loading"}
                >
                  {status === "loading" ? "Sending…" : "Send Magic Link"}
                </Button>

                <div className="text-orange-200/80 text-xs" aria-live="polite">
                  {message}
                </div>
              </motion.form>

              <div className="mt-6 text-orange-200/60 text-xs">
                By continuing you agree to our terms and acknowledge our privacy
                policy.
              </div>
            </Card>
          </motion.div>

          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <AssetCarousel />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

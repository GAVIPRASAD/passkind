import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Shield,
  Lock,
  Globe,
  Zap,
  Moon,
  Sun,
  CheckCircle,
  Menu,
  X,
  ArrowRight,
  Smartphone,
  Github,
  Code,
} from "lucide-react";
import { motion } from "framer-motion";
import Loader from "../components/Loader";
import PasswordGeneratorWidget from "../components/PasswordGeneratorWidget";

/* ========================================
  COMPONENT: LANDING PAGE
  ========================================
*/
const LandingPage = () => {
  const [isLight, setIsLight] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const theme = isLight ? "light" : "dark";

  // Theme Classes
  const bgClass = isLight ? "bg-slate-50" : "bg-[#050505]";
  const textClass = isLight ? "text-slate-900" : "text-white";
  const textSubClass = isLight ? "text-slate-600" : "text-slate-400";
  const navClass = "bg-transparent border-none backdrop-blur-sm";
  const buttonPrimaryClass = isLight
    ? "bg-teal-500 hover:bg-teal-600 text-white shadow-teal-500/30"
    : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/30";

  // Vault Theme Card Class - Darker, Glassy, Futuristic
  const cardClass = isLight
    ? "bg-white border-slate-200 shadow-xl shadow-slate-200/50 hover:shadow-teal-500/20"
    : "bg-[#0a0a0a]/80 border-white/10 shadow-2xl shadow-black hover:shadow-cyan-500/20 hover:border-cyan-500/30";

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-500 ${bgClass} ${textClass} overflow-x-hidden selection:bg-teal-500 selection:text-white`}
    >
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 w-full z-50 backdrop-blur-lg border-b transition-colors duration-500 ${navClass}`}
      >
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group">
            <div
              className={`p-2 rounded-lg transition-colors ${
                isLight
                  ? "bg-teal-50 text-teal-600"
                  : "bg-cyan-950/30 text-cyan-400"
              }`}
            >
              <ShieldCheck size={24} />
            </div>
            <span className="font-bold text-xl tracking-tight">
              Pass
              <span className={isLight ? "text-teal-500" : "text-cyan-400"}>
                Kind
              </span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsLight(!isLight)}
              className={`p-2 rounded-full transition-all ${
                isLight
                  ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800"
              }`}
            >
              {isLight ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            <Link
              to="/login"
              className={`px-6 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-lg ${buttonPrimaryClass}`}
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsLight(!isLight)}
              className={textSubClass}
            >
              {isLight ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={textClass}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            className={`md:hidden absolute w-full border-b p-6 space-y-4 ${navClass}`}
          >
            <Link
              to="/login"
              className={`block w-full py-3 rounded-lg font-bold text-center ${buttonPrimaryClass}`}
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div
          className={`absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-[100px] opacity-30 -z-10 transition-colors duration-500 ${
            isLight ? "bg-teal-200/50" : "bg-cyan-900/20"
          }`}
        ></div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col-reverse md:flex-row items-center gap-16 md:gap-8">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left z-10">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-6 border ${
                isLight
                  ? "bg-teal-50 border-teal-100 text-teal-600"
                  : "bg-cyan-950/20 border-cyan-900/50 text-cyan-400"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isLight ? "bg-teal-500" : "bg-cyan-400"
                }`}
              ></span>
              System Operational
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
              Security for the <br className="hidden md:block" />
              <span
                className={`text-transparent bg-clip-text bg-gradient-to-r ${
                  isLight
                    ? "from-teal-600 to-blue-600"
                    : "from-cyan-400 to-blue-500"
                }`}
              >
                Post-Password Era
              </span>
            </h1>

            <p
              className={`text-lg md:text-xl mb-8 max-w-2xl mx-auto md:mx-0 leading-relaxed ${textSubClass}`}
            >
              Your digital life, secured. Store passwords, notes, and secrets in
              a vault that puts your privacy first. Simple, transparent, and
              secure.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              <Link
                to="/register"
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-xl ${buttonPrimaryClass}`}
              >
                Launch Vault <ArrowRight size={20} />
              </Link>
              <Link
                to="/login"
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-lg border transition-all flex items-center justify-center ${
                  isLight
                    ? "border-slate-300 hover:bg-slate-50 text-slate-700"
                    : "border-slate-800 hover:bg-slate-900 text-white"
                }`}
              >
                Sign In
              </Link>
            </div>

            <div
              className={`mt-10 flex items-center justify-center md:justify-start gap-6 text-sm font-medium ${textSubClass}`}
            >
              <div className="flex items-center gap-2">
                <CheckCircle
                  size={16}
                  className={isLight ? "text-teal-500" : "text-cyan-400"}
                />{" "}
                Free to use
              </div>
            </div>
          </div>

          {/* Right Visual (The Loader) */}
          <div className="flex-1 flex justify-center items-center relative">
            <div
              className={`absolute inset-0 bg-gradient-to-tr from-transparent to-transparent rounded-full blur-3xl opacity-20 ${
                isLight ? "via-teal-200" : "via-cyan-900"
              }`}
            ></div>

            {/* THE LOADER COMPONENT IS EMBEDDED HERE */}
            <div
              className={`relative p-12 rounded-[3rem] border backdrop-blur-sm transition-all duration-500 ${
                isLight
                  ? "bg-white/40 border-white/50 shadow-2xl shadow-teal-100"
                  : "bg-slate-900/30 border-slate-800 shadow-2xl shadow-black"
              }`}
            >
              <Loader
                theme={theme}
                className="min-h-0 w-auto h-[200px] scale-125 md:scale-150 bg-transparent border-none"
                style={{ "--bg-main": "transparent" }}
              />

              {/* Decorative floating badges */}
              <div
                className={`absolute -top-12 -right-12 p-4 rounded-2xl border backdrop-blur-md shadow-lg flex items-center gap-3 animate-bounce-slow ${
                  isLight
                    ? "bg-white border-slate-200 shadow-xl"
                    : "bg-[#0a0a0a] border-slate-800 shadow-2xl"
                }`}
              >
                <div
                  className={`p-2 rounded-lg ${
                    isLight
                      ? "bg-green-100 text-green-600"
                      : "bg-green-900/30 text-green-400"
                  }`}
                >
                  <Lock size={20} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider opacity-60">
                    Status
                  </div>
                  <div className="text-sm font-bold">Encrypted</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section
        id="features"
        className={`py-24 transition-colors ${
          isLight ? "bg-white" : "bg-[#080808]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${textClass}`}>
              Everything you need. <br />
              <span className="text-gray-500">Nothing you don't.</span>
            </h2>
            <p className={`text-lg ${textSubClass}`}>
              PassKind is designed to be the last password manager you'll ever
              need. Secure, open, and always accessible.
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            <FeatureCard
              icon={Zap}
              title="Instant Access"
              desc="Log in to your favorite sites in milliseconds. No more forgotten passwords or reset emails."
              color="amber"
              isLight={isLight}
            />
            <FeatureCard
              icon={Shield}
              title="Bank-Grade Security"
              desc="Your data is encrypted with AES-256 encryption, the same standard used by top financial institutions."
              color="emerald"
              isLight={isLight}
            />
            <FeatureCard
              icon={Globe}
              title="Works Everywhere"
              desc="Access your vault from any device, anywhere in the world. Your digital keys travel with you."
              color="blue"
              isLight={isLight}
            />
            <FeatureCard
              icon={Lock}
              title="Private by Design"
              desc="We can't see your passwords, and neither can anyone else. You hold the only key."
              color="cyan"
              isLight={isLight}
            />
            <FeatureCard
              icon={Smartphone}
              title="Mobile Ready"
              desc="A seamless experience on your phone, tablet, or desktop computer."
              color="fuchsia"
              isLight={isLight}
            />
            <FeatureCard
              icon={CheckCircle}
              title="Simple & Transparent"
              desc="No hidden fees, no confusing tiers. Just secure password management that works."
              color="rose"
              isLight={isLight}
            />
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section
        className={`py-24 relative overflow-hidden ${
          isLight ? "bg-slate-50" : "bg-[#050505]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${textClass}`}>
              Security made simple.
            </h2>
            <p className={`text-lg ${textSubClass} max-w-2xl mx-auto`}>
              Get started in minutes. No technical expertise required.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-12 relative"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {/* Connecting Line (Desktop) */}
            <div
              className={`hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 ${
                isLight ? "bg-slate-200" : "bg-slate-800"
              }`}
            />

            <StepCard
              number="01"
              title="Create Account"
              desc="Sign up for free. We generate your unique encryption keys locally on your device."
              isLight={isLight}
            />
            <StepCard
              number="02"
              title="Add Secrets"
              desc="Import your passwords or add new secure notes. Everything is encrypted before it leaves your device."
              isLight={isLight}
            />
            <StepCard
              number="03"
              title="Access Anywhere"
              desc="Log in from any device. Your vault stays in sync, keeping your digital life at your fingertips."
              isLight={isLight}
            />
          </motion.div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section
        className={`py-20 border-y ${
          isLight
            ? "bg-white border-slate-200"
            : "bg-[#0a0a0a] border-slate-800"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: {
                opacity: 1,
                y: 0,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            <StatItem number="100%" label="Encrypted" isLight={isLight} />
            <StatItem number="0" label="Data Breaches" isLight={isLight} />
            <StatItem number="24/7" label="Access" isLight={isLight} />
            <StatItem number="Open" label="Source Code" isLight={isLight} />
          </motion.div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className={`py-24 ${isLight ? "bg-white" : "bg-[#050505]"}`}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className={`text-3xl md:text-5xl font-bold mb-6 ${textClass}`}>
              Frequently Asked Questions
            </h2>
            <p className={`text-lg ${textSubClass} max-w-2xl mx-auto`}>
              Everything you need to know about PassKind.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            <FAQCard
              question="Is PassKind really free?"
              answer="Yes! PassKind is open-source and free to use for individuals. We believe security should be accessible to everyone."
              isLight={isLight}
              delay={0}
            />
            <FAQCard
              question="Where is my data stored?"
              answer="Your data is encrypted locally on your device using AES-256 before being synced. We strictly cannot access or read your data."
              isLight={isLight}
              delay={0.1}
            />
            <FAQCard
              question="Can I export my data?"
              answer="Your data belongs to you. You can export your entire vault to CSV or JSON format at any time, ensuring you're never locked in."
              isLight={isLight}
              delay={0.2}
            />
            <FAQCard
              question="Do I get to know my password strength?"
              answer="Yes! you can check your password strength using the password strength checker."
              isLight={isLight}
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section
        className={`py-24 px-6 ${isLight ? "bg-slate-50" : "bg-[#0a0a0a]"}`}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className={`relative rounded-[3rem] overflow-hidden p-10 md:p-16 ${
              isLight
                ? "bg-white border border-slate-200 shadow-2xl shadow-slate-200/50"
                : "bg-[#050505] border border-white/10 shadow-2xl shadow-cyan-900/20"
            }`}
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20">
              {/* Left Content */}
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight leading-tight">
                  Your vault,
                  <br />
                  <span className={isLight ? "text-teal-600" : "text-cyan-400"}>
                    anywhere.
                  </span>
                </h2>
                <p
                  className={`text-lg md:text-xl mb-10 leading-relaxed ${
                    isLight ? "text-slate-600" : "text-slate-400"
                  }`}
                >
                  Experience the freedom of open-source security. Sync across
                  all your devices with zero knowledge encryption.
                </p>

                <div className="flex flex-col sm:flex-row items-center md:items-start gap-4">
                  <Link
                    to="/register"
                    className={`px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-xl flex items-center gap-2 ${
                      isLight
                        ? "bg-slate-900 text-white hover:bg-slate-800 hover:shadow-slate-900/20"
                        : "bg-white text-black hover:bg-slate-200 hover:shadow-white/20"
                    }`}
                  >
                    Get Started Free <ArrowRight size={20} />
                  </Link>
                </div>
              </div>

              {/* Right Visual - Floating 3D Vault Card */}
              <div className="flex-1 w-full max-w-md relative perspective-1000">
                {/* Glow Effect Behind */}
                <div
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full blur-[80px] opacity-50 ${
                    isLight ? "bg-teal-200" : "bg-cyan-500/30"
                  }`}
                />

                <motion.div
                  animate={{
                    y: [-10, 10, -10],
                    rotateX: [5, -5, 5],
                    rotateY: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`relative p-6 rounded-3xl border backdrop-blur-xl transform-style-3d ${
                    isLight
                      ? "bg-white/60 border-white/50 shadow-xl shadow-slate-200/50"
                      : "bg-slate-900/60 border-white/10 shadow-2xl shadow-black/50"
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl ${
                        isLight
                          ? "bg-teal-100 text-teal-600"
                          : "bg-cyan-900/30 text-cyan-400"
                      }`}
                    >
                      <ShieldCheck size={24} />
                    </div>
                    <div
                      className={`text-xs font-mono px-2 py-1 rounded ${
                        isLight
                          ? "bg-slate-100 text-slate-500"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      AES-256
                    </div>
                  </div>

                  {/* Interactive Password Generator Widget */}
                  <div
                    className="relative z-20"
                    onMouseDown={(e) => e.stopPropagation()}
                  >
                    <PasswordGeneratorWidget className="!bg-transparent !border-0 !shadow-none !p-0" />
                  </div>

                  {/* Floating Elements around Card */}
                  <motion.div
                    animate={{ y: [5, -5, 5] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className={`absolute -right-6 top-10 p-3 rounded-2xl shadow-lg border ${
                      isLight
                        ? "bg-white border-slate-100 text-blue-500"
                        : "bg-slate-800 border-white/10 text-blue-400"
                    }`}
                  >
                    <Globe size={20} />
                  </motion.div>

                  <motion.div
                    animate={{ y: [-5, 5, -5] }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                    className={`absolute -left-4 bottom-10 p-3 rounded-2xl shadow-lg border ${
                      isLight
                        ? "bg-white border-slate-100 text-purple-500"
                        : "bg-slate-800 border-white/10 text-purple-400"
                    }`}
                  >
                    <Zap size={20} />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className={`py-12 ${
          isLight
            ? "border-slate-200 bg-white"
            : "border-slate-800 bg-[#050505]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={20}
              className={isLight ? "text-teal-500" : "text-cyan-400"}
            />
            <span className="font-bold">PassKind</span>
          </div>

          <div className="flex flex-col items-center md:items-end gap-1">
            <div className={`text-sm ${textSubClass}`}>
              © {new Date().getFullYear()} PassKind. All rights reserved.
            </div>
            <div className={`text-sm font-medium ${textSubClass}`}>
              Made with ❤️ by{" "}
              <span className={isLight ? "text-slate-900" : "text-white"}>
                Gavi Prasad
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StepCard = ({ number, title, desc, isLight }) => (
  <motion.div
    variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
    className="relative flex flex-col items-center text-center z-10 group"
  >
    <div
      className={`w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold mb-6 border-4 transition-all duration-300 group-hover:scale-110 ${
        isLight
          ? "bg-white border-slate-100 text-teal-600 shadow-lg group-hover:border-teal-500 group-hover:shadow-teal-500/30"
          : "bg-[#0a0a0a] border-slate-800 text-cyan-400 shadow-2xl group-hover:border-cyan-400 group-hover:shadow-cyan-500/30"
      }`}
    >
      {number}
    </div>
    <h3
      className={`text-xl font-bold mb-3 transition-colors ${
        isLight
          ? "text-slate-900 group-hover:text-teal-600"
          : "text-white group-hover:text-cyan-400"
      }`}
    >
      {title}
    </h3>
    <p
      className={`leading-relaxed ${
        isLight ? "text-slate-600" : "text-slate-400"
      }`}
    >
      {desc}
    </p>
  </motion.div>
);

const StatItem = ({ number, label, isLight }) => (
  <motion.div
    variants={{
      hidden: { opacity: 0, scale: 0.9 },
      show: { opacity: 1, scale: 1 },
    }}
  >
    <div
      className={`text-4xl md:text-5xl font-bold mb-2 ${
        isLight ? "text-teal-600" : "text-cyan-400"
      }`}
    >
      {number}
    </div>
    <div
      className={`text-sm font-bold uppercase tracking-wider ${
        isLight ? "text-slate-500" : "text-slate-500"
      }`}
    >
      {label}
    </div>
  </motion.div>
);

const FAQCard = ({ question, answer, isLight, delay }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-2xl border transition-all duration-300 ${
        isLight
          ? `bg-white border-slate-200 hover:border-teal-200 ${
              isOpen ? "shadow-lg shadow-slate-200/50 ring-1 ring-teal-100" : ""
            }`
          : `bg-[#0a0a0a] border-slate-800 hover:border-cyan-900 ${
              isOpen
                ? "shadow-lg shadow-cyan-900/20 ring-1 ring-cyan-900/50"
                : ""
            }`
      }`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
      >
        <span
          className={`text-lg font-bold ${
            isLight ? "text-slate-900" : "text-white"
          }`}
        >
          {question}
        </span>
        <span
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          } ${isLight ? "text-teal-500" : "text-cyan-400"}`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden px-6"
      >
        <p
          className={`pb-6 leading-relaxed ${
            isLight ? "text-slate-600" : "text-slate-400"
          }`}
        >
          {answer}
        </p>
      </motion.div>
    </motion.div>
  );
};

const FeatureCard = ({ icon: Icon, title, desc, color, isLight }) => {
  // Dynamic color classes based on the 'color' prop and theme
  // Increased opacity for stronger presence

  const colors = {
    amber: {
      light:
        "bg-amber-50 border-amber-100 text-amber-900 group-hover:border-amber-300",
      dark: "bg-amber-950/30 border-amber-900/30 text-amber-100 group-hover:border-amber-700/50",
      icon: isLight
        ? "bg-amber-100 text-amber-600"
        : "bg-amber-900/20 text-amber-400",
      glow: isLight ? "bg-amber-400/20" : "bg-amber-500/10",
    },
    emerald: {
      light:
        "bg-emerald-50 border-emerald-100 text-emerald-900 group-hover:border-emerald-300",
      dark: "bg-emerald-950/30 border-emerald-900/30 text-emerald-100 group-hover:border-emerald-700/50",
      icon: isLight
        ? "bg-emerald-100 text-emerald-600"
        : "bg-emerald-900/20 text-emerald-400",
      glow: isLight ? "bg-emerald-400/20" : "bg-emerald-500/10",
    },
    blue: {
      light:
        "bg-blue-50 border-blue-100 text-blue-900 group-hover:border-blue-300",
      dark: "bg-blue-950/30 border-blue-900/30 text-blue-100 group-hover:border-blue-700/50",
      icon: isLight
        ? "bg-blue-100 text-blue-600"
        : "bg-blue-900/20 text-blue-400",
      glow: isLight ? "bg-blue-400/20" : "bg-blue-500/10",
    },
    cyan: {
      light:
        "bg-cyan-50 border-cyan-100 text-cyan-900 group-hover:border-cyan-300",
      dark: "bg-cyan-950/30 border-cyan-900/30 text-cyan-100 group-hover:border-cyan-700/50",
      icon: isLight
        ? "bg-cyan-100 text-cyan-600"
        : "bg-cyan-900/20 text-cyan-400",
      glow: isLight ? "bg-cyan-400/20" : "bg-cyan-500/10",
    },
    fuchsia: {
      light:
        "bg-fuchsia-50 border-fuchsia-100 text-fuchsia-900 group-hover:border-fuchsia-300",
      dark: "bg-fuchsia-950/30 border-fuchsia-900/30 text-fuchsia-100 group-hover:border-fuchsia-700/50",
      icon: isLight
        ? "bg-fuchsia-100 text-fuchsia-600"
        : "bg-fuchsia-900/20 text-fuchsia-400",
      glow: isLight ? "bg-fuchsia-400/20" : "bg-fuchsia-500/10",
    },
    rose: {
      light:
        "bg-rose-50 border-rose-100 text-rose-900 group-hover:border-rose-300",
      dark: "bg-rose-950/30 border-rose-900/30 text-rose-100 group-hover:border-rose-700/50",
      icon: isLight
        ? "bg-rose-100 text-rose-600"
        : "bg-rose-900/20 text-rose-400",
      glow: isLight ? "bg-rose-400/20" : "bg-rose-500/10",
    },
  };

  const themeStyles = isLight ? colors[color].light : colors[color].dark;
  const iconStyles = colors[color].icon;
  const glowStyles = colors[color].glow;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className={`relative p-8 rounded-3xl border backdrop-blur-sm overflow-hidden group transition-all duration-300 ${themeStyles}`}
    >
      {/* Soft Hover Glow */}
      <div
        className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-[60px] transition-opacity duration-500 opacity-0 group-hover:opacity-100 ${glowStyles}`}
      />

      <div className="relative z-10">
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform duration-300 group-hover:scale-110 ${iconStyles}`}
        >
          <Icon size={28} />
        </div>

        <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
        <p
          className={`font-medium leading-relaxed ${
            isLight ? "text-slate-600" : "text-slate-400"
          }`}
        >
          {desc}
        </p>
      </div>
    </motion.div>
  );
};

export default LandingPage;

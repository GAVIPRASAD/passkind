import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Shield,
  Lock,
  Key,
  Database,
  Server,
  Code,
  Globe,
  CheckCircle,
  ArrowRight,
  Cpu,
  Layers,
  Zap,
} from "lucide-react";

const LandingPageDemo = () => {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const position = useTransform(scrollYProgress, (pos) => {
    return pos === 1 ? "relative" : "fixed";
  });

  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };
  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -50]),
    springConfig
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white overflow-x-hidden selection:bg-cyan-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[40%] w-[20%] h-[20%] bg-purple-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Navbar Placeholder (Visual only for demo) */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-cyan-500" />
          <span className="text-xl font-bold tracking-tight">PassKind</span>
        </div>
        <div className="flex gap-4">
          <Link
            to="/login"
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 text-sm bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center pt-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-cyan-400 mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            v1.0 Now Available
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Security that <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              breathes.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Military-grade encryption meets elegant design. The open-source
            password manager built for the modern web.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/secrets"
              className="group relative px-8 py-4 bg-cyan-600 text-white rounded-full font-semibold overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(8,145,178,0.5)]"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative flex items-center gap-2">
                Launch Vault <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <a
              href="#"
              className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-semibold hover:bg-white/10 transition-all"
            >
              View Source
            </a>
          </div>
        </motion.div>

        {/* 3D Glass Card Animation */}
        <motion.div
          initial={{ opacity: 0, rotateX: 20, y: 100 }}
          animate={{ opacity: 1, rotateX: 0, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 50,
            damping: 20,
            delay: 0.4,
          }}
          className="relative w-full max-w-5xl mx-auto perspective-1000"
        >
          {/* Main Dashboard Preview */}
          <div className="relative bg-[#0d1117]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />

            {/* Mock UI Header */}
            <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/20" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/20" />
                <div className="w-3 h-3 rounded-full bg-green-500/20" />
              </div>
              <div className="flex-1 text-center text-xs text-gray-600 font-mono">
                vault.passkind.app
              </div>
            </div>

            {/* Mock UI Body */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sidebar Mock */}
              <div className="hidden md:block space-y-4">
                <div className="h-8 w-3/4 bg-white/5 rounded-lg animate-pulse" />
                <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
                <div className="h-4 w-2/3 bg-white/5 rounded-lg" />
                <div className="h-4 w-1/2 bg-white/5 rounded-lg" />
              </div>

              {/* Main Content Mock */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex justify-between items-center mb-6">
                  <div className="h-8 w-1/3 bg-white/5 rounded-lg" />
                  <div className="h-8 w-24 bg-cyan-500/20 rounded-lg" />
                </div>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-16 bg-white/5 border border-white/5 rounded-xl flex items-center px-4 gap-4"
                  >
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-1/4 bg-white/10 rounded" />
                      <div className="h-2 w-1/3 bg-white/5 rounded" />
                    </div>
                    <div className="h-8 w-8 rounded bg-white/5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-12 top-20 bg-[#161b22] p-4 rounded-xl border border-white/10 shadow-xl hidden md:block"
            >
              <Lock className="h-8 w-8 text-cyan-400 mb-2" />
              <div className="text-xs text-gray-400">AES-256</div>
              <div className="text-sm font-bold text-white">Encrypted</div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-8 bottom-20 bg-[#161b22] p-4 rounded-xl border border-white/10 shadow-xl hidden md:block"
            >
              <Shield className="h-8 w-8 text-green-400 mb-2" />
              <div className="text-xs text-gray-400">Status</div>
              <div className="text-sm font-bold text-white">Protected</div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* TRUST / TECH STACK SECTION */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-sm text-gray-500 mb-10 uppercase tracking-widest">
            Powered by Modern Standards
          </p>
          <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {[
              { icon: Code, label: "React" },
              { icon: Server, label: "Spring Boot" },
              { icon: Database, label: "PostgreSQL" },
              { icon: Lock, label: "AES-256" },
              { icon: Layers, label: "Docker" },
            ].map((tech, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 group cursor-default"
              >
                <tech.icon className="h-8 w-8 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                <span className="text-xs font-medium text-gray-500 group-hover:text-gray-300">
                  {tech.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-32 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Everything you need. <br />
              <span className="text-gray-500">Nothing you don't.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "Lightning Fast",
                desc: "Optimized for speed. Access your credentials in milliseconds, not seconds.",
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
              },
              {
                icon: Shield,
                title: "Zero Knowledge",
                desc: "We can't see your data. Your keys stay on your device until you say otherwise.",
                color: "text-green-400",
                bg: "bg-green-400/10",
              },
              {
                icon: Globe,
                title: "Anywhere Access",
                desc: "Securely synced across all your devices. Work from home, office, or anywhere.",
                color: "text-blue-400",
                bg: "bg-blue-400/10",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all"
              >
                <div
                  className={`h-12 w-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-3xl p-12 md:p-20 text-center border border-cyan-500/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-cyan-500/5 blur-3xl" />

          <h2 className="text-3xl md:text-5xl font-bold mb-8 relative z-10">
            Ready to secure your digital life?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto relative z-10">
            Join thousands of developers who trust PassKind with their most
            sensitive data.
          </p>

          <Link
            to="/register"
            className="relative z-10 inline-flex items-center px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-gray-100 transition-colors"
          >
            Get Started for Free
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} PassKind. Open Source & Secure.</p>
      </footer>
    </div>
  );
};

export default LandingPageDemo;

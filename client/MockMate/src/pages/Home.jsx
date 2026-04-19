import Card from "../components/Card";
import { useNavigate } from "react-router-dom";
import {AnimatePresence, motion} from 'framer-motion';
import { useInView } from "react-intersection-observer";
import { container, letter, formVariant } from "../services/Register";
export default function Home(){
    const nameText = "Our Feauters";
    const welcomeText = "Welcome to MockMate AI";
    const Navigate = useNavigate();

    const [ref, inView] = useInView({
    threshold: 0.2,  // 20% element visible
    triggerOnce: true // animation sirf ek baar chale
  });

    return(
        <>
    <div className="w-full min-h-screen bg-gray-50">
      {/* Hero */}
      <motion.div
            initial={{ opacity: 0, y: -80 }}            // start thoda aur niche se
            animate={{ opacity: 1, y: 0 }}             // end position
            transition={{
                type: "spring",                          // spring gives bounce effect
                stiffness: 120,                          // tightness of spring
                damping: 15,                             
                mass: 1.5,
                delay: 0.2,                              // delay before animation starts
            }}
        >
      <section className="bg-gradient-to-r w-[100%] from-green-500 to-green-800 text-black flex flex-col justify-center items-center h-screen text-center px-4">
        <motion.h2
                    className="text-3xl sm:text-4xl md:text-6xl fonts-style mb-4 text-center"
                    variants={container}
                    custom={1}
                    initial="hidden"
                    animate="visible"
            >
                    {welcomeText.split("").map((char, index) => (
                    <motion.span key={index} variants={letter}>
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                    ))}
        </motion.h2>
        <p className="text-lg md:text-2xl mb-6">
          Your AI assistant for smarter learning and mock interviews.
        </p>
        <button className="bg-black text-green-500 px-6 py-3 rounded-lg font-semibold hover:bg-slate-900 transition" onClick={() => Navigate('/register')}>
          Get Started
        </button>
      </section>
     </motion.div>

      {/* Features */}
      <section className="py-20 px-4 md:px-20">
        <motion.h2
                    ref={ref}
                    className="text-3xl sm:text-3xl md:text-4xl fonts-style mb-4 text-center"
                    variants={container}
                    custom={1}
                    initial={{ opacity: 0, y: 50 }}
                    transition={{ duration: 2, type: "keyframes" }}
                    animate={inView ? { opacity: 1, y: 0 } : {}}
            >
                    {nameText.split("").map((char, index) => (
                    <motion.span key={index} variants={letter}>
                        {char === " " ? "\u00A0" : char}
                    </motion.span>
                    ))}
    </motion.h2>
        <motion.div initial={{ opacity: 0, y: 80 }}            // start thoda aur niche se
            animate={inView ? { opacity: 1, y: 0 } : {}}             // end position
            transition={{
                type: "keyframes",
                duration : 1,                          // spring gives bounce effect
                stiffness: 150,                          // tightness of spring
                damping: 20,                             
                mass: 1.5,
                delay: 0.5,                              // delay before animation starts
            }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
          <Card head="AI Mock Interviews" para="Practice your interviews with AI-generated questions and feedback." />
          <Card head="Personalized Learning" para="Get suggestions based on your skills and progress." />
          <Card head="Analytics Dashboard" para={"Track your performance and improve where needed."}/>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center h-96 flex flex-col justify-center items-center">
          <div className="cpyright">
             &copy; 2026 MockMate AI. All rights reserved.
          </div>
          <div className="item w-full h-3/4 border-2 mt-6">

          </div>
      </footer>
    </div>
        </>
    );
}
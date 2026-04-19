import {motion} from 'framer-motion';
import { useInView } from "react-intersection-observer";
import { container, letter, formVariant } from "../services/Register";
import { FaLaptopCode, FaBrain, FaCalculator, FaBook, FaComments } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    title: "DSA Practice",
    icon: <FaLaptopCode size={40} className="text-blue-500" />,
    description: "Practice data structures and algorithms with challenges and solutions.",
    nav : '/dsa',
    count : 5,
    category : "DSA",
    level : ["Easy", "Medium", "Hard"],
    topic : ["Array", "Pointer", "Stack", "LinkedList", "Queue", "Graph", "Tree", "SerachingAlgorithm"]
  },
  {
    title: "CS Fundamentals",
    icon: <FaBrain size={40} className="text-purple-500"/>,
    description: "Learn core computer science concepts like OS, DBMS, Networking, and more.",
    nav : '/CS',
    count : 20,
    category : "CSFundamentals",
    topic : ['ComputerNetwork', 'DBMS', 'OperatingSystem', 'DSA'],
    level : ["Easy", "Medium", "Hard"],
  },
  {
    title: "Aptitude",
    icon: <FaCalculator size={40} className="text-green-500" />,
    description: "Sharpen your logical and quantitative reasoning skills for interviews.",
    nav : '/Aptitude',
    count : 20,
    category : 'QuantitativeAptitude',
    topic : ["QuantitativeAptitude"],
    level : ["Easy", "Medium", "Hard"],
  },
  {
    title: "English Assessment",
    icon: <FaBook size={40} className="text-yellow-500" />,
    description: "Improve your grammar, comprehension, and communication skills.",
    nav : '/english',
    count : 20,
    category : 'EnglishAssessment',
    topic : ["Grammer"],
    level : ["Easy", "Medium", "Hard"],
  },
  {
    title: "Interview Preparation",
    icon: <FaComments size={40} className="text-red-500" />,
    description: "Get ready for interviews with mock tests, tips, and tricks.",
    category : "Speech Interview",
  },
];

export default function Service() {

  const navigate = useNavigate();

    const [ref, inView] = useInView({
    threshold: 0.5,  // 20% element visible
    triggerOnce: true // animation sirf ek baar chale
  });

  
  return (
     <motion.div 
        ref={ref}
        variants={container}
        custom={1}
        initial={{ opacity: 0, y: 40 }}
        transition={{ type: "keyframes", duration : 1.5 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        className="min-h-screen bg-slate-900 flex flex-col items-center pt-32 px-4">
      <h1 className="text-4xl font-bold mb-10 text-white">Our Learning Services</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {services.map((service, index) => (
          <div className="bg-green-300 shadow-lg rounded-xl p-6 flex flex-col items-center text-center hover:scale-105 transition-transform duration-300 cursor-pointer "
           key={index} onClick={() => navigate('/category', {state : {category : service.category, topic : service.topic || [], level : service.level || ["Easy", "Medium", "Hard"]}})}>
            <div className="mb-4">{service.icon}</div>
            <h2 className="text-xl font-semibold mb-2">{service.title}</h2>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
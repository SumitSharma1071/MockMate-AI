import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from '../services/index';
import {motion} from 'framer-motion';
import { useInView } from "react-intersection-observer";
import { container, letter, formVariant } from "../services/Register";
export default function CategorySelectionPage({user, setUser}) {

  const [ref, inView] = useInView({
    threshold: 0.5,  
    triggerOnce: true
  });


  const location = useLocation();
  const navigate = useNavigate();
  const { category, topic, level } = location.state || {};
  const [selectedTopic, setSelectedTopic] = useState(Array.isArray(topic) ? topic[0] : topic || "");
  const [selectedlevel, setSelectedlevel] = useState(Array.isArray(level) ? level[0] : level || "");
  const [questions, setQuestions] = useState([]);

  const handleSubmit = async() =>{
      try {
    const res = await API.get(`/service/other/${category}`, {
      params: { topic: selectedTopic || category , level: selectedlevel }
    });
       setQuestions(res.data);
       
    if(category === "DSA") {
      navigate('/dsa', {
        state: { topic: selectedTopic, level: selectedlevel }
      });
    } else {
      navigate('/test', {
        state: { category, topic: selectedTopic, level: selectedlevel, questions: res.data }
      });
    }
  } catch(err) {
    if (err.response?.status === 401) {
       navigate("/register");
  } else {
    console.log(err.message);
  }
  }
  };

  return (
    <motion.div 
            ref={ref}
            variants={container}
            custom={1}
            initial={{ opacity: 0, y: -100 }}
            transition={{ type: "keyframes", duration : 1.5 }}
            animate={{ opacity: 1, y: 0 }}
    className="h-screen pt-23 flex flex-col items-center justify-center bg-gray-50 p-4 shadow-lg">
      <h1 className="text-3xl font-bold mb-6">Start {category} Test</h1>

      {topic && topic.length > 0 && (
        <div className="mb-4">
          <label className="font-semibold mr-2">Select Topic:</label>
          <select className="border rounded p-2" value={selectedTopic} onChange={(e) => setSelectedTopic(e.target.value)}>
            {topic.map((t, i) => (
              <option key={i} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}
      {level && level.length > 0 && (
        <div className="mb-4">
          <label className="font-semibold mr-2">Select Difficulties:</label>
          <select className="border rounded p-2" value={selectedlevel} onChange={(e) => setSelectedlevel(e.target.value)}>
            {level.map((l, i) => (
              <option key={i} value={l}>{l}</option>
            ))}
          </select>
        </div>
      )}

      <button onClick={handleSubmit}
       disabled={!selectedTopic || !selectedlevel}
       className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
        Start Test
      </button>
    </motion.div>
  );
}
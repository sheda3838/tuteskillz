import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import "../../styles/Home/StatsSection.css";

const Counter = ({ target }) => {
  axios.defaults.withCredentials = true;
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 1200;
    const increment = target / (duration / 16);

    const animate = () => {
      start += increment;
      if (start < target) {
        setCount(Math.floor(start));
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, target]);

  return <span ref={ref}>{count}</span>;
};

const StatsSection = () => {
  const [stats, setStats] = useState({
    tutorCount: 0,
    studentCount: 0,
    sessionCount: 0,
  });

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/admin/counts`)
      .then((res) => {
        if (res.data.success) {
          const { tutorCount, studentCount, sessionCount } = res.data.counts;
          setStats({ tutorCount, studentCount, sessionCount });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="stats-section">
      <h2 className="stats-title">Our Impact</h2>

      <div className="stats-grid">
        {/* Tutors */}
        <motion.div
          className="stats-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div className="icon tutors-icon"></div>
          <h3>
            <Counter target={stats.tutorCount} />+
          </h3>
          <p>Tutors</p>
        </motion.div>

        {/* Students */}
        <motion.div
          className="stats-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <div className="icon students-icon"></div>
          <h3>
            <Counter target={stats.studentCount} />+
          </h3>
          <p>Students</p>
        </motion.div>

        {/* Sessions */}
        <motion.div
          className="stats-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="icon sessions-icon"></div>
          <h3>
            <Counter target={stats.sessionCount} />+
          </h3>
          <p>Sessions Conducted</p>
        </motion.div>
      </div>
    </div>
  );
};

export default StatsSection;

import React from "react";
import { motion } from "framer-motion";
import Header from "../../components/Home/Header";
import Team from "../../components/Home/Team";
import Voices from "../../components/Home/Voices";
import Footer from "../../components/Home/Footer";
import StatsSection from "../../components/Home/StatsSection";
import Feature from "../../components/Home/Feature"

function Home() {
  const pageVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <Header />
      <Feature />
      <Team />
      <Voices />
      <StatsSection />
      <Footer />
    </motion.div>
  );
}

export default Home;

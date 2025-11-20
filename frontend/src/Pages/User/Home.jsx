import React from "react";
import { motion } from "framer-motion";
import Header from "../../components/Home/header";
import Team from "../../components/Home/Team";
import Voices from "../../components/Home/voices";
import Footer from "../../components/Home/Footer";
import StatsSection from "../../components/Home/StatsSection";

function Home() {
  const pageVariants = {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <motion.div
      className="home-page-container"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <Header />
      <Team />
      <Voices />
      <StatsSection />
      <Footer />
    </motion.div>
  );
}

export default Home;

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import "../../styles/Home/Voices.css";

const voicesData = [
  { 
    name: "Yusuf", 
    image: "/p1.jpg", 
    comment: "The platform makes teaching organized and stress-free. I can focus on helping students.", 
    stars: 5 
  },
  { 
    name: "Rimzy", 
    image: "/p2.jpg", 
    comment: "I finally understand math better with one-to-one support. The notes and recordings help a lot.", 
    stars: 5 
  },
  { 
    name: "Faraj", 
    image: "/p3.jpg", 
    comment: "The tutors are supportive and always make concepts easy to understand.", 
    stars: 4 
  },
  { 
    name: "Malik", 
    image: "/p4.jpg", 
    comment: "Amazing learning environment. Very interactive and useful!", 
    stars: 5 
  },
  { 
    name: "Imthi", 
    image: "/p5.jpg", 
    comment: "I enjoy every session. Very professional tutors.", 
    stars: 5 
  },
  { 
    name: "Muheed", 
    image: "/p6.jpg", 
    comment: "Everything is well structured and easy to follow.", 
    stars: 4 
  },
  { 
    name: "Rayan", 
    image: "/p7.jpg", 
    comment: "The support team and tutors genuinely care about progress.", 
    stars: 5 
  },
  { 
    name: "Onija", 
    image: "/p8.jpg", 
    comment: "The platform keeps me motivated and makes learning fun.", 
    stars: 5 
  },
  { 
    name: "Sai", 
    image: "/p9.jpg", 
    comment: "Simple, clean, and very effective for learning.", 
    stars: 4 
  },
  { 
    name: "Nethan", 
    image: "/p10.jpg", 
    comment: "Outstanding tutoring experience. Highly recommended!", 
    stars: 5 
  }
];


const Voices = () => {
  const [index, setIndex] = useState(0);
  const visibleCards = 3;

  const handleNext = () => {
    setIndex((prev) =>
      prev + 1 >= voicesData.length - (visibleCards - 1) ? 0 : prev + 1
    );
  };

  const handlePrev = () => {
    setIndex((prev) =>
      prev - 1 < 0 ? voicesData.length - visibleCards : prev - 1
    );
  };

  return (
    <section className="voices-section">
      <h2 className="voices-title">Voices of TuteSkillz</h2>

      <div className="carousel-wrapper">
        <button className="arrow left" onClick={handlePrev}>&lt;</button>

        <div className="carousel-container">
          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${index * (100 / visibleCards)}%)`,
            }}
          >
            {voicesData.map((voice, i) => (
              <div key={i} className="voice-card">
                <div className="image-wrapper">
                  <img src={voice.image} alt={voice.name} />
                </div>

                <h4>{voice.name}</h4>
                <p>{voice.comment}</p>

                <div className="stars">
                  {Array.from({ length: voice.stars }, (_, i) => (
                    <FaStar key={i} color="#f8f11a" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="arrow right" onClick={handleNext}>&gt;</button>
      </div>

      <div className="dots">
        {voicesData.slice(0, voicesData.length - 2).map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default Voices;

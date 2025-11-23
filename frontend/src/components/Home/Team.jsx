import React from "react";
import TeamMemberCard from "./TeamMemberCard";
import "../../styles/Home/Team.css";

const teamMembers = [
  {
    name: "Kaleelul Rahman Fatheen",
    role: "CEO",
    bio: "Leads TuteSkillz with vision and strategy, ensuring trust, quality, and growth",
    image: "/src/assets/Fatheen.jpg",
    linkedin: "https://lk.linkedin.com/in/fatheenrahman",
  },
  {
    name: "Zaid Kamil",
    role: "CFO",
    bio: "Oversees financial health, making education affordable and sustainable",
    image: "/src/assets/Me.jpg",
    linkedin: "https://www.linkedin.com/in/kamilzaid/",
  },
  {
    name: "Abdul Hafeez Saleem",
    role: "CMO",
    bio: "Builds connections with students, tutors, and parents through creative outreach",
    image: "/src/assets/Hafeez.jpg",
    linkedin: "https://www.linkedin.com/in/hafeez-saleem/",
  },
  {
    name: "Sajad Niflar",
    role: "CIO",
    bio: "Much love with middle school students specially with grade six.",
    image: "/src/assets/Sajad.jpg",
    linkedin: "https://www.linkedin.com/in/sajadniflar/",
  },
];

const Team = () => {
  return (
    <section className="team-section">
      <h2 className="team-heading">Meet Our Team</h2>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <TeamMemberCard key={index} {...member} />
        ))}
      </div>
    </section>
  );
};

export default Team;

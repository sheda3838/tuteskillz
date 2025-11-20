import React from "react";
import TeamMemberCard from "./TeamMemberCard";
import "../../styles/Home/Team.css";

const teamMembers = [
  {
    name: "Kaleelul Rahman Fatheen",
    role: "CEO",
    bio: "Leads TuteSkillz with vision and strategy, ensuring trust, quality, and growth",
    image: "/src/assets/Fatheen.jpg",
    linkedin: "#",
    gmail: "alice@example.com",
  },
  {
    name: "Zaid Kamil",
    role: "CFO",
    bio: "Oversees financial health, making education affordable and sustainable",
    image: "/src/assets/Me.jpg",
    linkedin: "#",
    gmail: "bob@example.com",
  },
  {
    name: "Abdul Hafeez Saleem",
    role: "CMO",
    bio: "Builds connections with students, tutors, and parents through creative outreach",
    image: "/src/assets/Hafeez.jpg",
    linkedin: "#",
    gmail: "charlie@example.com",
  },
  {
    name: "Sajad Niflar",
    role: "CIO",
    bio: "Drives technology and innovation, ensuring secure and reliable learning systems.",
    image: "/src/assets/Sajad.jpg",
    linkedin: "#",
    gmail: "diana@example.com",
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

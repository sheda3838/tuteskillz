import React from "react";
import TeamMemberCard from "./TeamMemberCard";
import "../../styles/Home/Team.css";

const teamMembers = [
  {
    name: "Kaleelul Rahman Fatheen",
    role: "CEO",
    bio: "Leads TuteSkillz with vision and strategy, ensuring trust, quality, and growth",
    image: "/Fatheen.jpg",
    linkedin: "https://lk.linkedin.com/in/fatheenrahman",
  },
  {
    name: "Zaid Kamil",
    role: "CFO",
    bio: "Leads the financial and strategic backbone of TuteSkillz, shaping a platform that grew from his vision.",
    image: "/Me.jpg",
    linkedin: "https://www.linkedin.com/in/kamilzaid/",
  },
  {
    name: "Abdul Hafeez Saleem",
    role: "CMO",
    bio: "Builds connections with students, tutors, and parents through creative outreach",
    image: "/Hafeez.jpg",
    linkedin: "https://www.linkedin.com/in/hafeez-saleem/",
  },
  {
    name: "Sajad Niflar",
    role: "CIO",
    bio: "Grade Six tutor powered by magic, humor, and determination - Much love with middle school students.",
    image: "/Sajad.jpg",
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

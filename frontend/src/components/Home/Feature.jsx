import React from 'react';
import { GraduationCap, Tag, BookOpen, Users } from 'lucide-react';
import "../../styles/Home/FeatureCard.css"

export default function App() {
  return (
    <>
      <div className='feature-overlap'>
        <div className="container">
        <div className="card-row">
          
          {/* Card 1: Best Mentors */}
          <div className="feature-card white">
            <div className="card-header">
              <h3 className="card-title">Best Mentors</h3>
              <div className="icon-wrapper">
                <GraduationCap size={32} strokeWidth={1.5} />
              </div>
            </div>
            <p className="card-description">
              Our top mentors bring valuable knowledge and experience to guide you on your journey
            </p>
          </div>

          {/* Card 2: Best Price */}
          <div className="feature-card green">
            <div className="card-header">
              <h3 className="card-title">Best Price</h3>
              <div className="icon-wrapper">
                <Tag size={32} strokeWidth={1.5} />
              </div>
            </div>
            <p className="card-description">
              We offer competitive pricing on all our courses, ensuring you receive the best value for money.
            </p>
          </div>

          {/* Card 3: Easy to Learn */}
          <div className="feature-card white">
            <div className="card-header">
              <h3 className="card-title">Easy to Learn</h3>
              <div className="icon-wrapper">
                <BookOpen size={32} strokeWidth={1.5} />
              </div>
            </div>
            <p className="card-description">
              With user-friendly navigation and engaging materials, you can dive into your studies hassle-free.
            </p>
          </div>

          {/* Card 4: 1 to 1 Discussion */}
          <div className="feature-card green">
            <div className="card-header">
              <h3 className="card-title">1 to 1 Discussion</h3>
              <div className="icon-wrapper">
                <Users size={32} strokeWidth={1.5} />
              </div>
            </div>
            <p className="card-description">
              Our 1-to-1 mentoring connects you with dedicated professionals for your success.
            </p>
          </div>

        </div>
      </div>
      </div>
    </>
  );
}
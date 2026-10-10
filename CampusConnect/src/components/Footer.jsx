import { Link } from 'react-router-dom';
import { Brand } from './Navbar';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <Brand light />
          <p className="footer-text">University Club & Event Management System. A Software Engineering and System Analysis Lab project at the University of Information Technology & Sciences (UITS).</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><Link to="/clubs">Browse clubs</Link></li>
            <li><Link to="/events">Browse events</Link></li>
            <li><Link to="/login">Log in</Link></li>
          </ul>
        </div>
        <div>
          <h4>Project</h4>
          <ul>
            <li>Batch 4B, Team Dooms</li>
            <li>Instructor: Rafat Ara</li>
            <li>Frontend demo, no real backend</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

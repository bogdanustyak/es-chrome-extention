import { Link } from 'react-router-dom';
import './NavMenu.css';

export const NavMenu = () => {
  return (
    <header className="menu-header">
      <nav>
        <ul>
          <Link className="menu-title" to="/">
            Settings
          </Link>
          <Link className="menu-title" to="/snapshots">
            Snapshots
          </Link>
        </ul>
      </nav>
    </header>
  );
};

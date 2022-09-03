import ReactDOM from 'react-dom/client';
import {
  MemoryRouter,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { NavMenu } from './components/NavMenu';
import './index.css';
import './components/NavMenu.css';
import { Settings } from './pages/Settings';
import { Snapshots } from './pages/snapshots/Snapshots';

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <MemoryRouter>
    <NavMenu />
    <Routes>
      <Route path="/" element={<Settings />} />
      <Route path="snapshots" element={<Snapshots />} />
    </Routes>
  </MemoryRouter>
);

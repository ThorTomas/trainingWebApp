import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import ForgotPassword from './components/auth/ForgotPassword.jsx';
import ResetPassword from './components/auth/ResetPassword.jsx';
import RegisterSuccess from './components/auth/RegisterSuccess.jsx';
import CompleteProfile from './components/auth/RegisterProfile.jsx';
import Dashboard from './components/Dashboard.jsx';
import Home from './components/dashboard/Home.jsx';
import Profile from './components/dashboard/Profile.jsx';
import Settings from './components/dashboard/Settings.jsx';
import OverviewStats from './components/dashboard/OverviewStats.jsx';
import Groups from './components/dashboard/Groups.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register-success" element={<RegisterSuccess />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/home" element={<Navigate to="/dashboard/home" />} />

        {/* Dashboard layout s vnořenými routami */}
        <Route path="/dashboard/*" element={<Dashboard />}>
          <Route path="overview" element={<OverviewStats />} />
          <Route path="home" element={<Home />} />
          <Route path="groups" element={<Groups />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route index element={<Navigate to="home" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

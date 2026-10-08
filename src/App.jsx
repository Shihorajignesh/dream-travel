import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const Destinations = lazy(() => import('./pages/Destinations.jsx'));
const DestinationDetail = lazy(() => import('./pages/DestinationDetail.jsx'));
const Packages = lazy(() => import('./pages/Packages.jsx'));
const PackageDetail = lazy(() => import('./pages/PackageDetail.jsx'));
const Booking = lazy(() => import('./pages/Booking.jsx'));
const Experiences = lazy(() => import('./pages/Experiences.jsx'));
const TripPlanner = lazy(() => import('./pages/TripPlanner.jsx'));
const Favorites = lazy(() => import('./pages/Favorites.jsx'));
const Profile = lazy(() => import('./pages/Profile.jsx'));
const Login = lazy(() => import('./pages/Login.jsx'));
const Signup = lazy(() => import('./pages/Signup.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));

export default function App() {
  return (
    <Suspense fallback={<div className="grid min-h-[60vh] place-items-center" role="status">Loading…</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="destinations/:slug" element={<DestinationDetail />} />
          <Route path="packages" element={<Packages />} />
          <Route path="packages/:slug" element={<PackageDetail />} />
          <Route path="booking/:packageId" element={<Booking />} />
          <Route path="experiences" element={<Experiences />} />
          <Route path="trip-planner" element={<TripPlanner />} />
          <Route path="favorites" element={<Favorites />} />
          <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="contact" element={<Contact />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

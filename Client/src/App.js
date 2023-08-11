import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  Suspense,
} from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { AuthContext } from "./Context/authContext";
import SplashPage from "./Pages/SplashPage/SplashPage";
import LoadingSpinner from "./Components/LoadingSpinner";
import NotFoundPage from "./Pages/NotFoundPage/NotFoundPage";
import ProfilePage from "./Pages/ProfilePage/ProfilePage";
import InboxPage from "./Pages/InboxPage/InboxPage";
import NotificationPage from "./Pages/NotificationPage/NotificationPage";
import GuessPage from "./Pages/GuessPage/GuessPage";
import HomePage from "./Pages/HomePage/HomePage";
import AddPage from "./Pages/AddPage/AddPage";
import CommentPage from "./Pages/CommentPage/CommentPage";
import AboutPage from "./Pages/AboutPage/AboutPage";
import FeedbackPage from "./Pages/FeedbackPage/FeedbackPage";
import PrivacyPage from "./Pages/PrivacyPage/PrivacyPage";
import SettingsPage from "./Pages/SettingsPage/SettingsPage";
import CreateGuessPage from "./Pages/CreateGuessPage/CreateGuessPage";
import TermsPage from "./Pages/TermsPage/TermsPage";
import DeletePage from "./Pages/DeletePage/DeletePage";
import EditProfile from "./Components/EditProfile";
import SearchBar from "./Components/SearchBar";
import Collections from "./Components/Collections";
import SelectedChat from "./Components/SelectedChat";
import SOD from "./Components/SOD";
import "./App.scss";

const LoginPage = React.lazy(() => import("./Pages/LoginPage/LoginPage"));
const RegisterPage = React.lazy(() =>
  import("./Pages/RegisterPage/RegisterPage")
);

const App = () => {
  const isMobile = window.matchMedia(
    "(min-width: 320px) and (max-width: 480px)"
  ).matches;
  const [loading, setLoading] = useState(true);
  const handleLoading = useCallback(() => {
    setLoading(false);
  }, [setLoading]);
  const [isMobileLandscape, setIsMobileLandscape] = useState(false);
  const { currentUser } = useContext(AuthContext);


  useEffect(() => {
    try {
      const handleOrientationChange = () => {
        setIsMobileLandscape(
          window.orientation === 90 || window.orientation === -90
        );
      };

      window.addEventListener("orientationchange", handleOrientationChange);

      return () => {
        window.removeEventListener(
          "orientationchange",
          handleOrientationChange
        );
      };
    } catch (err) {
      console.log("Error occured changing orientation", err);
    }
  }, []);



  const ProtectedRoute = ({ children }) =>
    !currentUser ? <Navigate to="/" /> : children;

  const router = createBrowserRouter([
    {
      path: "/",
      element: isMobile ? <LoginPage /> : <RegisterPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/home",
      element: (
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/selfie-of-the-day",
      element: (
        <ProtectedRoute>
          <SOD />
        </ProtectedRoute>
      ),
    },
    {
      path: "/search",
      element: (
        <ProtectedRoute>
          <SearchBar />
        </ProtectedRoute>
      ),
    },
    {
      path: "/inbox",
      element: (
        <ProtectedRoute>
          <InboxPage />,
        </ProtectedRoute>
      ),
    },
    {
      path: "/inbox/chat/:username",
      element: (
        <ProtectedRoute>
          <SelectedChat />
        </ProtectedRoute>
      ),
    },
    {
      path: "/collection/:id",
      element: (
        <ProtectedRoute>
          <Collections />
        </ProtectedRoute>
      ),
    },
    {
      path: "/add",
      element: (
        <ProtectedRoute>
          <AddPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/guess",
      element: (
        <ProtectedRoute>
          <GuessPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/create-guess",
      element: (
        <ProtectedRoute>
          <CreateGuessPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile/:id",
      element: (
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/profile/:id/edit",
      element: (
        <ProtectedRoute>
          <EditProfile />
        </ProtectedRoute>
      ),
    },

    {
      path: "/settings",
      element: (
        <ProtectedRoute>
          <SettingsPage />
        </ProtectedRoute>
      ),
    },

    {
      path: "/notification",
      element: (
        <ProtectedRoute>
          <NotificationPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/comment/:id",
      element: (
        <ProtectedRoute>
          <CommentPage />
        </ProtectedRoute>
      ),
    },
    {
      path: "/about",
      element: <AboutPage />,
    },
    {
      path: "/privacy",
      element: <PrivacyPage />,
    },
    {
      path: "/terms",
      element: <TermsPage />,
    },

    {
      path: "/feedback",
      element: (
        <ProtectedRoute>
          <FeedbackPage />
        </ProtectedRoute>
      ),
    },

    {
      path: "/delete",
      element: (
        <ProtectedRoute>
          <DeletePage />
        </ProtectedRoute>
      ),
    },

    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);

  return (
    <div className="app">
      {loading ? (
        <SplashPage setLoading={handleLoading} />
      ) : (
        <div className="content">
          {isMobileLandscape ? null : (
            <Suspense
              fallback={
                <div>
                  <LoadingSpinner />
                </div>
              }
            >
              <RouterProvider router={router} />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
};

export default App;

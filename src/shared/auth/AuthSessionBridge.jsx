<<<<<<< HEAD
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, setSessionReady } from '@/features/auth/authSlice';
import { tokenService } from '@/api/tokenService';
=======
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, setSessionReady } from "@/features/auth";
import { tokenService } from "@/api/cookies";
import AppBootLoadingScreen from "@/shared/ui/AppBootLoadingScreen";
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166

/**
 * Bootstraps auth when a token cookie exists: revalidates via /auth/me.
 * Mount under Redux Provider (outside or inside the router).
 */
const AuthSessionBridge = ({ children }) => {
  const dispatch = useDispatch();
  const sessionReady = useSelector((state) => state.auth.sessionReady);
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (bootstrapped.current) return;
    bootstrapped.current = true;

    const token = tokenService.getToken();
    if (!token) {
      dispatch(setSessionReady(true));
      return;
    }

    dispatch(fetchUserProfile());
  }, [dispatch]);

  if (!sessionReady) {
<<<<<<< HEAD
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F3F4F6] text-sm text-[#64748B]">
        Loading session…
      </div>
    );
=======
    return <AppBootLoadingScreen />;
>>>>>>> c808644a0c9b437c860d4ddfa30cdae891b67166
  }

  return children;
};

export default AuthSessionBridge;

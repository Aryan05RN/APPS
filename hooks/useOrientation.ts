
import { useState, useEffect, useCallback } from 'react';

export enum TiltAction {
  NONE = 'NONE',
  CORRECT = 'CORRECT', // Tilt down
  PASS = 'PASS'       // Tilt up
}

export const useOrientation = (isActive: boolean) => {
  const [tilt, setTilt] = useState<TiltAction>(TiltAction.NONE);
  const [isLocked, setIsLocked] = useState(false);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (!isActive || isLocked) return;

    const beta = event.beta; // Range: -180 to 180 (front-back tilt)
    
    if (beta === null) return;

    // Thresholds for forehead play
    // Phone upright (on forehead) is roughly beta = 90
    // Tilt down (towards ground) increases beta -> > 130
    // Tilt up (towards sky) decreases beta -> < 50
    
    if (beta > 135) {
      setTilt(TiltAction.CORRECT);
      setIsLocked(true);
      setTimeout(() => setIsLocked(false), 800); // Cool down to prevent double triggers
    } else if (beta < 45) {
      setTilt(TiltAction.PASS);
      setIsLocked(true);
      setTimeout(() => setIsLocked(false), 800);
    } else {
      setTilt(TiltAction.NONE);
    }
  }, [isActive, isLocked]);

  useEffect(() => {
    if (isActive) {
      window.addEventListener('deviceorientation', handleOrientation);
    } else {
      window.removeEventListener('deviceorientation', handleOrientation);
      setTilt(TiltAction.NONE);
    }
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [isActive, handleOrientation]);

  return tilt;
};

export async function requestOrientationPermission(): Promise<boolean> {
  const deviceOrientationEvent = DeviceOrientationEvent as any;
  if (typeof deviceOrientationEvent.requestPermission === 'function') {
    try {
      const permissionState = await deviceOrientationEvent.requestPermission();
      return permissionState === 'granted';
    } catch (error) {
      console.error(error);
      return false;
    }
  }
  return true; 
}

export async function lockToLandscape() {
  try {
    if (document.documentElement.requestFullscreen) {
      await document.documentElement.requestFullscreen();
    }
    if (screen.orientation && (screen.orientation as any).lock) {
      await (screen.orientation as any).lock('landscape');
    }
  } catch (err) {
    console.warn("Could not lock orientation or enter fullscreen:", err);
  }
}

export async function unlockOrientation() {
  try {
    if (screen.orientation && (screen.orientation as any).unlock) {
      (screen.orientation as any).unlock();
    }
    if (document.exitFullscreen && document.fullscreenElement) {
      await document.exitFullscreen();
    }
  } catch (err) {
    console.warn("Error unlocking orientation/exiting fullscreen:", err);
  }
}

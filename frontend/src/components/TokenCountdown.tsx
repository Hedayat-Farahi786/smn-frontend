import React, { useState, useEffect } from "react";
import { apiService } from "../services/api";

interface TokenCountdownProps {
  onExpiry?: () => void;
}

const TokenCountdown = ({ onExpiry }: TokenCountdownProps): string | null => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = apiService.getTimeUntilExpiry();
      setTimeRemaining(remaining);

      if (remaining <= 0) {
        onExpiry?.();
      }
    };

    // Update immediately
    updateTimer();

    // Update every second
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [onExpiry]);

  const formatTime = (milliseconds: number): string => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  if (timeRemaining <= 0) {
    return null;
  }

  return formatTime(timeRemaining);
};

export default TokenCountdown;

import React, { useEffect, useState } from "react";
import "../styles/queuedisplay.css";

const API_BASE = "https://verketbooking-backend.onrender.com/api";
const POLL_INTERVAL_MS = 15000;

function QueueDisplay() {
  const [queueData, setQueueData] = useState({
    activeGames: [],
    waitingQueue: [],
  });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let isActive = true;

    async function fetchQueueData() {
      try {
        const response = await fetch(`${API_BASE}/display/queue`);

        if (!response.ok) {
          throw new Error("Kunne ikke hente køstatus.");
        }

        const data = await response.json();

        if (!isActive) return;

        setQueueData({
          activeGames: Array.isArray(data.activeGames) ? data.activeGames : [],
          waitingQueue: Array.isArray(data.waitingQueue) ? data.waitingQueue : [],
        });
        setLastUpdated(new Date());
        setError(null);
      } catch {
        if (!isActive) return;
        setError("Klarte ikke å oppdatere køstatus akkurat nå.");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    fetchQueueData();
    const poller = setInterval(fetchQueueData, POLL_INTERVAL_MS);

    return () => {
      isActive = false;
      clearInterval(poller);
    };
  }, []);

  function formatClock(date) {
    return date.toLocaleTimeString("no-NO", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function getTimeLeft(endTime) {
    const now = currentTime.getTime();
    const end = new Date(endTime).getTime();
    const difference = end - now;

    if (difference <= 0) {
      return {
        totalMs: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const minutes = Math.floor(difference / 1000 / 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {
      totalMs: difference,
      minutes,
      seconds,
    };
  }

  function formatCountdown(minutes, seconds) {
    const sec = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutes}:${sec}`;
  }

  function getProgressPercent(startTime, endTime) {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const now = currentTime.getTime();

    const total = end - start;
    const remaining = end - now;

    if (total <= 0) return 0;
    if (remaining <= 0) return 0;

    const percent = (remaining / total) * 100;

    if (percent > 100) return 100;
    if (percent < 0) return 0;

    return percent;
  }

  function getNextReservationForGame(gameName) {
    return waitingQueue.find((item) => item.gameName === gameName) || null;
  }

  const activeGames = queueData.activeGames;
  const waitingQueue = queueData.waitingQueue;

  return (
    <div className="queue-display">
      <header className="queue-header">
        <div>
          <h1>Køoversikt</h1>
          <p>Live visning for kunder</p>
          <p className="queue-updated-at">
            {lastUpdated
              ? `Sist oppdatert ${formatClock(lastUpdated)}`
              : "Venter på første oppdatering"}
          </p>
        </div>

        <div className="queue-clock-box">
          <span>{formatClock(currentTime)}</span>
        </div>
      </header>

      {error && (
        <div className="queue-status-banner">
          {error} Viser siste kjente data.
        </div>
      )}

      <section className="queue-section">
        <div className="section-title-row">
          <h2>Spiller nå</h2>
          <span className="section-count">{activeGames.length} aktive</span>
        </div>

        <div className="active-grid">
          {isLoading ? (
            <p className="queue-empty-state">Laster køstatus...</p>
          ) : activeGames.length === 0 ? (
            <p className="queue-empty-state">Ingen spiller akkurat nå.</p>
          ) : (
            activeGames.map((item) => {
              const timeLeft = getTimeLeft(item.endTime);
              const progress = getProgressPercent(item.startTime, item.endTime);
              const nextReservation = getNextReservationForGame(item.gameName);

              return (
                <div className="active-card" key={item.id}>
                  <div className="card-top">
                    <div>
                     <p className="game-name">{item.gameName}</p>
                      <h3>{item.name}</h3>
                  </div>

                    <div className="live-pill">LIVE</div>
                  </div>

                  <div className="time-row">
                    <span>Tid igjen</span>
                    <strong>
                      {formatCountdown(timeLeft.minutes, timeLeft.seconds)}
                    </strong>
                  </div>

                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>

                  <div className="next-reservation-box">
                    <span className="next-reservation-label">Neste reservasjon</span>
                    {nextReservation ? (
                      <div className="next-reservation-content">
                        <strong>{nextReservation.name}</strong>
                      </div>
                    ) : (
                      <div className="next-reservation-content empty">
                        <strong>Ingen i kø</strong>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}

export default QueueDisplay;
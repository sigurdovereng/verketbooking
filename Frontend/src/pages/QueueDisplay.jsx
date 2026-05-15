import React, { useEffect, useState } from "react";
import { API_BASE } from "../config/api";
import "../styles/queuedisplay.css";

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
      hour12: false,
    });
  }

  function formatTime(isoString) {
    return new Date(isoString).toLocaleTimeString("no-NO", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
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

  function getMinutesUntil(startTime) {
    return Math.max(0, Math.ceil((new Date(startTime).getTime() - currentTime.getTime()) / 60000));
  }

  function formatStartsIn(minutes) {
    if (minutes <= 0) return "Starter nå";
    if (minutes < 60) return `Starter om ${minutes} min`;

    const hours = Math.floor(minutes / 60);
    const restMinutes = minutes % 60;
    return restMinutes > 0
      ? `Starter om ${hours}t ${restMinutes}m`
      : `Starter om ${hours}t`;
  }

  function getNextReservationForGame(gameId) {
    return waitingQueue.find((item) => item.gameId === gameId) || null;
  }

  function formatGameAndPlayer(gameName, playerName) {
    return `${gameName} - ${playerName}`;
  }

  const activeGames = queueData.activeGames;
  const waitingQueue = queueData.waitingQueue;
  const activeGameIds = new Set(activeGames.map((item) => item.gameId));
  const upcomingOnlyGames = waitingQueue.filter(
    (item, index, queue) =>
      !activeGameIds.has(item.gameId) &&
      queue.findIndex((candidate) => candidate.gameId === item.gameId) === index
  );
  const displayItems = [
    ...activeGames.map((item) => ({ type: "active", reservation: item })),
    ...upcomingOnlyGames.map((item) => ({ type: "upcoming", reservation: item })),
  ].sort((a, b) => {
    if (a.type !== b.type) return a.type === "active" ? -1 : 1;
    return new Date(a.reservation.startTime) - new Date(b.reservation.startTime);
  });
  const displayCount = displayItems.length;
  const densityClass =
    displayCount >= 9 ? "is-tight" : displayCount >= 6 ? "is-dense" : "";

  return (
    <div className={`queue-display ${densityClass}`}>
      <header className="queue-header">
        <div>
          <h1>KØOVERSIKT</h1>
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
          <h2>Aktive og kommende reservasjoner</h2>
          <span className="section-count">
            {activeGames.length} aktive / {upcomingOnlyGames.length} kommende
          </span>
        </div>

        <div
          className="active-list"
          style={{ "--display-count": Math.max(displayCount, 1) }}
        >
          {isLoading ? (
            <p className="queue-empty-state">Laster køstatus...</p>
          ) : displayCount === 0 ? (
            <p className="queue-empty-state">
              Ingen aktive eller kommende reservasjoner akkurat nå.
            </p>
          ) : (
            displayItems.map(({ type, reservation: item }) => {
              const isActive = type === "active";
              const timeLeft = getTimeLeft(item.endTime);
              const startsIn = getMinutesUntil(item.startTime);
              const progress = isActive
                ? getProgressPercent(item.startTime, item.endTime)
                : 0;
              const nextReservation = isActive
                ? getNextReservationForGame(item.gameId)
                : item;

              return (
                <div className={`active-card ${isActive ? "is-active" : "is-upcoming"}`} key={`${type}-${item.id}`}>
                  <div className="reservation-main">
                    <div className="reservation-title-row">
                      <h3>{formatGameAndPlayer(item.gameName, item.name)}</h3>
                      <div className={`status-pill ${isActive ? "live-pill" : "upcoming-pill"}`}>
                        {isActive ? "LIVE" : "KOMMER"}
                      </div>
                    </div>
                    <p>
                      {isActive
                        ? `${formatTime(item.startTime)} - ${formatTime(item.endTime)}`
                        : formatStartsIn(startsIn)}
                    </p>
                  </div>

                  <div className="time-row">
                    <span>{isActive ? "Tid igjen" : "Starter"}</span>
                    <strong>
                      {isActive
                        ? formatCountdown(timeLeft.minutes, timeLeft.seconds)
                        : formatTime(item.startTime)}
                    </strong>
                  </div>

                  {isActive && (
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  )}

                  <div className="next-reservation-box">
                    <span className="next-reservation-label">
                      {isActive ? "Neste reservasjon" : "Kommende reservasjon"}
                    </span>
                    {nextReservation ? (
                      <div className="next-reservation-content">
                        {isActive ? (
                          <>
                            <strong>{nextReservation.name}</strong>
                            <span>{formatTime(nextReservation.startTime)}</span>
                          </>
                        ) : (
                          <strong>
                            {item.name}
                            <span>{formatTime(item.startTime)}</span>
                          </strong>
                        )}
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

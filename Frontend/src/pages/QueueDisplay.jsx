import React, { useEffect, useState } from "react";
import { API_BASE } from "../config/api";
import "../styles/queuedisplay.css";

const POLL_INTERVAL_MS = 15000;

function QueueDisplay() {
  const [queueData, setQueueData] = useState({
    activeGames: [],
    waitingQueue: [],
    games: [],
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
        const [queueResponse, gamesResponse] = await Promise.all([
          fetch(`${API_BASE}/display/queue`),
          fetch(`${API_BASE}/display/games`),
        ]);

        if (!queueResponse.ok || !gamesResponse.ok) {
          throw new Error("Kunne ikke hente køstatus.");
        }

        const queue = await queueResponse.json();
        const games = await gamesResponse.json();

        if (!isActive) return;

        setQueueData({
          activeGames: Array.isArray(queue.activeGames) ? queue.activeGames : [],
          waitingQueue: Array.isArray(queue.waitingQueue) ? queue.waitingQueue : [],
          games: Array.isArray(games) ? games : [],
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
  const games = queueData.games;

  const displayItems = games
      .map((game) => {
        const activeReservation =
            activeGames.find((item) => item.gameId === game.id) || null;

        const nextReservation =
            waitingQueue
                .filter((item) => item.gameId === game.id)
                .sort(
                    (a, b) =>
                        new Date(a.startTime).getTime() -
                        new Date(b.startTime).getTime()
                )[0] || null;

        return {
          game,
          activeReservation,
          nextReservation,
          isActive: !!activeReservation,
        };
      })
      .sort((a, b) => {
        if (a.isActive !== b.isActive) {
          return a.isActive ? -1 : 1;
        }

        return a.game.id - b.game.id;
      });

  const displayCount = displayItems.length;

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
            {activeGames.length} aktive / {games.length - activeGames.length} ledige
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
              displayItems.map(
                  ({ game, activeReservation, nextReservation, isActive }) => {
                    const item = activeReservation;
                    const timeLeft = isActive
                        ? getTimeLeft(item.endTime)
                        : null;

                    const progress = isActive
                        ? getProgressPercent(item.startTime, item.endTime)
                        : 0;

              return (
                <div className={`active-card ${isActive ? "is-active" : "is-available"}`} key={game.id}>
                  <div className="reservation-main">
                    <div className="reservation-title-row">
                      <h3>
                        {isActive
                            ? formatGameAndPlayer(game.name, activeReservation.name)
                            : game.name}
                      </h3>
                      <div
                          className={`status-pill ${
                              isActive ? "live-pill" : "available-pill"
                          }`}
                      >
                        {isActive ? "LIVE" : "LEDIG"}
                      </div>
                    </div>
                    <p>
                      {isActive
                          ? `${formatTime(activeReservation.startTime)} - ${formatTime(activeReservation.endTime)}`
                          : "Ledig nå"}
                    </p>
                  </div>

                  <div className="time-row">
                    <span>{isActive ? "Tid igjen" : "Status"}</span>
                    <strong>
                      {isActive
                          ? formatCountdown(timeLeft.minutes, timeLeft.seconds)
                          : "Ledig"}
                    </strong>
                  </div>

                  {isActive && (
                      <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                      </div>
                  )}

                  <div className="next-reservation-box">
                      <span className="next-reservation-label">
                        Neste reservasjon
                      </span>

                    {nextReservation ? (
                        <div className="next-reservation-content">
                          <strong>{nextReservation.name}</strong>
                          <span>{formatTime(nextReservation.startTime)}</span>
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

import React, { useEffect, useMemo, useState } from "react";
import "../styles/queuedisplay.css";

function QueueDisplay() {
  const initialQueue = useMemo(() => {
    const now = Date.now();

    return [
      {
        id: 1,
        name: "Marius",
        game: "Shuffleboard 1",
        status: "Spiller nå",
        durationMinutes: 60,
        startTime: new Date(now - 18 * 60 * 1000).toISOString(),
        endTime: new Date(now + 42 * 60 * 1000).toISOString(),
      },
      {
        id: 2,
        name: "Emma",
        game: "Biljard 2",
        status: "Spiller nå",
        durationMinutes: 45,
        startTime: new Date(now - 12 * 60 * 1000).toISOString(),
        endTime: new Date(now + 33 * 60 * 1000).toISOString(),
      },
      {
        id: 3,
        name: "Jonas",
        game: "Dart 1",
        status: "Neste i kø",
      },
      {
        id: 4,
        name: "Sofie",
        game: "Shuffleboard 2",
        status: "Neste i kø",
      },
      {
        id: 5,
        name: "Lina",
        game: "Biljard 1",
        status: "Neste i kø",
      },
    ];
  }, []);

  const [queueData, setQueueData] = useState(initialQueue);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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

  const activeGames = queueData.filter((item) => item.status === "Spiller nå");
  const waitingQueue = queueData.filter((item) => item.status === "Neste i kø");

  return (
    <div className="queue-display">
      <header className="queue-header">
        <div>
          <h1>Køoversikt</h1>
          <p>Live visning for kunder</p>
        </div>

        <div className="queue-clock-box">
          <span>{formatClock(currentTime)}</span>
        </div>
      </header>

      <section className="queue-section">
        <div className="section-title-row">
          <h2>Spiller nå</h2>
          <span className="section-count">{activeGames.length} aktive</span>
        </div>

        <div className="active-grid">
          {activeGames.map((item) => {
            const timeLeft = getTimeLeft(item.endTime);
            const progress = getProgressPercent(item.startTime, item.endTime);

            return (
              <div className="active-card" key={item.id}>
                <div className="card-top">
                  <div>
                    <h3>{item.name}</h3>
                    <p className="game-name">{item.game}</p>
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
              </div>
            );
          })}
        </div>
      </section>

      <section className="queue-section">
        <div className="section-title-row">
          <h2>Neste i kø</h2>
          <span className="section-count">{waitingQueue.length} venter</span>
        </div>

        <div className="waiting-list">
          {waitingQueue.map((item, index) => (
            <div className="waiting-row" key={item.id}>
              <div className="queue-number">{index + 1}</div>

              <div className="waiting-info">
                <h3>{item.name}</h3>
                <p>{item.game}</p>
              </div>

              <div className="waiting-status">Venter</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default QueueDisplay;
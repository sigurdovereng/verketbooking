import { useRef, useEffect, useState } from "react";
import "../styles/timepicker.css";

const ITEM_H = 56;
const PAD = 1;

function pad(n) {
  return String(n).padStart(2, "0");
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5);

function WheelCol({ items, value, onChange }) {
  const ref = useRef(null);
  const snapTimer = useRef(null);
  const isUserScrolling = useRef(false);

  useEffect(() => {
    const i = items.indexOf(value);

    if (ref.current && i >= 0) {
      ref.current.scrollTop = i * ITEM_H;
    }
  }, []);

  useEffect(() => {
    if (isUserScrolling.current) return;

    const i = items.indexOf(value);

    if (ref.current && i >= 0) {
      ref.current.scrollTo({
        top: i * ITEM_H,
        behavior: "smooth",
      });
    }
  }, [value, items]);

  function handleScroll() {
    isUserScrolling.current = true;

    clearTimeout(snapTimer.current);

    snapTimer.current = setTimeout(() => {
      isUserScrolling.current = false;

      if (!ref.current) return;

      const i = Math.round(ref.current.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(items.length - 1, i));

      ref.current.scrollTo({
        top: clamped * ITEM_H,
        behavior: "smooth",
      });

      onChange(items[clamped]);
    }, 80);
  }

  function handleClick(item, i) {
    ref.current?.scrollTo({
      top: i * ITEM_H,
      behavior: "smooth",
    });

    onChange(item);
  }

  return (
      <div className="wheel-col">
        <div
            className="wheel-scroller"
            ref={ref}
            onScroll={handleScroll}
        >
          {Array.from({ length: PAD }, (_, i) => (
              <div key={`t${i}`} className="wheel-pad" />
          ))}

          {items.map((item, i) => (
              <div
                  key={item}
                  className={`wheel-item${item === value ? " sel" : ""}`}
                  onClick={() => handleClick(item, i)}
              >
                {pad(item)}
              </div>
          ))}

          {Array.from({ length: PAD }, (_, i) => (
              <div key={`b${i}`} className="wheel-pad" />
          ))}
        </div>
      </div>
  );
}

function defaultTime() {
  const now = new Date();
  const h = now.getHours();
  const rawM = now.getMinutes();
  const m = Math.ceil(rawM / 5) * 5;

  return m >= 60
      ? [(h + 1) % 24, 0]
      : [h, m];
}

function defaultTime() {
  const now = new Date();
  const h = now.getHours();
  const rawM = now.getMinutes();
  const m = Math.ceil(rawM / 5) * 5;

  return m >= 60
      ? [(h + 1) % 24, 0]
      : [h, m];
}

function parseValue(value) {
  if (!value) {
    return defaultTime();
  }

  const [hStr, mStr] = value.split(":");

  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);

  if (isNaN(h) || isNaN(m)) {
    return defaultTime();
  }

  return [h, m];
}

export default function TimePicker({ value, onChange }) {
  const [initH, initM] = parseValue(value);

  const [pendingH, setPendingH] = useState(initH);
  const [pendingM, setPendingM] = useState(initM);

  // Hvis AddReservationModal bestemmer et nytt tidspunkt,
  // synkroniser skrollehjulet med dette.
  useEffect(() => {
    if (!value) return;

    const [h, m] = parseValue(value);

    setPendingH(h);
    setPendingM(m);
  }, [value]);

  function handleHourChange(hour) {
    setPendingH(hour);

    onChange(
        `${pad(hour)}:${pad(pendingM)}`
    );
  }

  function handleMinuteChange(minute) {
    setPendingM(minute);

    onChange(
        `${pad(pendingH)}:${pad(minute)}`
    );
  }

  return (
      <div className="time-picker-wrapper">
        <div className="time-picker">

          <WheelCol
              items={HOURS}
              value={pendingH}
              onChange={handleHourChange}
          />

          <div className="wheel-colon">:</div>

          <WheelCol
              items={MINUTES}
              value={pendingM}
              onChange={handleMinuteChange}
          />

          <div
              className="wheel-fade"
              aria-hidden="true"
          />

          <div
              className="wheel-sel-band"
              aria-hidden="true"
          />

        </div>
      </div>
  );
}
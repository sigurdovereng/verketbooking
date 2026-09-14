import { useRef, useEffect } from "react";
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
  const userScrolling = useRef(false);

  useEffect(() => {
    const index = items.indexOf(value);

    if (ref.current && index >= 0) {
      // Ikke smooth her. Dette er kun synkronisering fra parent.
      ref.current.scrollTop = index * ITEM_H;
    }
  }, [value, items]);

  function startUserScroll() {
    userScrolling.current = true;
  }

  function handleScroll() {
    // Ignorer scrolling som skyldes at React flytter hjulet
    if (!userScrolling.current) return;

    clearTimeout(snapTimer.current);

    snapTimer.current = setTimeout(() => {
      if (!ref.current) return;

      const index = Math.round(ref.current.scrollTop / ITEM_H);
      const clamped = Math.max(
          0,
          Math.min(items.length - 1, index)
      );

      ref.current.scrollTo({
        top: clamped * ITEM_H,
        behavior: "smooth",
      });

      onChange(items[clamped]);

      userScrolling.current = false;
    }, 100);
  }

  function handleClick(item, index) {
    userScrolling.current = false;

    ref.current?.scrollTo({
      top: index * ITEM_H,
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
            onTouchStart={startUserScroll}
            onMouseDown={startUserScroll}
            onWheel={startUserScroll}
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

function roundCurrentTime() {
  const now = new Date();

  let hours = now.getHours();
  let minutes = Math.ceil(now.getMinutes() / 5) * 5;

  if (minutes >= 60) {
    minutes = 0;
    hours = (hours + 1) % 24;
  }

  return [hours, minutes];
}

function parseValue(value) {
  if (!value) {
    return roundCurrentTime();
  }

  const [hourText, minuteText] = value.split(":");

  const hours = Number(hourText);
  const minutes = Number(minuteText);

  if (
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      hours < 0 ||
      hours > 23 ||
      minutes < 0 ||
      minutes > 59
  ) {
    return roundCurrentTime();
  }

  return [hours, minutes];
}

export default function TimePicker({ value, onChange }) {
  const [hours, minutes] = parseValue(value);

  function handleHourChange(newHour) {
    onChange(`${pad(newHour)}:${pad(minutes)}`);
  }

  function handleMinuteChange(newMinute) {
    onChange(`${pad(hours)}:${pad(newMinute)}`);
  }

  return (
      <div className="time-picker-wrapper">
        <div className="time-picker">
          <WheelCol
              items={HOURS}
              value={hours}
              onChange={handleHourChange}
          />

          <div className="wheel-colon">:</div>

          <WheelCol
              items={MINUTES}
              value={minutes}
              onChange={handleMinuteChange}
          />

          <div className="wheel-fade" aria-hidden="true" />
          <div className="wheel-sel-band" aria-hidden="true" />
        </div>
      </div>
  );
}
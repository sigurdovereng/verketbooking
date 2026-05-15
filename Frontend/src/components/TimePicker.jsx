import { useRef, useEffect } from "react";
import "../styles/timepicker.css";

const ITEM_H = 56;
const PAD = 2; // spacer-elementer øverst og nederst → 5 synlige rader totalt

function pad(n) {
  return String(n).padStart(2, "0");
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10, ..., 55

function WheelCol({ items, value, onChange }) {
  const ref = useRef(null);
  const snapTimer = useRef(null);
  const isUserScrolling = useRef(false);

  // Hopp uten animasjon ved første render
  useEffect(() => {
    const i = items.indexOf(value);
    if (ref.current && i >= 0) {
      ref.current.scrollTop = i * ITEM_H;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Følg ekstern verdiendring med smooth scroll (men ikke når brukeren scroller)
  useEffect(() => {
    if (isUserScrolling.current) return;
    const i = items.indexOf(value);
    if (ref.current && i >= 0) {
      ref.current.scrollTo({ top: i * ITEM_H, behavior: "smooth" });
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
      ref.current.scrollTo({ top: clamped * ITEM_H, behavior: "smooth" });
      onChange(items[clamped]);
    }, 80);
  }

  function handleClick(item, i) {
    ref.current?.scrollTo({ top: i * ITEM_H, behavior: "smooth" });
    onChange(item);
  }

  return (
    <div className="wheel-col">
      <div className="wheel-scroller" ref={ref} onScroll={handleScroll}>
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
  return m >= 60 ? [(h + 1) % 24, 0] : [h, m];
}

function parseValue(value) {
  if (!value) return defaultTime();
  const [hStr, mStr] = value.split(":");
  const h = parseInt(hStr, 10);
  const rawM = parseInt(mStr, 10);
  const m = Math.round(rawM / 5) * 5 % 60;
  return isNaN(h) || isNaN(m) ? defaultTime() : [h, m];
}

export default function TimePicker({ value, onChange }) {
  const [h, m] = parseValue(value);

  // Initialiser parent-state hvis tom
  useEffect(() => {
    if (!value) {
      const [dh, dm] = defaultTime();
      onChange(`${pad(dh)}:${pad(dm)}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setHour(newH) {
    onChange(`${pad(newH)}:${pad(m)}`);
  }

  function setMinute(newM) {
    onChange(`${pad(h)}:${pad(newM)}`);
  }

  return (
    <div className="time-picker">
      <WheelCol items={HOURS} value={h} onChange={setHour} />
      <div className="wheel-colon">:</div>
      <WheelCol items={MINUTES} value={m} onChange={setMinute} />
      <div className="wheel-fade" aria-hidden="true" />
      <div className="wheel-sel-band" aria-hidden="true" />
    </div>
  );
}

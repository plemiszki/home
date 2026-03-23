import React, { useEffect, useState } from "react";

function Debug() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [volumeInput, setVolumeInput] = useState("");

  useEffect(() => {
    function fetchData() {
      fetch("/api/debug")
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((body) => {
          setData(body);
          setError(false);
        })
        .catch(() => setError(true));
    }
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (data?.volume !== undefined) {
      setVolumeInput(String(data.volume));
    }
  }, [data?.volume]);

  useEffect(() => {
    if (volumeInput === "" || parseInt(volumeInput, 10) === data?.volume)
      return;
    fetch("/api/debug/volume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ volume: parseInt(volumeInput, 10) }),
    })
      .then((res) => res.json())
      .then((body) => setData((prev) => ({ ...prev, volume: body.volume })));
  }, [volumeInput]);

  return (
    <div className="handy-component">
      <div className="white-box">
        {error ? (
          <p style={{ color: "red" }}>Server not responding.</p>
        ) : (
          <>
            <p>
              <strong>Active loops:</strong>{" "}
              {(() => {
                const count = data?.activeLoops?.length ?? 0;
                const indicator =
                  count === 1 ? (
                    <span style={{ color: "green" }}>✓</span>
                  ) : count === 0 ? (
                    <span style={{ color: "red" }}>✗</span>
                  ) : (
                    <span style={{ color: "red" }}>!</span>
                  );
                const detail = count
                  ? data.activeLoops
                      .map((l) => `(${l.secondsAgo}s ago)`)
                      .join(", ")
                  : "—";
                return (
                  <>
                    {count} {indicator} {detail}
                  </>
                );
              })()}
            </p>
            <p>
              <strong>Track:</strong> {data?.track ?? "—"}
            </p>
            <p>
              <strong>Album ID:</strong> {data?.albumId ?? "—"}
            </p>
            <p>
              <strong>Processes:</strong> {data?.processes?.join(", ") || "—"}
            </p>
            <p>
              <strong>mpv PIDs:</strong> {data?.mpvPids ?? "—"}
            </p>
            <p>
              <strong>Volume:</strong> {volumeInput}
              <input
                type="range"
                min="0"
                max="130"
                value={volumeInput}
                onChange={(e) => setVolumeInput(e.target.value)}
                style={{ width: 150, verticalAlign: "middle", padding: 0 }}
              />
            </p>
            <p></p>
          </>
        )}
      </div>
    </div>
  );
}

export default Debug;

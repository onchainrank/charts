import React from "react";

const SingleHeader = ({
  recentCSolVal,
  max_cactor_rank,
  recentActorRank,
  dex_paid,
  valid_launch,
  valid_socials,
  unique_socials,
  bullx,
  pf_updating,
  pf_iter,
  pf_updated,
  pf_next_update,
}) => {
  const fmt = (ts) => new Date(ts * 1000).toLocaleString();

  // Volume color
  const volume = Number(recentCSolVal);
  let volumeColor = "green";
  if (volume < 200) volumeColor = "red";
  else if (volume < 400) volumeColor = "orange";

  // MCAR color
  const mcarN = Number(max_cactor_rank);
  let mcarColor = mcarN > 120 ? "green" : mcarN < 70 ? "red" : "orange";

  // AR styling
  const ar = Math.round(Number(recentActorRank));
  let arColor = ar < 60 ? "red" : ar < 80 ? "orange" : "green";
  const arStyle = ar > 120 ? { fontWeight: "bold" } : {};

  return (
    <div className="card-header d-flex align-items-center flex-wrap">
      <img
        src="/logo.png"
        alt="Logo"
        style={{ height: "24px", width: "auto", marginRight: "10px" }}
      />

      <span style={{ color: volumeColor, marginRight: 8 }}>
        Volume: {recentCSolVal}
      </span>
      <span style={{ color: mcarColor, marginRight: 8 }}>
        MCAR: {max_cactor_rank}
      </span>
      <span style={{ color: arColor, ...arStyle, marginRight: 8 }}>
        AR: {ar}
      </span>

      {bullx !== undefined && (
        <span style={{ marginRight: 8 }}>BullX: {bullx}</span>
      )}

      {dex_paid && (
        <span className="badge bg-success ms-2" style={{ marginRight: 8 }}>
          dex paid
        </span>
      )}

      {/* valid_launch logic */}
      {valid_launch === false && (
        <span
          className="ms-2"
          title="Suspicious coin launch detected: automated bot usage or patterns similar to known scam coins identified."
          style={{ marginRight: 8, cursor: "help" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="red"
            className="bi bi-rocket"
            viewBox="0 0 16 16"
          >
            <path d="M8 8c.828 0 1.5-.895 1.5-2S8.828 4 8 4s-1.5.895-1.5 2S7.172 8 8 8" />
            <path d="M11.953 8.81c-.195-3.388-.968-5.507-1.777-6.819C9.707 1.233 9.23.751 8.857.454a3.5 3.5 0 0 0-.463-.315A2 2 0 0 0 8.25.064.55.55 0 0 0 8 0a.55.55 0 0 0-.266.073 2 2 0 0 0-.142.08 4 4 0 0 0-.459.33c-.37.308-.844.803-1.31 1.57-.805 1.322-1.577 3.433-1.774 6.756l-1.497 1.826-.004.005A2.5 2.5 0 0 0 2 12.202V15.5a.5.5 0 0 0 .9.3l1.125-1.5c.166-.222.42-.4.752-.57.214-.108.414-.192.625-.281l.198-.084c.7.428 1.55.635 2.4.635s1.7-.207 2.4-.635q.1.044.196.083c.213.09.413.174.627.282.332.17.586.348.752.57l1.125 1.5a.5.5 0 0 0 .9-.3v-3.298a2.5 2.5 0 0 0-.548-1.562zM12 10.445v.055c0 .866-.284 1.585-.75 2.14.146.064.292.13.425.199.39.197.8.46 1.1.86L13 14v-1.798a1.5 1.5 0 0 0-.327-.935zM4.75 12.64C4.284 12.085 4 11.366 4 10.5v-.054l-.673.82a1.5 1.5 0 0 0-.327.936V14l.225-.3c.3-.4.71-.664 1.1-.861.133-.068.279-.135.425-.199M8.009 1.073q.096.06.226.163c.284.226.683.621 1.09 1.28C10.137 3.836 11 6.237 11 10.5c0 .858-.374 1.48-.943 1.893C9.517 12.786 8.781 13 8 13s-1.517-.214-2.057-.607C5.373 11.979 5 11.358 5 10.5c0-4.182.86-6.586 1.677-7.928.409-.67.81-1.082 1.096-1.32q.136-.113.236-.18Z" />
            <path d="M9.479 14.361c-.48.093-.98.139-1.479.139s-.999-.046-1.479-.139L7.6 15.8a.5.5 0 0 0 .8 0z" />
          </svg>
        </span>
      )}

      {valid_launch === true && (
        <>
          {!valid_socials && (
            <span
              className="ms-2"
              title="Social accounts incorrectly added or misleading: invalid links or duplicate pages detected."
              style={{ marginRight: 8, cursor: "help" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="red"
                className="bi bi-facebook"
                viewBox="0 0 16 16"
              >
                <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951" />
              </svg>
            </span>
          )}
          {!unique_socials && (
            <span
              className="ms-2"
              title="Social account already used: duplicate pages detected."
              style={{ marginRight: 8, cursor: "help" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="red"
                className="bi bi-twitter"
                viewBox="0 0 16 16"
              >
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15" />
              </svg>
            </span>
          )}
        </>
      )}

      <span style={{ marginLeft: "auto", fontSize: "0.9em" }}>
        PF Updating: {pf_updating ? "Yes" : "No"} | Iter: {pf_iter} | Updated:{" "}
        {fmt(pf_updated)} | Next: {fmt(pf_next_update)}
      </span>
    </div>
  );
};

export default SingleHeader;

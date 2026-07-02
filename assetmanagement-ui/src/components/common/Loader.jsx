export default function Loader() {
  return (
    <div className="loading-wrapper">
      <div className="text-center">
        <div
          className="spinner-border text-primary"
          style={{ width: "48px", height: "48px" }}
        />
        <p className="mt-3 text-muted">Loading...</p>
      </div>
    </div>
  );
}
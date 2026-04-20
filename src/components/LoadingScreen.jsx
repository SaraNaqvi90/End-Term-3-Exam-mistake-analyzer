function LoadingScreen({ message = "Loading..." }) {
  return (
    <div className="loading-screen">
      <div className="loading-card">
        <div className="spinner" />
        <p>{message}</p>
      </div>
    </div>
  );
}

export default LoadingScreen;

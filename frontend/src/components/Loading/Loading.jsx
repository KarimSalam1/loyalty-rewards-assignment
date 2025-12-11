import { useLoading } from "../../context/loading/useLoading";
import "./Loading.css?v=1.0.4";

export default function Loading() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="lr-loading-overlay">
      <div className="lr-bar-container">
        <div className="lr-road"></div>

        <div className="lr-car-wrapper">
          <img src="./sport-car.png" className="lr-car-img" alt="car" />
        </div>

        <p className="lr-loading-text">Processing request...</p>
      </div>
    </div>
  );
}

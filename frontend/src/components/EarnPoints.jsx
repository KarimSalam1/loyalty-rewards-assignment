import { useState } from "react";
import { api } from "../api";

export default function EarnPoints() {
  const [customerId, setCustomerId] = useState("");
  const [category, setCategory] = useState("");
  const [points, setPoints] = useState("");
  const [rentalDuration, setRentalDuration] = useState("");
  const [milesDriven, setMilesDriven] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const earn = async () => {
    setError("");
    setSuccess("");

    if (!customerId) {
      setError("Customer ID is required");
      return;
    }
    if (!category) {
      setError("Please select a category");
      return;
    }

    try {
      let payload = {
        customerId: Number(customerId),
        category,
        description,
      };

      if (category === "NTM") {
        if (!rentalDuration || !milesDriven) {
          setError("NTM requires rental duration and miles driven");
          return;
        }

        const calcRes = await api.post("/calculate", {
          customerId: Number(customerId),
          rentalDuration: Number(rentalDuration),
          milesDriven: Number(milesDriven),
        });

        const earnedPoints = calcRes.data.total;

        payload.rentalDuration = Number(rentalDuration);
        payload.milesDriven = Number(milesDriven);
        setSuccess(
          `Request to earn ${earnedPoints} NTM points submitted successfully!`
        );
      } else {
        if (!points) {
          setError("Points are required for this category");
          return;
        }
        setSuccess(`Request to earn ${points} points submitted successfully!`);
        payload.points = Number(points);
      }

      await api.post("/earn", payload);

      setPoints("");
      setRentalDuration("");
      setMilesDriven("");
      setDescription("");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-md">
      <h2 className="text-xl font-semibold mb-3">Earn Points</h2>

      <input
        type="number"
        placeholder="Customer ID"
        className="w-full border p-2 rounded mb-3"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
      />

      <select
        className="w-full border p-2 rounded mb-3"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        <option value="NTM">NTM (Time & Mileage)</option>
        <option value="PROMOTIONAL">Promotional</option>
        <option value="CPC">CPC (Counter Products)</option>
      </select>

      {category === "NTM" && (
        <>
          <input
            type="number"
            placeholder="Rental Duration (days)"
            className="w-full border p-2 rounded mb-3"
            value={rentalDuration}
            onChange={(e) => setRentalDuration(e.target.value)}
          />

          <input
            type="number"
            placeholder="Miles Driven"
            className="w-full border p-2 rounded mb-3"
            value={milesDriven}
            onChange={(e) => setMilesDriven(e.target.value)}
          />
        </>
      )}

      {(category === "PROMOTIONAL" || category === "CPC") && (
        <input
          type="number"
          placeholder="Points"
          className="w-full border p-2 rounded mb-3"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
        />
      )}

      <input
        type="text"
        placeholder="Description (optional)"
        className="w-full border p-2 rounded mb-3"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button
        onClick={earn}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer w-full"
      >
        Submit Earn Transaction
      </button>

      {error && <p className="text-red-600 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
}

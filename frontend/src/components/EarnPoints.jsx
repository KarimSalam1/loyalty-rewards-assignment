import { useState, useEffect } from "react";
import { api } from "../api";
import { useReset } from "../context/reset/useReset";

export default function EarnPoints() {
  const [customerId, setCustomerId] = useState("");
  const [category, setCategory] = useState("");
  const [points, setPoints] = useState("");
  const [rentalDuration, setRentalDuration] = useState("");
  const [milesDriven, setMilesDriven] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register, resetAll } = useReset();

  const earn = async () => {
    resetFields();
    resetAll();

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

        payload.points = Number(points);
        setSuccess(`Request to earn ${points} points submitted successfully!`);
      }

      await api.post("/earn", payload);
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong");
    }
  };

  const resetFields = () => {
    setCustomerId("");
    setCategory("");
    setPoints("");
    setRentalDuration("");
    setMilesDriven("");
    setDescription("");
    setError("");
    setSuccess("");
  };

  useEffect(() => {
    register(() => {
      resetFields();
    });
  }, []);

  return (
    <div className="space-y-4 text-slate-100">
      <h2 className="text-xl font-semibold text-center">Earn Points</h2>

      <div className="space-y-1">
        <label className="text-sm text-slate-300">Customer ID</label>
        <input
          type="number"
          placeholder="Enter customer ID"
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded-md focus:outline-none focus:border-blue-500"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm text-slate-300">Category</label>
        <select
          className="w-full bg-slate-800 border border-slate-700 text-slate-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="NTM">NTM (Time & Mileage)</option>
          <option value="PROMOTIONAL">Promotional</option>
          <option value="CPC">CPC (Counter Products)</option>
        </select>
      </div>

      {category === "NTM" && (
        <>
          <div className="space-y-1">
            <label className="text-sm text-slate-300">
              Rental Duration (days)
            </label>
            <input
              type="number"
              placeholder="Days"
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded-md focus:outline-none focus:border-blue-500"
              value={rentalDuration}
              onChange={(e) => setRentalDuration(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-slate-300">Miles Driven</label>
            <input
              type="number"
              placeholder="Miles"
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded-md focus:outline-none focus:border-blue-500"
              value={milesDriven}
              onChange={(e) => setMilesDriven(e.target.value)}
            />
          </div>
        </>
      )}

      {(category === "PROMOTIONAL" || category === "CPC") && (
        <div className="space-y-1">
          <label className="text-sm text-slate-300">Points</label>
          <input
            type="number"
            placeholder="Points"
            className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded-md focus:outline-none focus:border-blue-500"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </div>
      )}

      <div className="space-y-1">
        <label className="text-sm text-slate-300">Description</label>
        <input
          type="text"
          placeholder="Optional description"
          className="w-full bg-slate-800 border border-slate-700 text-slate-100 p-2 rounded-md focus:outline-none focus:border-blue-500"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        onClick={earn}
        className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 cursor-pointer mx-auto block w-40 text-center"
      >
        Submit Earn
      </button>

      {error && <p className="text-red-400 text-center">{error}</p>}
      {success && <p className="text-green-400 text-center">{success}</p>}
    </div>
  );
}

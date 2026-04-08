import { useEffect, useState } from "react";
import API from "../services";
import { useNavigate } from "react-router-dom";

export default function Profile({user, setUser}) {
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        navigate("/register"); // not logged in
      });
  }, []);

  const handleLogout = async () => {
    await API.post("/auth/logout");
    setUser(null);
    navigate("/home");
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 w-[350px] text-center">
        
        <h1 className="text-2xl font-bold mb-4">👤 Profile</h1>

        <div className="mb-4">
          <p className="font-semibold">Name:</p>
          <p>{user.firstname} {user.lastname}</p>
        </div>

        <div className="mb-4">
          <p className="font-semibold">Username:</p>
          <p>{user.username}</p>
        </div>

        <div className="mb-6">
          <p className="font-semibold">Email:</p>
          <p>{user.email}</p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>

      </div>
    </div>
  );
}
import { useEffect } from "react";
import API from "../services";
import { useNavigate } from "react-router-dom";

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/auth/me")
      .then((res) => {
        setUser(res.data.user);
      })
      .catch(() => {
        navigate("/register"); 
      });
  }, []);

  const handleLogout = async () => {
    await API.post("/auth/logout");
    setUser(null);
    navigate("/");
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex pt-24">

      {/* 🔹 LEFT SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-6 hidden md:block">
        <h2 className="text-xl font-bold mb-6">MockMate AI</h2>

        <ul className="space-y-4 text-gray-700">
          <li className="cursor-pointer hover:text-blue-500">Profile</li>
          <li className="cursor-pointer hover:text-blue-500">My Tests</li>
          <li className="cursor-pointer hover:text-blue-500">Progress</li>
          <li className="cursor-pointer hover:text-blue-500">Settings</li>
        </ul>

        <button
          onClick={handleLogout}
          className="mt-10 w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/*  RIGHT CONTENT */}
      <div className="flex-1 p-6">

        {/*  TOP PROFILE CARD */}
        <div className="bg-white shadow rounded-xl p-6 flex items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
            {user?.firstname?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              {user.firstname.toUpperCase()} {user.lastname.toUpperCase()}
            </h2>
            <p className="text-gray-500">@{user.username}</p>
          </div>
        </div>

        {/*  USER INFO */}
        <div className="bg-white shadow rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">User Info</h3>

          <div className="space-y-2 text-gray-700">
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">User ID:</span> {user._id}</p>
          </div>
        </div>

        {/*  STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h3 className="text-xl font-bold">12</h3>
            <p className="text-gray-500">Tests Attempted</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h3 className="text-xl font-bold">78%</h3>
            <p className="text-gray-500">Average Score</p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow text-center">
            <h3 className="text-xl font-bold">5</h3>
            <p className="text-gray-500">Topics Covered</p>
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div className="bg-white shadow rounded-xl p-6 mt-6">
          <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>

          <ul className="space-y-2 text-gray-600">
            <li>✔ Completed DSA - Array (Medium)</li>
            <li>✔ Attempted Aptitude Test</li>
            <li>✔ Scored 80% in CS Fundamentals</li>
          </ul>
        </div>

      </div>
    </div>
  );
}
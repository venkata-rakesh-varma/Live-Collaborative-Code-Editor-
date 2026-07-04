import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-900 text-white">
      <h1 className="text-5xl font-bold mb-4">
        Live Collaborative Code Editor
      </h1>

      <p className="text-gray-300 mb-8">
        Code together in real-time.
      </p>

      <div className="flex gap-4">
        <Link
          to="/create-room"
          className="bg-blue-600 px-6 py-3 rounded-lg"
        >
          Create Room
        </Link>

        <Link
          to="/join-room"
          className="bg-green-600 px-6 py-3 rounded-lg"
        >
          Join Room
        </Link>
      </div>
    </div>
  );
};

export default Home;
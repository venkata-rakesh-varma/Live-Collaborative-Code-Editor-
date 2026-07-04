import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (!roomId.trim()) return;

    navigate(`/editor/${roomId}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Join Room</h2>

      <input
        className="border p-2 w-full"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <button
        onClick={joinRoom}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Join
      </button>
    </div>
  );
};

export default JoinRoom;
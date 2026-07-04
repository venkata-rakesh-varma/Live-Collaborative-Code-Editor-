import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateRoom = () => {
  const [title, setTitle] = useState("");
  const [language, setLanguage] = useState("javascript");

  const navigate = useNavigate();

  const createRoom = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/rooms`,
        { title, language },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate(`/editor/${res.data.room.roomId}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold">Create Room</h2>

      <input
        className="border p-2 w-full"
        placeholder="Room Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <select
        className="border p-2 w-full"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="java">Java</option>
        <option value="cpp">C++</option>
      </select>

      <button
        onClick={createRoom}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create
      </button>
    </div>
  );
};

export default CreateRoom;
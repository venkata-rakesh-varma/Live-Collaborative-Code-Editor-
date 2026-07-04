import { useState } from "react";

const ChatBox = () => {
  const [message, setMessage] = useState("");

  return (
    <div className="p-3">
      <div className="h-64 border mb-2 overflow-y-auto"></div>

      <input
        className="border w-full p-2"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
    </div>
  );
};

export default ChatBox;
const Message = ({ username, message }) => {
  return (
    <div className="mb-2">
      <strong>{username}: </strong>
      {message}
    </div>
  );
};

export default Message;
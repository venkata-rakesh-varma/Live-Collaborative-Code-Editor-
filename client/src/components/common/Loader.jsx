const Loader = () => {
  return (
    <div className="flex justify-center items-center h-full min-h-[100px] w-full">
      <div className="relative">
        <div className="w-10 h-10 border-4 border-white/5 rounded-full"></div>
        <div className="absolute top-0 left-0 w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
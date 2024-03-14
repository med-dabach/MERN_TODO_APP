const Nav = ({ children }) => {
  return (
    <div className="border-b-green-200 border-b-[1px]">
      <div className="container flex justify-between items-center">
        <h1 className="font-bold text-lg">
          <span className="text-green-500">Daily</span>
          <span className="text-gray-800">Todo</span>
        </h1>
        <ul className="flex justify-between items-center gap-3 py-2">
          {children}
        </ul>
      </div>
    </div>
  );
};

export default Nav;

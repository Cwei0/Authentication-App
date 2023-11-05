export const Home = () => {
  const footer = ["Business", "Blog", "Job"];
  return (
    <main className="h-full w-full">
      <div className="h-screen px-5 mx-auto flex flex-col items-center justify-center max-w-[600px] w-full relative">
        <div className="flex flex-col gap-2 items-center justify-center w-full">
          <h1 className="text-center text-washed-blue font-bold text-6xl tracking-wide">
            Bluesky
          </h1>
          <h2 className="text center text-gray-600 font-bold text-4xl">
            See what's next
          </h2>
          <div className="flex flex-col w-full gap-4">
            <button className="cursor-pointer p-2 text-white bg-washed-blue rounded-full">
              Create a new account
            </button>
            <button className="cursor-pointer p-2 rounded-full bg-gray-100">
              Sign in
            </button>
          </div>
        </div>
        <footer className="absolute bottom-2 w-full">
          <div className="border-t border-t-gray-200">
            <div className="flex flex-row justify-start items-center gap-8 p-5">
              {footer.map((item) => (
                <p className="font-light text-washed-blue tracking-wide">{item}</p>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
};

export const Home = () => {
  const footer = ["Business", "Blog", "Job"];
  return (
    <main className="gap-10 h-screen w-screen bg-black">
      <div className="max-w-[768px] relative">
        <div className="flex flex-col flex-1 gap-6">
          <h1 className="text-blue-700 text-4xl font-extrabold">
            My App
          </h1>
          <h2 className="text-gray-500 text-3xl font-extrabold tracking-wider">
            See What's next
          </h2>
          <div className="flex flex-col xl:flex-row gap-4 w-full px-1">
            <button className="w-full rounded-2xl text-center px-5 py-3 basis-auto bg-blue-700 text-white"></button>
            <button className="w-full rounded-2xl text-center px-5 py-3 basis-auto bg-gray-500 text-white"></button>
          </div>
        </div>

        <footer className="absolute left-0 bottom-0 right-0 border-t-2 border-gray-600">
          <div className="flex flex-row justify-start items-start">
            {footer.map((item) => (
              <p className="text-left font-light text-blue-700">
                {item}
              </p>
            ))}
          </div>
        </footer>
      </div>
    </main>
  )
}

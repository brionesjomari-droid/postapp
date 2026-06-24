export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-white">
      <main className="flex flex-col items-center justify-center gap-8 text-center px-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold text-slate-900 md:text-6xl">
            Posts App
          </h1>
          <p className="text-xl text-slate-600 md:text-2xl">
            Create, edit, and publish your posts
          </p>
        </div>
        
        <a
          className="mt-4 px-8 py-4 bg-blue-600 text-white font-semibold text-lg rounded-lg hover:bg-blue-700 transition-colors"
          href="/add-post"
        >
          Get Started
        </a>
      </main>
    </div>
  );
}

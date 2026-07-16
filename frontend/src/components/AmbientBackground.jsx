export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-emerald-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob" />
      <div
        className="absolute top-[30%] right-[-10%] w-72 h-72 sm:w-96 sm:h-96 bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-blob"
        style={{ animationDelay: "3s" }}
      />
    </div>
  );
}

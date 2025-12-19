import SearchBar from "./components/SearchBar";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-4xl font-bold mb-8 text-center">
        Search GitHub Profiles
      </h2>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        Enter a GitHub username to view their profile and analytics
      </p>
      <SearchBar />
    </div>
  );
}
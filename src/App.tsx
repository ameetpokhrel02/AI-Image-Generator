import ImageGenerator from "./components/ImageGenerator";
import PromptHistory from "./components/PromptHistory";
import Login from "./auth/pages/Login";
import Signup from "./auth/pages/Signup";

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex flex-col items-center justify-center p-2 sm:p-6">
      <ImageGenerator />
      <PromptHistory />
    </div>
  );
}

export default App;

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioProvider } from "@/components/AudioProvider";
import Index from "./pages/Index";
import Landing from "./pages/Landing";
import Game from "./pages/Game";
import Form from "./pages/Form";
import NotFound from "./pages/NotFound";
import Collection from "./pages/Collection";
import usePreloadImages from "./hooks/usePreloadImages";

const queryClient = new QueryClient();

const App = () => {
  usePreloadImages();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AudioProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/game" element={<Game />} />
              <Route path="/form" element={<Form />} />
              <Route path="/collection" element={<Collection />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AudioProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

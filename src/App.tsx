// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useEffect } from "react";
// import Index from "./pages/Index";
// import NotFound from "./pages/NotFound";
// import { EventProvider } from './components/EventContext';
// import { testFirebaseConnection, setupAdminUser } from './lib/firebase-test';

// const queryClient = new QueryClient();

// const App = () => {
//   useEffect(() => {
//     // Test Firebase connection and set up admin user on app startup
//     const initializeFirebase = async () => {
//       await testFirebaseConnection();
//       await setupAdminUser();
//     };
    
//     initializeFirebase();
//   }, []);

//   return (
//     <EventProvider>
//       <QueryClientProvider client={queryClient}>
//         <TooltipProvider>
//           <Toaster />
//           <Sonner />
//           <BrowserRouter>
//             <Routes>
//               <Route path="/event_for_school" element={<Index />} />
//               {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//               <Route path="*" element={<NotFound />} />
//             </Routes>
//           </BrowserRouter>
//         </TooltipProvider>
//       </QueryClientProvider>
//     </EventProvider>
//   );
// };

// export default App;


import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { EventProvider } from './components/EventContext';
import { testFirebaseConnection, setupAdminUser } from './lib/firebase-test';

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize Firebase (with error handling)
    const initializeFirebase = async () => {
      try {
        console.log('Initializing Firebase...');
        await testFirebaseConnection();
        await setupAdminUser();
        console.log('Firebase initialized successfully');
        setIsLoading(false);
      } catch (err) {
        console.error('Firebase initialization failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setIsLoading(false);
      }
    };
    
    // For local development, skip Firebase for now
    console.log('Skipping Firebase initialization for local development');
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        Loading Cynosure 2025-26...
      </div>
    );
  }

  return (
    <EventProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </EventProvider>
  );
};

export default App;

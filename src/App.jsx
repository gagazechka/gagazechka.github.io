// import { Toaster } from "@/components/ui/toaster"
// import { QueryClientProvider } from '@tanstack/react-query'
// import { queryClientInstance } from '@/lib/query-client'
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import PageNotFound from './lib/PageNotFound';
// import { AuthProvider, useAuth } from '@/lib/AuthContext';
// import UserNotRegisteredError from '@/components/UserNotRegisteredError';
// // Add page imports here
// import CrosswordGame from './pages/CrosswordGame';
// import CrosswordMenu from './pages/CrosswordMenu';
// import CrosswordCustom from './pages/CrosswordCustom';
// import Settings from './pages/Settings';
// import AppLayout from './components/AppLayout';

// const AuthenticatedApp = () => {
//   const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

//   // Show loading spinner while checking app public settings or auth
//   if (isLoadingPublicSettings || isLoadingAuth) {
//     return (
//       <div className="fixed inset-0 flex items-center justify-center">
//         <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
//       </div>
//     );
//   }

//   // Handle authentication errors
//   if (authError) {
//     if (authError.type === 'user_not_registered') {
//       return <UserNotRegisteredError />;
//     } else if (authError.type === 'auth_required') {
//       // Redirect to login automatically
//       navigateToLogin();
//       return null;
//     }
//   }

//   // Render the main app
//   return (
//     <Routes>
//       <Route element={<AppLayout />}>
//         <Route path="/" element={<CrosswordMenu />} />
//         <Route path="/menu" element={<CrosswordMenu />} />
//         <Route path="/game" element={<CrosswordGame />} />
//         <Route path="/custom" element={<CrosswordCustom />} />
//         <Route path="/settings" element={<Settings />} />
//         <Route path="*" element={<PageNotFound />} />
//       </Route>
//     </Routes>
//   );
// };


// function App() {

//   return (
//     <AuthProvider>
//       <QueryClientProvider client={queryClientInstance}>
//         <Router>
//           <AuthenticatedApp />
//         </Router>
//         <Toaster />
//       </QueryClientProvider>
//     </AuthProvider>
//   )
// }

// export default App

import { Toaster } from "./components/ui/toaster";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import CrosswordMenu from "./pages/CrosswordMenu";
import CrosswordGame from "./pages/CrosswordGame";
import CrosswordCustom from "./pages/CrosswordCustom";
import Settings from "./pages/Settings";

if (window.Telegram?.WebApp) {
  const tg = window.Telegram.WebApp;
  tg.ready(); // Сообщаем Telegram, что приложение загрузилось
  tg.expand(); // Разворачиваем на всю высоту экрана
  
  // Устанавливаем цвета темы Telegram для фона
  document.documentElement.style.setProperty('--background', tg.themeParams.bg_color);
}

const SaveCrossword = (crosswordData) => {
  if (window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    const data = JSON.stringify(crosswordData);
    tg.sendData(data);
    tg.close();
  } else {
    console.error("Это работает только внутри Telegram Mini App");
  }
};

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<CrosswordMenu />} />
          <Route path="/menu" element={<CrosswordMenu />} />
          <Route path="/game" element={<CrosswordGame />} />
          <Route path="/custom" element={<CrosswordCustom />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster />
    </Router>
  );
}

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ExpenseProvider } from "./context/ExpenseContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import ExpenseListPage from "./pages/ExpenseListPage";
import Reports from "./pages/Reports";
import ImportExport from "./pages/ImportExport";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import "./styles/layout.css";

const AppContent = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      <div className="layout">
        {user && <Sidebar />}
        <div className={user ? "content" : "content-full"}>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/add" element={
              <ProtectedRoute>
                <AddExpense />
              </ProtectedRoute>
            } />
            <Route path="/expenses" element={
              <ProtectedRoute>
                <ExpenseListPage />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/import-export" element={
              <ProtectedRoute>
                <ImportExport />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <AppContent />
      </ExpenseProvider>
    </AuthProvider>
  );
}

// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { ExpenseProvider } from "./context/ExpenseContext";
// import AppLayout from "./components/AppLayout";
// import Dashboard from "./pages/Dashboard";
// import AddExpense from "./pages/AddExpense";
// import ExpenseListPage from "./pages/ExpenseListPage";
// import Reports from "./pages/Reports";
// import ImportExport from "./pages/ImportExport";
// import NotFound from "./pages/NotFound";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <TooltipProvider>
//       <ExpenseProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Routes>
//             <Route element={<AppLayout />}>
//               <Route path="/" element={<Dashboard />} />
//               <Route path="/add" element={<AddExpense />} />
//               <Route path="/expenses" element={<ExpenseListPage />} />
//               <Route path="/reports" element={<Reports />} />
//               <Route path="/import-export" element={<ImportExport />} />
//             </Route>
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </ExpenseProvider>
//     </TooltipProvider>
//   </QueryClientProvider>
// );

// export default App;

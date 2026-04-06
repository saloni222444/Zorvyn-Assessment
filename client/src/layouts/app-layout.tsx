import Navbar from "@/components/navbar";
import { Outlet } from "react-router-dom";
import EditTransactionDrawer from "@/components/transaction/edit-transaction-drawer";

const AppLayout = () => {
  return (
    <>
      {/* Apply glass-nav class to the navbar container or directly on Navbar component */}
      <div className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <Navbar />
      </div>
      <main className="w-full max-w-full pt-20">
        <Outlet />
      </main>
      <EditTransactionDrawer />
    </>
  );
};

export default AppLayout;
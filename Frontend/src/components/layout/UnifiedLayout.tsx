import { Outlet } from "react-router-dom";
import UnifiedNavbar from "./UnifiedNavbar";

export default function UnifiedLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <UnifiedNavbar />
            <main className="flex-1 pt-16">
                <Outlet />
            </main>
        </div>
    );
}

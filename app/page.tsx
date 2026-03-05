import { LoginPopup } from "@/components/ownUI/loginPopup";
import StoreProvider from "@/lib/providers/store-provider";

export default function Home() {
  return (
    <StoreProvider>
      <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="z-10 max-w-5xl w-full items-center justify-center font-mono text-sm lg:flex flex-col gap-8 text-center">
          <h1 className="text-6xl font-black tracking-tight text-slate-900">
            Avto <span className="text-primary italic">Next</span>
          </h1>
          <p className="text-slate-500 max-w-md mx-auto">
            Manage your e-commerce operations with precision and speed.
            Access your dashboard through the secure gateway below.
          </p>
          <div className="flex gap-4">
            <LoginPopup />
          </div>
        </div>
      </main>
    </StoreProvider>
  );
}

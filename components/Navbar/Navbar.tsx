import Link from "next/link";
export const Navbar = () => {
  return (
    <div className="w-full px-4 py-4 bg-slate-500 flex flex-row text-white justify-between">
      <div className="font-semibold transition-all hover:animate-ping hover:font-bold">
        Interactive Psychrometric Chart
      </div>
      <div className="flex flex-row space-x-4">
        <Link href="/" className="hover:font-bold transition-all">
          Chart
        </Link>
        <Link href="/Design" className="hover:font-bold transition-all">
          System Design
        </Link>
      </div>
    </div>
  );
};

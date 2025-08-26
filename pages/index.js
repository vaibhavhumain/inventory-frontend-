// import Link from "next/link";
// import { useEffect } from "react";
// import { getToken } from "../utils/auth";
// import { useRouter } from "next/router";

// export default function Landing() {
//   const router = useRouter();

//   useEffect(() => {
//     if (getToken()) router.replace("/dashboard");
//   }, [router]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
//       <div className="max-w-xl w-full text-center">
//         <h1 className="text-4xl font-extrabold text-blue-700">📦 Stock Ledger</h1>
//         <p className="mt-3 text-gray-600">
//           Simple inventory control for feed, issue & report downloads.
//         </p>

//         <div className="mt-8 flex items-center justify-center gap-4 flex-wrap">
//           <Link
//             href="/login"
//             className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow"
//           >
//             🔐 Login
//           </Link>
//           <Link
//             href="/register"
//             className="px-6 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-800 shadow"
//           >
//             🧾 Register
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

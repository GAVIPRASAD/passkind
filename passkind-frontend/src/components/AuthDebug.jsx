// import React from "react";
// import useAuthStore from "../store/authStore";

// const AuthDebug = () => {
//   const { user, token, isAuthenticated } = useAuthStore();

//   return (
//     <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs font-mono z-50">
//       <h3 className="font-bold mb-2 text-sm">Auth Debug Info</h3>
//       <div className="space-y-1">
//         <div>
//           <span className="text-gray-400">Authenticated:</span>{" "}
//           <span className={isAuthenticated ? "text-green-400" : "text-red-400"}>
//             {isAuthenticated ? "✓ Yes" : "✗ No"}
//           </span>
//         </div>
//         <div>
//           <span className="text-gray-400">User:</span>{" "}
//           <span className="text-cyan-400">{user?.username || "None"}</span>
//         </div>
//         <div>
//           <span className="text-gray-400">Token:</span>{" "}
//           <span className={token ? "text-green-400" : "text-red-400"}>
//             {token ? `${token.substring(0, 20)}...` : "None"}
//           </span>
//         </div>
//         <div className="mt-2 pt-2 border-t border-gray-700">
//           <span className="text-gray-400">LocalStorage:</span>
//           <pre className="text-xs mt-1 overflow-auto max-h-32">
//             {JSON.stringify(
//               JSON.parse(localStorage.getItem("auth-storage") || "{}"),
//               null,
//               2
//             )}
//           </pre>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AuthDebug;

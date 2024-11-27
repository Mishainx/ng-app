import Link from "next/link";
import Image from "next/image";

// Definición de iconos SVG
function Package2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

function PackageIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ShoppingCartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 1.88 1.54h12.38a2 2 0 0 0 1.88-1.54L22 4.05H6.16" />
      <path d="M9 6h11.68L21 9.35" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

// Definición de los botones
const buttons = [
  {
    id: 'products',
    text: 'Productos',
    icon: <PackageIcon className="h-5 w-5 text-gray-500" />,
  },
  {
    id: 'customers',
    text: 'Clientes',
    icon: <UsersIcon className="h-5 w-5 text-gray-500" />,
  },
  {
    id: 'tickets',
    text: 'Tickets',
    icon: <ShoppingCartIcon className="h-5 w-5 text-gray-500" />,
  },
  {
    id: 'settings',
    text: 'Configuración',
    icon: <SettingsIcon className="h-5 w-5 text-gray-500" />,
  },
  {
    id: 'logout',
    text: 'Logout',
    icon: <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 16l4-4-4-4" />
      <path d="M17 12H7" />
      <path d="M4 21V3" />
    </svg>,
  },
];


// Definición de iconos SVG
// ... (Los iconos se mantienen igual)

export default function SideBarAdmin({ onSelect }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 flex flex-col w-14 lg:w-60 border-r bg-gray-50 h-full">
      <div className="flex items-center justify-between border-b px-4 py-2 lg:px-6 lg:py-4 text-black">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
            <Image
            src="/nippon-game-logo.png"
            width={30}
            height={30}
            alt="nippon game logo"
            />
          <span className="text-base font-semibold text-black hidden lg:block">Nippon Game</span>
        </Link>
      </div>
      <nav className="flex flex-col flex-1 overflow-auto px-2 py-4 lg:px-4">
        {buttons.map(({ id, text, icon }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-200 hover:text-black"
          >
            {icon}
            <span className="text-sm font-medium hidden lg:block">{text}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}


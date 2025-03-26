"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Weather Dashboard', path: '/weather', icon: '🌤️' },
    { name: 'News Dashboard', path: '/news', icon: '📰' },
    { name: 'Finance Dashboard', path: '/finance', icon: '📈' },
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white fixed left-0 top-0 p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">PGAGI Dashboard</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  pathname === item.path
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 
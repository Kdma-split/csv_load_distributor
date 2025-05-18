import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';

// Icons
import { 
  HomeIcon, 
  UsersIcon, 
  ListIcon, 
  LogOutIcon, 
  ChevronDownIcon,
  ChevronRightIcon
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);
  const [isListSubmenuOpen, setIsListSubmenuOpen] = useState(false);

  // Check if the current path matches the given path
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Check if the current path starts with the given path (for submenu items)
  const isActiveGroup = (path) => {
    return location.pathname.startsWith(path);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    // Close submenu when sidebar is collapsed
    if (isOpen) {
      setIsListSubmenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  const sidebarItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <HomeIcon size={20} />,
    },
    {
      name: 'Agents',
      path: '/agents',
      icon: <UsersIcon size={20} />,
      submenu: [
        {
          name: 'All Agents',
          path: '/agents',
        },
        {
          name: 'Add Agent',
          path: '/agents/add',
        }
      ]
    },
    {
      name: 'Lists',
      path: '/lists',
      icon: <ListIcon size={20} />,
      submenu: [
        {
          name: 'Upload List',
          path: '/lists/upload',
        },
        {
          name: 'Distribution Summary',
          path: '/lists/distribution',
        }
      ]
    }
  ];

  return (
    <div className={`bg-slate-800 text-white h-screen transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'} flex flex-col`}>
      {/* Sidebar Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-700">
        {isOpen && <h2 className="text-xl font-bold">Admin Panel</h2>}
        <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-slate-700">
          {isOpen ? (
            <ChevronLeftIcon size={20} />
          ) : (
            <ChevronRightIcon size={20} />
          )}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {sidebarItems.map((item, index) => (
            <li key={index}>
              {item.submenu ? (
                <div>
                  <button 
                    onClick={() => setIsListSubmenuOpen(!isListSubmenuOpen)}
                    className={`flex items-center w-full p-3 hover:bg-slate-700 ${isActiveGroup(item.path) ? 'bg-slate-700' : ''}`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {isOpen && (
                      <>
                        <span className="flex-1 text-left">{item.name}</span>
                        <span>
                          {isListSubmenuOpen ? <ChevronDownIcon size={16} /> : <ChevronRightIcon size={16} />}
                        </span>
                      </>
                    )}
                  </button>
                  
                  {/* Submenu */}
                  {isOpen && isListSubmenuOpen && (
                    <ul className="pl-10 space-y-1 mt-1">
                      {item.submenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subItem.path}
                            className={`block p-2 hover:bg-slate-700 rounded ${isActive(subItem.path) ? 'bg-slate-700 text-blue-400' : ''}`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center p-3 hover:bg-slate-700 ${isActive(item.path) ? 'bg-slate-700' : ''}`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {isOpen && <span>{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-700">
        <button 
          onClick={handleLogout}
          className="flex items-center w-full p-3 hover:bg-slate-700 rounded text-red-400"
        >
          <span className="mr-3"><LogOutIcon size={20} /></span>
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
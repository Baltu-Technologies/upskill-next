'use client';

import { useEffect, useState } from 'react';

export default function SidebarDebugger() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check if we're in development mode
    setIsEnabled(process.env.NODE_ENV === 'development');
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    // Add debug styles to sidebar elements
    const addDebugStyles = () => {
      const sidebar = document.querySelector('[class*="w-80"], [class*="w-72"]') as HTMLElement;
      const submenus = document.querySelectorAll('[class*="ml-4"]');
      
      if (sidebar) {
        sidebar.style.border = '2px solid #ff0000';
        sidebar.style.boxSizing = 'border-box';
      }
      
      submenus.forEach((submenu) => {
        const submenuElement = submenu as HTMLElement;
        submenuElement.style.border = '1px solid #00ff00';
        submenuElement.style.boxSizing = 'border-box';
      });
    };

    const removeDebugStyles = () => {
      const sidebar = document.querySelector('[class*="w-80"], [class*="w-72"]') as HTMLElement;
      const submenus = document.querySelectorAll('[class*="ml-4"]');
      
      if (sidebar) {
        sidebar.style.border = '';
      }
      
      submenus.forEach((submenu) => {
        const submenuElement = submenu as HTMLElement;
        submenuElement.style.border = '';
      });
    };

    // Add styles on mount
    addDebugStyles();

    // Add observer for dynamic content
    const observer = new MutationObserver(() => {
      addDebugStyles();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      removeDebugStyles();
      observer.disconnect();
    };
  }, [isEnabled]);

  if (!isEnabled) return null;

  return (
    <div className="fixed top-4 left-4 z-50 bg-red-500 text-white text-xs p-2 rounded">
      🔧 Sidebar Debug Mode
      <br />
      Red: Sidebar boundary
      <br />
      Green: Submenu items (uniform width)
    </div>
  );
} 
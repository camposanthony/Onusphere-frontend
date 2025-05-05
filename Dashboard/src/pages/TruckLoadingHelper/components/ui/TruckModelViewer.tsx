import React, { useRef, useEffect } from 'react';

interface TruckModelViewerProps {
  modelUrl: string;
}

const TruckModelViewer: React.FC<TruckModelViewerProps> = ({ modelUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a placeholder for the 3D model viewer
    // In a real implementation, you would initialize a 3D renderer like Three.js here
    // For now, we'll show a placeholder message
    if (containerRef.current) {
      const container = containerRef.current;
      container.innerHTML = '';
      
      const messageEl = document.createElement('div');
      messageEl.className = 'flex flex-col items-center justify-center h-full';
      
      const iconEl = document.createElement('div');
      iconEl.className = 'bg-accent/10 rounded-full p-4 mb-3';
      iconEl.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-accent">
          <path d="M21 8V15.83A2.82 2.82 0 0 1 18 19C16.33 19 15 17.5 15 15.83V12H8V11H3V4h18C21 4 21 4.03 21 4.02V8Z"/>
          <path d="M8 12H5a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h14.5"/>
          <path d="M8 12v7"/>
        </svg>
      `;
      
      const textEl = document.createElement('p');
      textEl.className = 'text-center text-muted-foreground';
      textEl.textContent = `3D model would load here: ${modelUrl}`;
      
      messageEl.appendChild(iconEl);
      messageEl.appendChild(textEl);
      container.appendChild(messageEl);
    }
  }, [modelUrl]);

  return <div ref={containerRef} className="w-full h-full bg-card" />;
};

export default TruckModelViewer;

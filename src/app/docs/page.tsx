'use client';

import { useEffect, useState } from 'react';
import VantaBackground from '@/components/vanta-background';

// This component will dynamically load Swagger UI on the client side
const SwaggerUI = () => {
  useEffect(() => {
    // Dynamically import the swagger-ui-react component
    const SwaggerUIComponent = require('swagger-ui-react').default;
    // We need to import the CSS file for swagger-ui-react
    require('swagger-ui-react/swagger-ui.css');
    
    // This state update triggers a re-render with the loaded component
    setSwaggerComponent(() => SwaggerUIComponent);
  }, []);

  const [SwaggerComponent, setSwaggerComponent] = useState<React.ComponentType<any> | null>(null);

  if (!SwaggerComponent) {
    return <div className="flex justify-center items-center h-screen"><p className="text-white">Loading API Documentation...</p></div>;
  }
  
  // The swagger.json file is placed in the public directory
  return <SwaggerComponent url="/swagger.json" />;
};

export default function DocsPage() {
  return (
    <>
      <VantaBackground />
      <div className="absolute inset-0 z-10">
        <SwaggerUI />
      </div>
    </>
  );
}

'use client';

interface DevBannerProps {
  show?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  message?: string;
}

export default function DevBanner({ 
  show = true, 
  position = 'top-right',
  message = 'En Desarrollo' 
}: DevBannerProps) {
  if (!show) return null;

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4', 
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 pointer-events-none`}>
      <div className="bg-orange-500/90 backdrop-blur-sm text-white px-3 py-2 rounded-lg shadow-lg border border-orange-400/30 animate-pulse">
        <div className="flex items-center space-x-2 text-sm font-medium">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
          <span>{message}</span>
          <div className="text-xs opacity-75">🚧</div>
        </div>
      </div>
    </div>
  );
}
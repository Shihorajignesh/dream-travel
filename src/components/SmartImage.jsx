import { useState } from 'react';

export default function SmartImage({ src, alt, className = '', eager = false, kenburns = false }) {
  const [state, setState] = useState('loading');
  if (state === 'failed') return <div role="img" aria-label={alt} className={`bg-gradient-to-br from-lagoon-700 to-lagoon-900 ${className}`} />;
  return (
    <img src={src} alt={alt} loading={eager ? 'eager' : 'lazy'} onLoad={() => setState('loaded')} onError={() => setState('failed')}
      className={`object-cover transition-[opacity,transform] duration-700 ${state === 'loaded' ? 'opacity-100' : 'opacity-0'} ${kenburns ? 'kenburns' : ''} ${className}`} />
  );
}

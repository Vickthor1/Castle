import React from 'react';

const defaultIcon = new URL('../../icones/castle.svg', import.meta.url).href;

export default function AppIcon({
  src,
  alt,
  className = '',
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  return <img src={src || defaultIcon} alt={alt ?? 'Ícone do aplicativo'} className={className} />;
}

import React from 'react';
import {
  Home,
  Archive,
  Star,
  Layers,
  Clock,
  Settings,
  Info,
  Search,
  Grid,
  List,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Heart,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  SlidersHorizontal,
} from 'lucide-react';

export const icons = {
  Home,
  Archive,
  Star,
  Layers,
  Clock,
  Settings,
  Info,
  Search,
  Grid,
  List,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Heart,
  MoreHorizontal,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  SlidersHorizontal,
};

export type IconName = keyof typeof icons;

export function Icon({
  name,
  size = 18,
  className = '',
  ...props
}: { name: IconName; size?: number; className?: string } & React.SVGProps<SVGSVGElement>) {
  const Component = icons[name];
  return <Component size={size} className={className} {...props} />;
}

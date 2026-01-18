import Link from 'next/link';
import {
  Home,
  TreePine,
  Heart,
  GraduationCap,
  Factory,
  Gamepad2,
  Plane,
  Wrench,
  Shield,
  Activity,
} from 'lucide-react';
import { RobotCategory } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  home: Home,
  trees: TreePine,
  heart: Heart,
  'graduation-cap': GraduationCap,
  factory: Factory,
  'gamepad-2': Gamepad2,
  plane: Plane,
  wrench: Wrench,
  shield: Shield,
  activity: Activity,
};

const colorMap: Record<RobotCategory, { bg: string; icon: string; hover: string }> = {
  'home-cleaning': { bg: 'bg-blue-50', icon: 'text-blue-500', hover: 'hover:bg-blue-100' },
  'lawn-garden': { bg: 'bg-green-50', icon: 'text-green-500', hover: 'hover:bg-green-100' },
  companion: { bg: 'bg-pink-50', icon: 'text-pink-500', hover: 'hover:bg-pink-100' },
  educational: { bg: 'bg-purple-50', icon: 'text-purple-500', hover: 'hover:bg-purple-100' },
  industrial: { bg: 'bg-gray-50', icon: 'text-gray-500', hover: 'hover:bg-gray-100' },
  entertainment: { bg: 'bg-orange-50', icon: 'text-orange-500', hover: 'hover:bg-orange-100' },
  drones: { bg: 'bg-sky-50', icon: 'text-sky-500', hover: 'hover:bg-sky-100' },
  'hobby-diy': { bg: 'bg-amber-50', icon: 'text-amber-500', hover: 'hover:bg-amber-100' },
  security: { bg: 'bg-red-50', icon: 'text-red-500', hover: 'hover:bg-red-100' },
  healthcare: { bg: 'bg-teal-50', icon: 'text-teal-500', hover: 'hover:bg-teal-100' },
};

interface CategoryCardProps {
  id: RobotCategory;
  name: string;
  icon: string;
  description: string;
  count?: number;
}

export default function CategoryCard({ id, name, icon, description, count }: CategoryCardProps) {
  const IconComponent = iconMap[icon] || Home;
  const colors = colorMap[id];

  return (
    <Link href={`/search?category=${id}`}>
      <div
        className={`${colors.bg} ${colors.hover} rounded-xl p-6 transition-all duration-200 group cursor-pointer h-full`}
      >
        <div className={`w-12 h-12 rounded-lg ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <IconComponent className={`w-6 h-6 ${colors.icon}`} />
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        {count !== undefined && (
          <p className="text-sm text-gray-500">{count} listings</p>
        )}
      </div>
    </Link>
  );
}

// Compact variant for sidebar or smaller displays
export function CategoryCardCompact({ id, name, icon, count }: Omit<CategoryCardProps, 'description'>) {
  const IconComponent = iconMap[icon] || Home;
  const colors = colorMap[id];

  return (
    <Link href={`/search?category=${id}`}>
      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition group">
        <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
          <IconComponent className={`w-5 h-5 ${colors.icon}`} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition truncate">
            {name}
          </h4>
          {count !== undefined && (
            <p className="text-sm text-gray-500">{count} listings</p>
          )}
        </div>
      </div>
    </Link>
  );
}

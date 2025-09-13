import { Badge } from '@/components/ui/badge';

interface RoleBadgeProps {
  role: string;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'trainee':
        return 'מתלמדת';
      case 'instructor':
        return 'מדריכה';
      case 'admin':
        return 'אדמין';
      default:
        return role;
    }
  };

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'trainee':
        return 'secondary';
      case 'instructor':
        return 'default';
      case 'admin':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'trainee':
        return '👩‍🎓';
      case 'instructor':
        return '👩‍🏫';
      case 'admin':
        return '👨‍💼';
      default:
        return '👤';
    }
  };

  return (
    <Badge variant={getRoleVariant(role)} className="text-xs flex items-center gap-1">
      <span>{getRoleIcon(role)}</span>
      {getRoleLabel(role)}
    </Badge>
  );
}

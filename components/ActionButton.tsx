import { LucideIcon } from "lucide-react";

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
}

const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  color,
}: ActionButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col cursor-pointer items-center gap-2 p-4 rounded-2xl bg-card card-shadow hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
    >
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color || "bg-accent text-accent-foreground"}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xs font-medium text-foreground">{label}</span>
    </button>
  );
};

export default ActionButton;

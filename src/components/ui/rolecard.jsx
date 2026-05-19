import { Crown, DoorOpen } from "lucide-react"

export function RoleCard({ roleId, label, iconType, isSelected, onSelect }) {
  const Icon = iconType === "owner" ? Crown : DoorOpen

  return (
    <div 
      onClick={() => onSelect(roleId)}
      className={`cursor-pointer aspect-square flex flex-col items-center justify-center p-6 border-2 transition-all rounded-2xl ${
        isSelected
          ? "border-blue-normal bg-blue-normal shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]"
          : "border-gray-200 bg-white hover:border-gray-400"
      }`}
    >
      <Icon 
        className={`w-16 h-16 mb-4 transition-colors ${isSelected ? "text-white" : "text-gray-400"}`} 
        strokeWidth={1.5} 
      />
      <span className={`text-sm font-bold transition-colors ${isSelected ? "text-white" : "text-gray-500"}`}>
        {label}
      </span>
    </div>
  )
}
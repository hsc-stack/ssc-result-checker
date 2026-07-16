import { GRADE_COLORS } from "../constants";

export function gradeBadgeClass(grade) {
  return (
    GRADE_COLORS[grade.trim().toUpperCase()] ||
    "text-zinc-300 bg-zinc-800 border-zinc-750"
  );
}

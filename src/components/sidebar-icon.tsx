import { FileText, FileUser, LayoutDashboard } from "lucide-react";

const Icon = ({
  name,
  isCurrentPath,
}: {
  name: string;
  isCurrentPath: boolean;
}) => {
  const style = `transition-all w-7 h-7 ${isCurrentPath && "fill-sidebar text-sidebar-primary"}`;

  switch (name) {
    case "dashboard":
      return <LayoutDashboard className={style} />;
    case "applications":
      return <FileUser className={style} />;
    case "resume enhancer":
      return <FileText className={style} />;
  }
};

export default Icon;

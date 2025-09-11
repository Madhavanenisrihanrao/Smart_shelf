import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  AlertTriangle,
  DollarSign
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  description?: string;
  onClick?: () => void;
}

const StatCard = ({ title, value, change, changeType, icon, description, onClick }: StatCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-success";
      case "negative":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case "positive":
        return <TrendingUp className="w-3 h-3" />;
      case "negative":
        return <TrendingDown className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-200 border-border/50 ${onClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-primary">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        <div className={`flex items-center text-xs ${getChangeColor()}`}>
          {getChangeIcon()}
          <span className="ml-1">{change}</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export function DashboardStats() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Total Revenue"
        value="₹45,231"
        change="+12.5% from last month"
        changeType="positive"
        icon={<DollarSign className="w-5 h-5" />}
        description="Monthly revenue target: ₹50,000"
        onClick={() => navigate("/analytics")}
      />

      <StatCard
        title="Total Orders"
        value="1,234"
        change="+8.2% from last month"
        changeType="positive"
        icon={<ShoppingCart className="w-5 h-5" />}
        description="Average order value: ₹367"
        onClick={() => navigate("/orders")}
      />

      <StatCard
        title="Inventory Items"
        value="856"
        change="-2.1% from last month"
        changeType="negative"
        icon={<Package className="w-5 h-5" />}
        description="Items running low: 12"
        onClick={() => navigate("/inventory")}
      />

      <StatCard
        title="Low Stock Alerts"
        value="12"
        change="+3 new alerts"
        changeType="negative"
        icon={<AlertTriangle className="w-5 h-5" />}
        description="Requires immediate attention"
        onClick={() => navigate("/alerts")}
      />
    </div>
  );
}

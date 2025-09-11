import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  Package
} from "lucide-react";
import { InventoryForm } from "@/components/InventoryForm";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  expiryDate?: string;
  status: "in-stock" | "low-stock" | "out-of-stock" | "expiring-soon";
}

const mockInventory: InventoryItem[] = [
  {
    id: "1",
    name: "Basmati Rice",
    category: "Groceries",
    quantity: 50,
    unit: "kg",
    price: 120,
    status: "in-stock"
  },
  {
    id: "2",
    name: "Wheat Flour",
    category: "Groceries", 
    quantity: 5,
    unit: "kg",
    price: 45,
    status: "low-stock"
  },
  {
    id: "3",
    name: "Paracetamol 500mg",
    category: "Medicines",
    quantity: 100,
    unit: "tablets",
    price: 2,
    expiryDate: "2024-12-31",
    status: "in-stock"
  },
  {
    id: "4",
    name: "Fresh Tomatoes",
    category: "Vegetables",
    quantity: 0,
    unit: "kg",
    price: 60,
    expiryDate: "2024-09-25",
    status: "out-of-stock"
  },
  {
    id: "5",
    name: "Notebook A4",
    category: "Stationery",
    quantity: 25,
    unit: "pieces",
    price: 50,
    status: "in-stock"
  }
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case "in-stock":
      return <Badge variant="secondary" className="bg-success/10 text-success">In Stock</Badge>;
    case "low-stock":
      return <Badge variant="outline" className="border-warning text-warning">Low Stock</Badge>;
    case "out-of-stock":
      return <Badge variant="destructive">Out of Stock</Badge>;
    case "expiring-soon":
      return <Badge variant="outline" className="border-destructive text-destructive">Expiring Soon</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default function Inventory() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    const add = searchParams.get("add");
    const edit = searchParams.get("edit");
    if (add === "true") {
      setIsFormOpen(true);
      setEditingItem(null);
    } else if (edit) {
      const itemToEdit = inventory.find(item => item.id === edit);
      if (itemToEdit) {
        setEditingItem(itemToEdit);
        setIsFormOpen(true);
      }
    } else {
      setIsFormOpen(false);
      setEditingItem(null);
    }
  }, [searchParams, inventory]);

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [...new Set(inventory.map(item => item.category))];
  const statuses = [...new Set(inventory.map(item => item.status))];

  const handleAddClick = () => {
    setSearchParams({ add: "true" });
  };

  const handleEditClick = (id: string) => {
    setSearchParams({ edit: id });
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setInventory(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleFormSubmit = (item: InventoryItem) => {
    if (item.id) {
      // Edit existing
      setInventory(prev => prev.map(i => (i.id === item.id ? item : i)));
    } else {
      // Add new
      const newItem = { ...item, id: (inventory.length + 1).toString() };
      setInventory(prev => [...prev, newItem]);
    }
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your stock levels, track expiry dates, and monitor inventory status.
          </p>
        </div>
        <Button onClick={handleAddClick} className="bg-gradient-primary hover:opacity-90 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add New Item
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search inventory items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2 text-primary" />
            Inventory Items ({filteredInventory.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price per Unit</TableHead>
                  <TableHead>Expiry Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInventory.map((item) => (
                  <TableRow key={item.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {item.quantity} {item.unit}
                        {item.quantity <= 10 && item.quantity > 0 && (
                          <AlertTriangle className="w-4 h-4 ml-2 text-warning" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>₹{item.price}</TableCell>
                    <TableCell>
                      {item.expiryDate ? (
                        <span className={
                          new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                            ? "text-destructive font-medium"
                            : "text-muted-foreground"
                        }>
                          {new Date(item.expiryDate).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(item.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => handleEditClick(item.id)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteClick(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <InventoryForm
        isOpen={isFormOpen}
        onClose={() => setSearchParams({})}
        onSubmit={handleFormSubmit}
        initialData={editingItem}
      />
    </div>
  );
}

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import apiClient from "@/core/api/http/axios-client";
import { Loader2, ArrowUp, ArrowDown, Eye, EyeOff, Plus, LayoutDashboard, BarChart2, TrendingUp, TrendingDown, MousePointer, Star } from "lucide-react";

interface NavItemDoc {
  _id: string;
  title: string;
  path?: string;
  route?: string;
  icon?: string;
  badge?: string;
  category?: string;
  permissionKey?: string;
  featureKey?: string;
  order: number;
  isVisible: boolean;
  isSystem?: boolean;
}

interface AnalyticsData {
  mostOpened?: { itemTitle: string; openCount: number };
  leastUsed?: { itemTitle: string; openCount: number };
  favoriteMenu?: { itemTitle: string; openCount: number };
  averageClickCount?: number;
}

export const SidebarManagement = () => {
  const [items, setItems] = useState<NavItemDoc[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);

  const [newTitle, setNewTitle] = useState("");
  const [newPath, setNewPath] = useState("");
  const [newIcon, setNewIcon] = useState("LayoutDashboard");
  const [newBadge, setNewBadge] = useState("");
  const [newCategory, setNewCategory] = useState("Main");
  const [newPermissionKey, setNewPermissionKey] = useState("");
  const [newFeatureKey, setNewFeatureKey] = useState("");

  const fetchSidebarItems = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/sidebar/admin/items');
      const data: NavItemDoc[] = (res.data?.data || []).sort((a: NavItemDoc, b: NavItemDoc) => a.order - b.order);
      setItems(data);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const res = await apiClient.get('/sidebar/analytics');
      setAnalytics(res.data?.data || null);
    } catch {
      setAnalytics(null);
    }
  };

  useEffect(() => {
    let active = true;
    Promise.all([apiClient.get('/sidebar/admin/items'), apiClient.get('/sidebar/analytics').catch(() => ({ data: { data: null } }))])
      .then(([resItems, resAnalytics]) => {
        if (!active) return;
        const data: NavItemDoc[] = (resItems.data?.data || []).sort((a: NavItemDoc, b: NavItemDoc) => a.order - b.order);
        setItems(data);
        setAnalytics(resAnalytics.data?.data || null);
      })
      .catch(() => {
        if (active) setItems([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const handleToggleVisibility = async (item: NavItemDoc) => {
    try {
      await apiClient.patch('/sidebar/custom', {
        id: item._id,
        isVisible: !item.isVisible,
        visible: !item.isVisible,
      });
      fetchSidebarItems();
    } catch {
      alert("Failed to update visibility.");
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === items.length - 1)) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentItem = items[index];
    const targetItem = items[targetIndex];

    const updates = [
      { id: currentItem._id, order: targetItem.order },
      { id: targetItem._id, order: currentItem.order }
    ];

    try {
      await apiClient.patch('/sidebar/order', { items: updates });
      fetchSidebarItems();
    } catch {
      alert("Error reordering items.");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPath.trim()) return;
    try {
      await apiClient.post('/sidebar', {
        title: newTitle.trim(),
        route: newPath.trim(),
        path: newPath.trim(),
        icon: newIcon.trim() || "LayoutDashboard",
        badge: newBadge.trim(),
        category: newCategory.trim() || "Main",
        permissionKey: newPermissionKey.trim(),
        featureKey: newFeatureKey.trim(),
        order: items.length + 1,
        isVisible: true,
      });
      setShowAddForm(false);
      setNewTitle("");
      setNewPath("");
      setNewBadge("");
      setNewCategory("Main");
      setNewPermissionKey("");
      setNewFeatureKey("");
      fetchSidebarItems();
    } catch {
      alert("Failed to add navigation item.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Summary Widget (Phase 4.4 Requirement) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Most Opened Menu</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {analytics?.mostOpened?.itemTitle || "Dashboard"} ({analytics?.mostOpened?.openCount || 0})
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/40">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Top Favorite Menu</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {analytics?.favoriteMenu?.itemTitle || "Exams"} ({analytics?.favoriteMenu?.openCount || 0})
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-950/40">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Least Used Menu</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                {analytics?.leastUsed?.itemTitle || "Audit Logs"} ({analytics?.leastUsed?.openCount || 0})
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
              <MousePointer className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Avg Click Count</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {analytics?.averageClickCount !== undefined ? `${analytics.averageClickCount} clicks` : "0 clicks"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-indigo-600" />
              Dynamic Navigation & Sidebar Engine
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage MongoDB-backed sidebar hierarchy, custom orderings, dynamic badge counters, and multi-tier access gating.
            </p>
          </div>
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Menu Item
          </Button>
        </CardHeader>
        <CardContent>
          {showAddForm && (
            <form onSubmit={handleCreate} className="mb-6 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900 space-y-4">
              <h4 className="font-semibold text-sm">New Navigation Menu Entry</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Exam Calendar"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded text-sm bg-background"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">URL Route Path *</label>
                  <input
                    type="text"
                    required
                    placeholder="/company/custom-path"
                    value={newPath}
                    onChange={(e) => setNewPath(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded text-sm bg-background"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Lucide Icon Name</label>
                  <input
                    type="text"
                    placeholder="CalendarCheck, Shield, etc."
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded text-sm bg-background"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="e.g., Main, Administration, Reports"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded text-sm bg-background"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Dynamic Badge Keyword</label>
                  <input
                    type="text"
                    placeholder="e.g., pending_approvals, support_tickets, or 5"
                    value={newBadge}
                    onChange={(e) => setNewBadge(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded text-sm bg-background"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Required Permission Key</label>
                  <input
                    type="text"
                    placeholder="e.g., exams.view (leave blank if unrestricted)"
                    value={newPermissionKey}
                    onChange={(e) => setNewPermissionKey(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded text-sm bg-background"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Required Subscription Feature</label>
                  <input
                    type="text"
                    placeholder="e.g., aiProctoring (leave blank for basic plans)"
                    value={newFeatureKey}
                    onChange={(e) => setNewFeatureKey(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded text-sm bg-background"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 flex items-end justify-end gap-2">
                  <Button type="submit" size="sm">Save Menu Item</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
                </div>
              </div>
            </form>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-900">
                  <TableRow>
                    <TableHead className="w-16 text-center font-bold">Order</TableHead>
                    <TableHead className="font-bold">Title & Icon</TableHead>
                    <TableHead className="font-bold">Category</TableHead>
                    <TableHead className="font-bold">Route Path</TableHead>
                    <TableHead className="font-bold">Badge</TableHead>
                    <TableHead className="font-bold">Permission Gate</TableHead>
                    <TableHead className="font-bold">Feature Gate</TableHead>
                    <TableHead className="text-center font-bold">Visibility & Reorder</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No navigation items configured yet in MongoDB.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item, idx) => (
                      <TableRow key={item._id}>
                        <TableCell className="text-center font-mono text-xs font-semibold">
                          #{item.order}
                        </TableCell>
                        <TableCell className="font-medium">
                          <span className="font-semibold">{item.title}</span>{" "}
                          <span className="text-xs text-muted-foreground">({item.icon || "Default"})</span>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                          {item.category || "Main"}
                        </TableCell>
                        <TableCell className="font-mono text-xs text-indigo-600 dark:text-indigo-400">
                          {item.path || item.route || "#"}
                        </TableCell>
                        <TableCell className="text-xs font-mono">
                          {item.badge ? (
                            <span className="px-2 py-0.5 bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 rounded font-semibold border border-sky-200">
                              {item.badge}
                            </span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-700">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          {item.permissionKey ? (
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 rounded-full border border-purple-200">
                              {item.permissionKey}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-light">Unrestricted</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs">
                          {item.featureKey ? (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 rounded-full border border-amber-200">
                              {item.featureKey}
                            </span>
                          ) : (
                            <span className="text-slate-400 font-light">All Plans</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => handleToggleVisibility(item)}
                              title={item.isVisible ? "Visible (Click to Hide)" : "Hidden (Click to Show)"}
                            >
                              {item.isVisible ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4 text-rose-500" />}
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              disabled={idx === 0}
                              onClick={() => handleMove(idx, 'up')}
                              title="Move Up"
                            >
                              <ArrowUp className="h-4 w-4 text-slate-600" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              disabled={idx === items.length - 1}
                              onClick={() => handleMove(idx, 'down')}
                              title="Move Down"
                            >
                              <ArrowDown className="h-4 w-4 text-slate-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

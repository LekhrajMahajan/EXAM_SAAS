import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Shield, Plus, AlertTriangle, Upload, Download, Trash2, Edit } from "lucide-react";
import { PageLoader } from "@/shared/components/loading/LoadingComponents";
import { useGetIpRules, useGetIpRuleStatistics, useDeleteIpRule, useImportIpRules } from '../hooks/security.hooks';
import { IpRuleCategory, IpRuleStatus, IpRuleType, IpRiskLevel } from '../types/security.types';

export const IpRulesPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data: rulesData, isLoading: isLoadingRules } = useGetIpRules({ page, limit: 10, search });
  const { data: statsData, isLoading: isLoadingStats } = useGetIpRuleStatistics();
  const deleteRuleMutation = useDeleteIpRule();
  const importRulesMutation = useImportIpRules();

  const rules = rulesData?.data?.docs || [];
  const stats = statsData?.data;

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this IP rule?")) {
      deleteRuleMutation.mutate(id);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      importRulesMutation.mutate(e.target.files[0]);
    }
  };

  if (isLoadingRules || isLoadingStats) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">IP Whitelist & Blacklist</h1>
          <p className="text-muted-foreground">Manage IP access rules and block malicious actors.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => document.getElementById("import-csv")?.click()}>
            <Upload className="w-4 h-4" />
            Import CSV
            <input id="import-csv" type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </Button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Rule
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-600">Whitelisted</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.whitelisted || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-600">Blacklisted</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.blacklisted || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-600">Temporary Blocks</CardTitle>
            <Shield className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.temporaryBlocks || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>IP Rules List</CardTitle>
          <CardDescription>All active and expired IP rules in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP / Range</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No IP rules found
                  </TableCell>
                </TableRow>
              ) : (
                rules.map((rule: any) => (
                  <TableRow key={rule._id}>
                    <TableCell className="font-medium">
                      {rule.ipAddress || rule.cidrRange}
                    </TableCell>
                    <TableCell>
                      <Badge variant={rule.category === IpRuleCategory.WHITELIST ? "default" : "destructive"}>
                        {rule.category}
                      </Badge>
                    </TableCell>
                    <TableCell>{rule.ruleType}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        rule.riskLevel === IpRiskLevel.CRITICAL ? "border-red-500 text-red-500" :
                        rule.riskLevel === IpRiskLevel.HIGH ? "border-orange-500 text-orange-500" : ""
                      }>
                        {rule.riskLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={rule.status === IpRuleStatus.ACTIVE ? "secondary" : "outline"}>
                        {rule.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(rule._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

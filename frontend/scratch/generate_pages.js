const fs = require('fs');
const path = require('path');

const pages = [
  { name: 'CompaniesPage', title: 'Companies Management' },
  { name: 'CompanyApprovalPage', title: 'Company Approvals' },
  { name: 'SubscriptionsPage', title: 'Subscriptions' },
  { name: 'PlansPage', title: 'Subscription Plans' },
  { name: 'PaymentsPage', title: 'Payments' },
  { name: 'InvoicesPage', title: 'Invoices' },
  { name: 'SystemUsersPage', title: 'System Users' },
  { name: 'RolesPage', title: 'Roles Management' },
  { name: 'PermissionsPage', title: 'Permissions Management' },
  { name: 'SecurityPage', title: 'Security Settings' },
  { name: 'AuditLogsPage', title: 'Audit Logs' },
  { name: 'ActivityLogsPage', title: 'Activity Logs' },
  { name: 'SystemSettingsPage', title: 'System Settings' },
  { name: 'ReportsPage', title: 'Reports' },
  { name: 'SupportTicketsPage', title: 'Support Tickets' },
  { name: 'ProfilePage', title: 'Master Admin Profile' },
];

const targetDir = path.join(__dirname, '../src/features/master-admin/pages');

// Ensure directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

pages.forEach(page => {
  const content = `import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";

export const ${page.name} = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">${page.title}</h1>
        <p className="text-muted-foreground mt-2">
          Manage ${page.title.toLowerCase()} within the system.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>${page.title} Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center border-t bg-muted/10 text-muted-foreground">
          [ ${page.title} Module Placeholder ]
        </CardContent>
      </Card>
    </div>
  );
};
`;

  fs.writeFileSync(path.join(targetDir, `${page.name}.tsx`), content);
});
console.log('Pages generated successfully!');

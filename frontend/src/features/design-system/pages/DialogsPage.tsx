import React, { useState } from 'react';
import { PageHeader, Section, ComponentPreview } from '../components/DocumentationHelpers';
import { GenericDialog, type DialogType } from '@/shared/components/dialogs/DialogComponents';
import { Button } from '@/shared/components/ui/button';

export function DialogsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>('info');

  const openDialog = (type: DialogType) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  return (
    <div>
      <PageHeader 
        title="Dialogs"
        description="Modal windows for alerts, confirmations, and workflows."
      />

      <Section title="Dialog Variants">
        <ComponentPreview>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button variant="outline" onClick={() => openDialog('info')}>Info Dialog</Button>
            <Button variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => openDialog('success')}>Success Dialog</Button>
            <Button variant="outline" className="text-amber-600 border-amber-200 hover:bg-amber-50" onClick={() => openDialog('warning')}>Warning Dialog</Button>
            <Button variant="outline" className="text-rose-600 border-rose-200 hover:bg-rose-50" onClick={() => openDialog('delete')}>Delete/Danger Dialog</Button>
          </div>
        </ComponentPreview>
      </Section>

      <GenericDialog
        isOpen={dialogOpen}
        type={dialogType}
        title={`${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)} Action`}
        message={`This is an example of a ${dialogType} dialog. It blocks the UI until the user takes an action.`}
        onConfirm={() => setDialogOpen(false)}
        onCancel={() => setDialogOpen(false)}
      />
    </div>
  );
}

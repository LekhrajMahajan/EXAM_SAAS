import React, { useState } from 'react';
import { PageHeader, Section } from '../components/DocumentationHelpers';
import { Button } from '@/shared/components/ui/button';

export function ComponentPlaygroundPage() {
  const [variant, setVariant] = useState('default');
  const [size, setSize] = useState('default');
  const [disabled, setDisabled] = useState(false);

  return (
    <div>
      <PageHeader 
        title="Component Playground"
        description="Interact with components and test different props combinations."
      />

      <Section title="Button Playground">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex items-center justify-center p-12 bg-slate-50 border border-slate-200 rounded-xl min-h-[300px]">
            {/* Interactive Preview */}
            <Button 
              variant={variant === 'default' ? 'default' : variant as any}
              size={size === 'default' ? 'default' : size as any}
              disabled={disabled}
              className={variant === 'primary' ? 'bg-indigo-600 text-white hover:bg-indigo-700' : ''}
            >
              Interactive Button
            </Button>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Properties</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Variant</label>
                <select 
                  className="w-full text-sm border-slate-200 rounded-md bg-slate-50"
                  value={variant}
                  onChange={e => setVariant(e.target.value)}
                >
                  <option value="primary">Primary</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost</option>
                  <option value="destructive">Destructive</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Size</label>
                <select 
                  className="w-full text-sm border-slate-200 rounded-md bg-slate-50"
                  value={size}
                  onChange={e => setSize(e.target.value)}
                >
                  <option value="sm">Small</option>
                  <option value="default">Default</option>
                  <option value="lg">Large</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="disabled"
                  checked={disabled}
                  onChange={e => setDisabled(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                />
                <label htmlFor="disabled" className="text-sm text-slate-700">Disabled State</label>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-sm font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Code Snippet</h3>
              <div className="bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-xs overflow-x-auto">
                {`<Button\n  variant="${variant}"\n  size="${size}"${disabled ? '\n  disabled' : ''}\n>\n  Interactive Button\n</Button>`}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

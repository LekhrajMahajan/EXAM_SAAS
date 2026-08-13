import React from 'react';
import { SubjectHeader } from '../components/SubjectHeader';
import { SubjectForm } from '../components/SubjectForm';

export function CreateSubjectPage() {
  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <SubjectHeader
        title="Create New Subject"
        description="Add a new subject and configure its default examination rules."
      />
      <SubjectForm />
    </div>
  );
}

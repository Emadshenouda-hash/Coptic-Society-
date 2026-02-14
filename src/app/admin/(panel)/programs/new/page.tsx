'use client';

import { ProgramForm } from '@/components/admin/program-form';

export default function NewProgramPage() {
  return (
    <div>
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Add New Program</h1>
            <p className="text-muted-foreground">Fill out the form to create a new program or initiative.</p>
        </div>
        <ProgramForm />
    </div>
  );
}

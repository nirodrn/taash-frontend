import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface CategoryFormProps {
  onSubmit: (name: string) => Promise<void>;
}

function CategoryForm({ onSubmit }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(name);
      setName('');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Category Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          'Adding Category...'
        ) : (
          <>
            <Plus className="h-5 w-5" />
            Add Category
          </>
        )}
      </button>
    </form>
  );
}

export default CategoryForm;
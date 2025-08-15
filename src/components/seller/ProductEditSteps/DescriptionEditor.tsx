import React, { useState } from 'react';

interface DescriptionEditorProps {
  initialDescription: string;
  onSave: (description: string) => void;
  onCancel: () => void;
}

const DescriptionEditor: React.FC<DescriptionEditorProps> = ({ 
  initialDescription, 
  onSave, 
  onCancel 
}) => {
  const [description, setDescription] = useState(initialDescription);

  const handleSave = () => {
    onSave(description);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-semibold">Edit Product Description</h3>
          <p className="text-sm text-gray-600 mt-1">
            Write a detailed description for your product. Use this space to highlight features, benefits, and specifications.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="description-editor">Product Description</Label>
        <Textarea
          id="description-editor"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter detailed product description...

Use this space to describe:
• Key features and benefits
• Product specifications
• Use cases and applications
• Care instructions
• Warranty information
• Any other relevant details"
          rows={20}
          className="min-h-[500px] font-mono text-sm"
        />
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
        <div>
          Characters: <span className="font-medium">{description.length}</span>
        </div>
        <div>
          Words: <span className="font-medium">{description.trim() ? description.trim().split(/\s+/).length : 0}</span>
        </div>
        <div>
          Lines: <span className="font-medium">{description.split('\n').length}</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Formatting Tips</h4>
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Use bullet points for features and benefits</p>
          <p>• Include specific measurements, materials, or technical details</p>
          <p>• Mention compatibility or requirements if applicable</p>
          <p>• Keep paragraphs concise for better readability</p>
        </div>
      </div>
    </div>
  );
};

export default DescriptionEditor;
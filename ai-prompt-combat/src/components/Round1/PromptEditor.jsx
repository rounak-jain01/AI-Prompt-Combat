import React from 'react';

const PromptEditor = ({ value, onChange }) => {
  return (
    <div className="w-full h-full flex flex-col">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a detailed prompt that transforms the input image into the target image. Be specific about style, composition, colors, and key visual changes..."
        className="flex-1 w-full bg-transparent text-gray-200 p-4 font-mono text-sm resize-none focus:outline-none custom-scrollbar leading-relaxed placeholder-gray-700 h-50" // Fixed height added
        spellCheck="false"
        maxLength={2000}
      />
      {/* Buttons yahan se hata diye gaye hain */}
    </div>
  );
};

export default PromptEditor;
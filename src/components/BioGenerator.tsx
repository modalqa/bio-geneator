'use client';

import { useState } from 'react';

interface Tag {
  name: string;
  selected: boolean;
}

export default function BioGenerator() {
  const [interests, setInterests] = useState<Tag[]>(
    ["Travel", "Photography", "Fitness", "Food", "Technology", "Music", "Art", "Reading", "Gaming", "Fashion", "Nature", "Movies", "Cooking", "Sports", "Business", "Writing"]
      .map(name => ({ name, selected: false }))
  );

  const [traits, setTraits] = useState<Tag[]>(
    ["Creative", "Passionate", "Ambitious", "Friendly", "Professional", "Adventurous", "Innovative", "Inspiring", "Authentic", "Dedicated", "Optimistic", "Leader"]
      .map(name => ({ name, selected: false }))
  );

  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    platform: 'LinkedIn',
    style: 'Professional',
    includeEmojis: false,
    additionalInfo: ''
  });

  const [bios, setBios] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');
  const [newTrait, setNewTrait] = useState('');

  const handleTagClick = (index: number, type: 'interests' | 'traits') => {
    if (type === 'interests') {
      const newInterests = [...interests];
      newInterests[index].selected = !newInterests[index].selected;
      setInterests(newInterests);
    } else {
      const newTraits = [...traits];
      newTraits[index].selected = !newTraits[index].selected;
      setTraits(newTraits);
    }
  };

  const addNewTag = (type: 'interests' | 'traits') => {
    if (type === 'interests' && newInterest.trim()) {
      setInterests([...interests, { name: newInterest.trim(), selected: true }]);
      setNewInterest('');
    } else if (type === 'traits' && newTrait.trim()) {
      setTraits([...traits, { name: newTrait.trim(), selected: true }]);
      setNewTrait('');
    }
  };

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const generateBios = async () => {
    const selectedInterests = interests.filter(i => i.selected).map(i => i.name);
    const selectedTraits = traits.filter(t => t.selected).map(t => t.name);
    
    if (!formData.profession || selectedInterests.length === 0 || selectedTraits.length === 0) {
      setError('Please fill in profession and select at least one interest and trait');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      console.log('Client: Starting bio generation request...');
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          interests: selectedInterests,
          traits: selectedTraits,
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Client: API error response:', responseData);
        throw new Error(responseData.error || 'Failed to generate bio');
      }

      console.log('Client: Successfully received bio');
      const data = responseData;
      
      // Update statistics via API
      await fetch('/api/stats/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: formData.platform
        }),
      });
      
      setBios(data.bios);
    } catch (err) {
      console.error('Client: Error in bio generation:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate bio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="generator" className="py-16 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6">Tell Us About Yourself</h2>

        {/* Name & Profession */}
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Name (Optional)</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Profession *</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2"
              placeholder="e.g. QA Engineer"
              value={formData.profession}
              onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
            />
          </div>
        </div>

        {/* Interests */}
        <div className="mt-6">
          <label className="block font-medium mb-2">Interests *</label>
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <span
                key={interest.name}
                onClick={() => handleTagClick(index, 'interests')}
                className={`px-3 py-1 rounded-full cursor-pointer ${
                  interest.selected ? 'bg-blue-300' : 'bg-gray-200'
                }`}
              >
                {interest.name}
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded p-2"
              placeholder="Add custom interest"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNewTag('interests')}
            />
            <button
              onClick={() => addNewTag('interests')}
              className="px-3 py-2 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </div>
        </div>

        {/* Traits */}
        <div className="mt-6">
          <label className="block font-medium mb-2">Personality Traits *</label>
          <div className="flex flex-wrap gap-2">
            {traits.map((trait, index) => (
              <span
                key={trait.name}
                onClick={() => handleTagClick(index, 'traits')}
                className={`px-3 py-1 rounded-full cursor-pointer ${
                  trait.selected ? 'bg-blue-300' : 'bg-gray-200'
                }`}
              >
                {trait.name}
              </span>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded p-2"
              placeholder="Add custom trait"
              value={newTrait}
              onChange={(e) => setNewTrait(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNewTag('traits')}
            />
            <button
              onClick={() => addNewTag('traits')}
              className="px-3 py-2 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </div>
        </div>

        {/* Platform & Style */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Platform</label>
            <select
              className="w-full border border-gray-300 rounded p-2"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            >
              <option>LinkedIn</option>
              <option>Instagram</option>
              <option>Twitter/X</option>
              <option>TikTok</option>
              <option>Dating Apps</option>
              <option>Bumble</option>
              <option>Medium</option>
              <option>Youtube</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Style</label>
            <select
              className="w-full border border-gray-300 rounded p-2"
              value={formData.style}
              onChange={(e) => setFormData({ ...formData, style: e.target.value })}
            >
              <option>Professional</option>
              <option>Friendly</option>
              <option>Casual</option>
              <option>Inspiring</option>
            </select>
          </div>
        </div>

        {/* Emoji Toggle */}
        {/* <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="emoji-toggle"
            className="w-4 h-4 border border-gray-300"
            checked={formData.includeEmojis}
            onChange={(e) => setFormData({ ...formData, includeEmojis: e.target.checked })}
          />
          <label htmlFor="emoji-toggle" className="font-medium">Include Emojis</label>
        </div> */}

        {/* Additional Info */}
        <div className="mt-6">
          <label className="block font-medium mb-1">Additional Information (Optional)</label>
          <textarea
            className="w-full border border-gray-300 rounded p-2"
            rows={3}
            value={formData.additionalInfo}
            onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
          />
        </div>

        {/* Generate Button */}
        <div className="mt-6">
          <button
            onClick={generateBios}
            disabled={isLoading}
            className={`w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded font-semibold flex items-center justify-center ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              '🔥 Generate My Perfect Bio'
            )}
          </button>
          {error && (
            <div className="mt-3 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mt-8 space-y-6">
          {bios.map((bio, index) => (
            <div key={index} className="p-6 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-gray-700">Bio {index + 1}</h3>
                <div className="flex items-center gap-2">
                  <span className="bg-gray-200 px-2 py-1 rounded text-sm">
                    {bio.length} chars
                  </span>
                </div>
              </div>
              <div className="prose max-w-none mb-4">
                <p className="text-gray-800 whitespace-pre-line">{bio}</p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(bio);
                  // You could also add a temporary "Copied!" message here
                  const button = document.activeElement as HTMLButtonElement;
                  const originalText = button.textContent;
                  button.textContent = 'Copied!';
                  setTimeout(() => {
                    button.textContent = originalText;
                  }, 2000);
                }}
                className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

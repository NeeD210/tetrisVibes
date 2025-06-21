"use client";

import React, { useState, useEffect } from 'react';
import { Settings, Theme } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => void;
  currentSettings: Settings;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [settings, setSettings] = useState<Settings>(currentSettings);

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gray-800 text-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Settings</h2>

        {/* Theme Selection */}
        <div className="mb-6">
          <label className="block mb-2 font-bold">Theme</label>
          <select
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value as Theme })}
            className="w-full p-2 bg-gray-700 rounded"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
            <option value="retro">Retro</option>
          </select>
        </div>

        {/* Key Repeat Delay (DAS) */}
        <div className="mb-6">
          <label htmlFor="das-slider" className="block mb-2 font-bold">
            Auto Repeat Delay (DAS): {settings.autoRepeatDelay}ms
          </label>
          <input
            id="das-slider"
            type="range"
            min="50"
            max="500"
            step="10"
            value={settings.autoRepeatDelay}
            onChange={(e) => setSettings({ ...settings, autoRepeatDelay: parseInt(e.target.value, 10) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        {/* Key Repeat Rate (ARR) */}
        <div className="mb-6">
          <label htmlFor="arr-slider" className="block mb-2 font-bold">
            Auto Repeat Rate (ARR): {settings.autoRepeatRate}ms
          </label>
          <input
            id="arr-slider"
            type="range"
            min="10"
            max="100"
            step="5"
            value={settings.autoRepeatRate}
            onChange={(e) => setSettings({ ...settings, autoRepeatRate: parseInt(e.target.value, 10) })}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal; 
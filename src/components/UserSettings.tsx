import React, { useState, useEffect } from 'react';
import { X, Euro, Save, Users } from 'lucide-react';
import { useStore } from '../store/useStore';
import toast from 'react-hot-toast';

interface UserSettingsProps {
  onClose: () => void;
}

export function UserSettings({ onClose }: UserSettingsProps) {
  const { user, updateUser } = useStore();
  const [name, setName] = useState(user?.username || '');
  const [hourlyWage, setHourlyWage] = useState(
    localStorage.getItem('userHourlyWage') || ''
  );
  const [employer, setEmployer] = useState(localStorage.getItem('userEmployer') || '');
  const [communityEnabled, setCommunityEnabled] = useState(
    localStorage.getItem('communityEnabled') !== 'false'
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [wageError, setWageError] = useState('');

  const handleWageChange = (value: string) => {
    const formattedValue = value.replace('.', ',');
    
    if (formattedValue === '') {
      setWageError('');
      setHourlyWage('');
    } else if (!/^\d*,?\d{0,2}$/.test(formattedValue)) {
      setWageError('Gebruik een komma voor decimalen (bijv. 12,50)');
    } else {
      setWageError('');
      setHourlyWage(formattedValue);
    }
  };

  const handleSave = () => {
    if (wageError) {
      toast.error('Corrigeer eerst het uurloon formaat');
      return;
    }
    setShowConfirmation(true);
  };

  const confirmSave = () => {
    if (updateUser) {
      updateUser(name);
    }
    const wageForStorage = hourlyWage ? hourlyWage.replace(',', '.') : '';
    localStorage.setItem('userHourlyWage', wageForStorage);
    localStorage.setItem('userEmployer', employer);
    localStorage.setItem('communityEnabled', communityEnabled.toString());
    
    toast.success('Profiel instellingen zijn opgeslagen');
    setShowConfirmation(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src="https://i.imgur.com/dBjUamv.png" 
              alt="ShiftShift Logo" 
              className="h-8 w-auto"
            />
            <h2 className="text-lg font-semibold text-gray-800">Profiel</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Naam
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Uw naam"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Werkgever
            </label>
            <input
              type="text"
              value={employer}
              onChange={(e) => setEmployer(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Naam werkgever"
            />
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bruto Uurloon (€)
              </label>
              <div className="mt-1 flex items-center">
                <Euro className="mr-2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={hourlyWage}
                  onChange={(e) => handleWageChange(e.target.value)}
                  className={`block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1 ${
                    wageError 
                      ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  placeholder="Bijv. 12,50"
                  step="0.10"
                />
              </div>
              {wageError && (
                <p className="mt-1 text-sm text-red-600">{wageError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Dit is uw bruto uurloon voor salaris berekeningen
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-gray-600" />
                <label className="text-sm font-medium text-gray-700">
                  Community Functies
                </label>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={communityEnabled}
                  onChange={(e) => setCommunityEnabled(e.target.checked)}
                  className="peer sr-only"
                />
                <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              {communityEnabled 
                ? 'Community functies zijn ingeschakeld. U kunt berichten plaatsen, communiceren met andere gebruikers en media delen.'
                : 'Community functies zijn uitgeschakeld. U kunt geen gebruik maken van sociale functies.'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Annuleren
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Save className="h-4 w-4" />
            <span>Opslaan</span>
          </button>
        </div>

        {showConfirmation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-semibold">Bevestig wijzigingen</h3>
              <p className="mb-6 text-gray-600">
                Weet u zeker dat u deze wijzigingen wilt opslaan?
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Annuleren
                </button>
                <button
                  onClick={confirmSave}
                  className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Bevestigen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
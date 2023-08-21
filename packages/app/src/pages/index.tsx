import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

import React, { useState } from 'react';

const CredPaymaster: React.FC = () => {
  const [mode, setMode] = useState<'USER' | 'SPONSOR'>('USER');
  const [credential, setCredential] = useState<string>('');

  return (
    <div className={`min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12 ${inter.className}`}>
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <header className="text-center">
            <h1 className="text-3xl font-bold mb-2">CredPaymaster</h1>
            <p className="text-sm">Credential-based Transactions Made Easy</p>
          </header>
          <div className="mt-10">
            <div className="mb-4">
              <button
                className={`px-4 py-2 mr-2 ${mode === 'USER' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => setMode('USER')}
              >
                User
              </button>
              <button
                className={`px-4 py-2 ${mode === 'SPONSOR' ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
                onClick={() => setMode('SPONSOR')}
              >
                Sponsor
              </button>
            </div>
            {mode === 'USER' && (
              <div className="user-mode">
                <input 
                  className="border w-full p-2 rounded mb-3"
                  placeholder="Enter your credential"
                  value={credential}
                  onChange={(e) => setCredential(e.target.value)}
                />
                <button className="bg-green-500 text-white px-4 py-2 rounded mb-2">Connect Wallet</button>
                <div className="mb-2">Status: Eligibility check here</div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Send Transaction</button>
              </div>
            )}
            {mode === 'SPONSOR' && (
              <div className="sponsor-mode">
                <input 
                  className="border w-full p-2 rounded mb-3"
                  placeholder="Set sponsorship details"
                />
                <button className="bg-green-500 text-white px-4 py-2 rounded mb-2">Connect Wallet</button>
                <div className="mb-2">Status: Eligibility check here</div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Submit Sponsorship</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CredPaymaster;

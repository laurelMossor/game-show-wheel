'use client';

import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = 'admin-pass';
const AUTH_KEY = 'gameshow-admin-auth';

export function useAuth() {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	// Check authentication status on mount
	useEffect(() => {
		const authStatus = sessionStorage.getItem(AUTH_KEY);
		setIsAuthenticated(authStatus === 'true');
		setIsLoading(false);
	}, []);

	// Login function - simple password check
	const login = (password: string): boolean => {
		if (password === ADMIN_PASSWORD) {
			sessionStorage.setItem(AUTH_KEY, 'true');
			setIsAuthenticated(true);
			return true;
		}
		return false;
	};

	// Logout function
	const logout = () => {
		sessionStorage.removeItem(AUTH_KEY);
		setIsAuthenticated(false);
	};

	return {
		isAuthenticated,
		isLoading,
		login,
		logout
	};
}

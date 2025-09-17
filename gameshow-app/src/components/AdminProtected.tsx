'use client';

import { useAuth } from '@/hooks/useAuth';
import LoginForm from './LoginForm';

interface AdminProtectedProps {
	children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
	const { isAuthenticated, isLoading, login } = useAuth();

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className="game-container">
				<div style={{ 
					maxWidth: '400px', 
					margin: '0 auto',
					padding: '20px',
					textAlign: 'center'
				}}>
					<p>Loading...</p>
				</div>
			</div>
		);
	}

	// Show login form if not authenticated
	if (!isAuthenticated) {
		return <LoginForm onLogin={login} />;
	}

	// Show protected content if authenticated
	return <>{children}</>;
}



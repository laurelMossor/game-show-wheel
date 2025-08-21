'use client';

import { useState } from 'react';
import SpinningWheel from '../../components/wheel/SpinningWheel';
import SpinResultBanner from '../../components/SpinResultBanner';
import WheelContainer from '../../components/wheel/WheelContainer';
import UserDirectionsBanner from '../../components/UserDirectionsBanner';
import AdminProtected from '../../components/AdminProtected';

export default function WheelPage() {
	const [result, setResult] = useState<string>('');
	const [isBlinking, setIsBlinking] = useState(false);

	const handleSpinResult = (wheelResult: string) => {
		setResult(wheelResult);
		// Add blinking effect when result is displayed
		setIsBlinking(true);
		// Remove blinking after 5 seconds
		setTimeout(() => setIsBlinking(false), 5000);
	};

	return (
		<AdminProtected>
			<div className="game-container">
				<div style={{ 
					maxWidth: '1200px', 
					margin: '0 auto',
					padding: '20px'
				}}>
					{/* Result Banner */}
					<SpinResultBanner
						result={result}
						isBlinking={isBlinking}
					/>

					{/* Wheel Section */}
					<WheelContainer>
						<SpinningWheel onSpinResult={handleSpinResult} />
					</WheelContainer>

					{/* User Directions Banner */}
					<div style={{ 
						display: 'flex',
						justifyContent: 'center'
					}}>
						<UserDirectionsBanner
							title="How to Use the Wheel"
							instructions={[
								{
									label: "Spin the Wheel",
									description: "Click the SPIN button or press or",
									shortcuts: ["Space", "Enter"]
								},
								{
									label: "Navigation",
									description: "Use for Scores, for Wheel",
									shortcuts: ["F1", "F2"]
								}
							]}
							actions={[
								{
									text: "Back to Scores",
									onClick: () => window.location.href = '/scores',
									variant: "secondary",
									icon: "📊"
								}
							]}
							style={{ maxWidth: '800px', width: '100%' }}
						/>
					</div>
				</div>
			</div>
		</AdminProtected>
	);
}

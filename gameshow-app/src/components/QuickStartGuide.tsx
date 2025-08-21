'use client';

import KeyboardShortcut from './KeyboardShortcut';

interface GuideSection {
	title: string;
	description: string;
	shortcuts?: string[];
}

interface QuickStartGuideProps {
	sections: GuideSection[];
	title?: string;
	icon?: string;
	className?: string;
}

export default function QuickStartGuide({ 
	sections, 
	title = "Quick Start Guide",
	icon = "🎮",
	className = "user-directions-banner"
}: QuickStartGuideProps) {
	return (
		<div className={className}>
			<h4>
				<span style={{ marginRight: '0.5rem' }}>{icon}</span>
				{title}
			</h4>
			{sections.map((section, index) => (
				<p key={index}>
					<strong>{section.title}:</strong> {section.description}
					{section.shortcuts && (
						<>
							{' '}Press{' '}
							<KeyboardShortcut keys={section.shortcuts} />
						</>
					)}
				</p>
			))}
		</div>
	);
}

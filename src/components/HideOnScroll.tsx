import React from 'react';
import { Slide, useScrollTrigger } from '@mui/material';

export interface HideOnScrollProps {
	window?: () => Window;
	children: React.ReactElement;
}

export default function HideOnScroll(props: HideOnScrollProps) {
	const { children, window } = props;
	const trigger = useScrollTrigger({
		target: window ? window() : undefined
	});

	return (
		<Slide appear={false} direction={'down'} in={!trigger}>
			{children}
		</Slide>
	)
}

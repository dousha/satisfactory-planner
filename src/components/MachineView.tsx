import React from 'react';
import { MachineInstance } from '../models/MachineInstance';
import { Box, Card, CardActions, CardContent, IconButton, Typography } from '@mui/material';
import { Delete, Edit, Timer } from '@mui/icons-material';

export interface MachineViewProps {
	machine: MachineInstance;
}

export default function MachineView(props: MachineViewProps) {
	return (<>
		<Card>
			<CardContent>
				<Typography variant={'h6'}>{props.machine.name}</Typography>
			</CardContent>
			<CardActions>
				<IconButton>
					<Delete />
				</IconButton>
				<Box sx={{flexGrow: 1}} />
				<IconButton>
					<Timer />
				</IconButton>
				<IconButton>
					<Edit />
				</IconButton>
			</CardActions>
		</Card>
	</>);
}

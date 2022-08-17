import React from 'react';
import { MachineInstance } from '../models/MachineInstance';
import { Box, Card, CardActions, CardContent, IconButton, Typography } from '@mui/material';
import { Delete, Edit, Timer } from '@mui/icons-material';
import { ResourceType, ResourceTypeFriendlyNames } from '../models/ResourceType';
import { ResourceUtility } from '../models/ResourceUtility';

export interface MachineViewProps {
	machine: MachineInstance;

	onMachineDelete: () => void;
	onMachineClockSpeedEdit: () => void;
}

function toResourceDescription(res: ResourceUtility, clockRate: number) {
	const utilityRate = Math.floor(res.quantityPerMinute * clockRate);
	const name = ResourceTypeFriendlyNames[res.name];
	return `${name} x ${utilityRate} / min`;
}

function toActualPower(base: number, clockRate: number) {
	return base * Math.pow(clockRate, 1 / 1.3);
}

export default function MachineView(props: MachineViewProps) {
	const inputItemString = `${props.machine.template.input.length > 0 ? props.machine.template.input.map(it => toResourceDescription(it, props.machine.clockSpeed)) : ResourceTypeFriendlyNames[ResourceType.NOTHING]}`;
	const outputItemString = `${props.machine.template.output.map(it => toResourceDescription(it, props.machine.clockSpeed))}`;

	return (<>
		<Card>
			<CardContent>
				<Typography variant={'h6'}>{props.machine.name}</Typography>
				<Typography>Clock speed: {Math.floor(props.machine.clockSpeed * 100)}%</Typography>
				<Typography>Input: {inputItemString}</Typography>
				<Typography>Output: {outputItemString}</Typography>
				<Typography>Power: {toActualPower(props.machine.template.power, props.machine.clockSpeed).toFixed(2)} MW</Typography>
			</CardContent>
			<CardActions>
				<IconButton onClick={props.onMachineClockSpeedEdit}>
					<Timer />
				</IconButton>
				<Box sx={{flexGrow: 1}} />
				<IconButton onClick={props.onMachineDelete}>
					<Delete />
				</IconButton>
			</CardActions>
		</Card>
	</>);
}

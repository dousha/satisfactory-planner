import React from 'react';
import { CalculatedMachineInstance } from '../models/MachineInstance';
import { Box, Card, CardActions, CardContent, Grid, IconButton, Tooltip, Typography } from '@mui/material';
import { Bolt, Delete, LowPriority, Timer, Warning } from '@mui/icons-material';
import { ResourceType, ResourceTypeFriendlyNames } from '../models/ResourceType';
import { ResourceUtility } from '../models/ResourceUtility';

export interface MachineViewProps {
	machine: CalculatedMachineInstance;

	onMachineDelete: () => void;
	onMachineClockSpeedEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
	onMachinePriorityEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
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
	const inputItemString = `${props.machine.instance.template.input.length > 0 ? props.machine.instance.template.input.map(it => toResourceDescription(it, props.machine.instance.clockSpeed)) : ResourceTypeFriendlyNames[ResourceType.NOTHING]}`;
	const outputItemString = `${props.machine.instance.template.output.map(it => toResourceDescription(it, props.machine.instance.clockSpeed))}`;

	return (<>
		<Card>
			<CardContent>
				<Grid container direction={'row'} spacing={1} alignItems={'center'}>
					<Grid item>
						<Typography variant={'h6'}>{props.machine.instance.name}</Typography>
					</Grid>
					<Grid item sx={{flexGrow: 1}} />
					<Grid item>
						{props.machine.isRunningShort() ? <Warning sx={{color: props.machine.isStalled() ? 'red' : 'gray'}} /> : null}
					</Grid>
				</Grid>
				<Typography>Clock speed: {Math.floor(props.machine.instance.clockSpeed * 100)}% {props.machine.instance.clockSpeed > 1.0 ? <Bolt /> : null}</Typography>
				<Typography>Input: {inputItemString}</Typography>
				<Typography>Output: {outputItemString}</Typography>
				<Typography>Power: {toActualPower(props.machine.instance.template.power, props.machine.instance.clockSpeed).toFixed(2)} MW</Typography>
				<Typography>Priority: {props.machine.instance.priority}</Typography>
			</CardContent>
			<CardActions>
				<Tooltip title={'Clock speed'}>
					<IconButton onClick={props.onMachineClockSpeedEdit}>
						<Timer />
					</IconButton>
				</Tooltip>
				<Tooltip title={'Priority'}>
					<IconButton onClick={props.onMachinePriorityEdit}>
						<LowPriority />
					</IconButton>
				</Tooltip>
				<Box sx={{flexGrow: 1}} />
				<Tooltip title={'Delete'}>
					<IconButton onClick={props.onMachineDelete}>
						<Delete />
					</IconButton>
				</Tooltip>
			</CardActions>
		</Card>
	</>);
}

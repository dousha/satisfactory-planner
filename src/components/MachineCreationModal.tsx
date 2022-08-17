import React, { useState } from 'react';
import {
	Box,
	Button,
	Card, CardActions,
	CardContent,
	Container,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Modal,
	Select, Slider, TextField, Typography,
} from '@mui/material';
import { createMachineInstance, MachineInstance } from '../models/MachineInstance';
import { getMachineTemplateByName, Machines } from '../models/Machine';

export interface MachineCreationModalProps {
	open: boolean;

	onConfirm: (x: MachineInstance) => void;
	onCancel: () => void;
}

export default function MachineCreationModal(props: MachineCreationModalProps) {
	const [templateName, setTemplateName] = useState('');
	const [machineName, setMachineName] = useState('');
	const [clockRate, setClockRate] = useState(1.0);

	const dialogCleanUp = () => {
		setTemplateName('');
		setMachineName('');
		setClockRate(1.0);
	};

	const onDialogConfirm = () => {
		const template = getMachineTemplateByName(templateName);
		if (template != null) {
			const machine = createMachineInstance(template);
			machine.name = machineName || template.name;
			machine.clockSpeed = clockRate;
			props.onConfirm(machine);
		}
		dialogCleanUp();
	};

	const onDialogCancel = () => {
		props.onCancel();
		dialogCleanUp();
	};

	const onSliderChange = (e: Event, val: number | number[]) => {
		setClockRate(val as number);
	};

	const clockRateMarks = [
		{value: 0.1, label: '10%'},
		{value: 0.25, label: '25%'},
		{value: 0.5, label: '50%'},
		{value: 0.8, label: '80%'},
		{value: 1.0, label: '100%'},
		{value: 1.2, label: '120%'},
		{value: 1.5, label: '150%'},
		{value: 2.0, label: '200%'},
	];

	return (<>
		<Modal open={props.open}>
			<Container>
				<Grid container direction={'column'} alignItems={'center'} justifyContent={'center'} sx={{height: '100vh'}}>
					<Grid item>
						<Card sx={{minWidth: '50vw'}}>
							<CardContent>
								<Grid container direction={'column'} spacing={1}>
									<Grid item>
										<FormControl fullWidth>
											<InputLabel id={'lbl-machine-type'}>Machine</InputLabel>
											<Select labelId={'lbl-machine-type'} label={'Machine'} value={templateName} onChange={e => setTemplateName(e.target.value)}>
												{Machines.map((it, index) => <MenuItem value={it.name} key={index}>{it.name}</MenuItem>)}
											</Select>
										</FormControl>
									</Grid>
									<Grid item>
										<TextField label={'Machine Name'} value={machineName} placeholder={templateName} onChange={e => setMachineName(e.target.value)} fullWidth></TextField>
									</Grid>
									<Grid item>
										<Grid container direction={'row'} justifyContent={'space-between'}>
											<Grid item>
												<Typography>Clock rate</Typography>
											</Grid>
											<Grid item>
												<Typography>{Math.floor(clockRate * 100)}%</Typography>
											</Grid>
										</Grid>
										<Slider value={clockRate} step={0.01} min={0.01} max={2.5} marks={clockRateMarks} onChange={onSliderChange} />
									</Grid>
								</Grid>
							</CardContent>
							<CardActions>
								<Button onClick={onDialogConfirm} disabled={templateName.length === 0}>Ok</Button>
								<Box sx={{flexGrow: 1}} />
								<Button onClick={onDialogCancel}>Cancel</Button>
							</CardActions>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</Modal>
	</>);
}

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
	Paper,
	Select,
} from '@mui/material';
import { MachineInstance } from '../models/MachineInstance';
import { Machines } from '../models/Machine';

export interface MachineCreationModalProps {
	open: boolean;

	onConfirm: (x: MachineInstance) => void;
	onCancel: () => void;
}

export default function MachineCreationModal(props: MachineCreationModalProps) {
	const [templateName, setTemplateName] = useState('');
	const [machineName, setMachineName] = useState('');
	const [clockRate, setClockRate] = useState(1.0);

	return (<>
		<Modal open={props.open}>
			<Container>
				<Grid container direction={'column'} alignItems={'center'} justifyContent={'center'} sx={{height: '100vh'}}>
					<Grid item>
						<Card>
							<CardContent>
								<Grid container direction={'column'}>
									<Grid item>
										<FormControl fullWidth>
											<InputLabel id={'lbl-machine-type'}>Machine</InputLabel>
											<Select labelId={'lbl-machine-type'} label={'Machine'} value={templateName} onChange={e => setTemplateName(e.target.value)}>
												{Machines.map((it, index) => <MenuItem value={it.name} key={index}>{it.name}</MenuItem>)}
											</Select>
										</FormControl>
									</Grid>
								</Grid>
							</CardContent>
							<CardActions>
								<Button>Ok</Button>
								<Box sx={{flexGrow: 1}} />
								<Button onClick={props.onCancel}>Cancel</Button>
							</CardActions>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</Modal>
	</>);
}

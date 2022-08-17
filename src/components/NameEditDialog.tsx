import React, { useState } from 'react';
import { Button, Card, CardActions, CardContent, Container, Grid, Modal, TextField } from '@mui/material';

export interface NameEditDialogProps {
	open: boolean;
	title: string;
	initialValue?: string;

	onConfirm: (xs: string) => void;
	onCancel: () => void;
}

export default function NameEditDialog(props: NameEditDialogProps) {
	const [newName, setNewName] = useState(props.initialValue || '');
	if (typeof props.initialValue === 'string' && props.initialValue !== newName) {
		setNewName(props.initialValue);
	}

	const onDialogSave = () => {
		if (newName.length > 0) {
			props.onConfirm(newName);
		} else {
			props.onCancel();
		}
	};

	const onDialogType = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			onDialogSave();
		}
	};

	return (<>
		<Modal open={props.open}>
			<Container>
				<Grid container direction={'column'} alignItems={'center'} justifyContent={'center'} sx={{height: '100vh'}}>
					<Grid item>
						<Card>
							<CardContent>
								<TextField label={props.title} value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={onDialogType}></TextField>
							</CardContent>
							<CardActions>
								<Button onClick={onDialogSave}>Save</Button>
								<Button onClick={props.onCancel}>Cancel</Button>
							</CardActions>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</Modal>
	</>);
}

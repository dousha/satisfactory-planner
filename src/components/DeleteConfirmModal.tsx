import React from 'react';
import { Button, Card, CardActions, CardContent, Container, Grid, Modal, Typography } from '@mui/material';

export interface DeleteConfirmModal {
	open: boolean;
	title: string;
	description?: string;

	onConfirm: () => void;
	onCancel: () => void;
}


export default function DeleteConfirmModal(props: DeleteConfirmModal) {
	return (<>
		<Modal open={props.open} onClose={props.onCancel}>
			<Container>
				<Grid container direction={'column'} alignItems={'center'} justifyContent={'center'} sx={{height: '100vh'}}>
					<Grid item>
						<Card>
							<CardContent>
								<Typography variant={'h6'}>{props.title}</Typography>
								<Typography>{props.description}</Typography>
							</CardContent>
							<CardActions>
								<Button onClick={props.onCancel}>Cancel</Button>
								<Button onClick={props.onConfirm} color={'error'}>Delete!</Button>
							</CardActions>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</Modal>
	</>);
}

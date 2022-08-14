import React, { useState } from 'react';
import {
	AppBar, Box, Button,
	Card, CardActions,
	CardContent,
	Container,
	CssBaseline,
	Grid, IconButton, Modal,
	Toolbar,
	Typography,
} from '@mui/material';
import { StorageInstance } from '../logic/Storage';
import HideOnScroll from '../components/HideOnScroll';
import { Settings } from '@mui/icons-material';
import { createNewSite } from '../models/ProductionSite';

const dialogStyle = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
};

export interface LandingPageProps {
	loadEditor: (x: number) => void;
}

export default function LandingPage(props: LandingPageProps) {
	const sites = StorageInstance.getSavedProductionSites();
	const [isDeleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
	const [deletingItem, setDeletingItem] = useState(-1);

	const onCreateNewSitePressed = () => {
		const site = createNewSite();
		const id = StorageInstance.addNewSite(site);
		StorageInstance.commit();
		props.loadEditor(id);
	};

	const onLoadSitePressed = (id: number) => {
		return () => props.loadEditor(id);
	};

	const onDeletePressed = (id: number) => {
		return () => {
			setDeletingItem(id);
			setDeleteConfirmDialogOpen(true);
		}
	};

	const onDeleteDialogClose = () => {
		setDeleteConfirmDialogOpen(false);
	};

	const onDeleteConfirmed = () => {
		StorageInstance.deleteSite(deletingItem);
		StorageInstance.commit();
		setDeletingItem(-1);
		setDeleteConfirmDialogOpen(false);
	};

	const onImportDataPressed = () => {};

	return (<>
		<CssBaseline />
		<HideOnScroll>
			<AppBar>
				<Toolbar>
					<Typography variant={'h6'} component={'div'}>
						Satisfactory Planner
					</Typography>
					<Box sx={{flexGrow: 1}} />
					<IconButton>
						<Settings sx={{color: 'white'}} />
					</IconButton>
				</Toolbar>
			</AppBar>
		</HideOnScroll>
		<Container sx={{py: 10}}>
			<Grid container direction={'column'} spacing={2} alignItems={'stretch'}>
				{sites.map((it, index) =>
					<Grid item key={index}>
						<Card>
							<CardContent>
								<Typography variant={'h4'}>{it.name}</Typography>
								<Typography>Last edit: {it.lastEditTime ? new Date(it.lastEditTime).toLocaleString() : 'Unknown'}</Typography>
							</CardContent>
							<CardActions>
								<Button onClick={onLoadSitePressed(index)}>Load</Button>
								<Box sx={{flexGrow: 1}} />
								<Button color={'error'} onClick={onDeletePressed(index)}>Delete</Button>
							</CardActions>
						</Card>
					</Grid>
				)}

				<Grid item>
					<Card>
						<CardContent>
							<Typography variant={'h4'}>New Production Site</Typography>
						</CardContent>
						<CardActions>
							<Button onClick={onCreateNewSitePressed}>Create new site</Button>
							<Button onClick={onImportDataPressed}>Import...</Button>
						</CardActions>
					</Card>
				</Grid>
			</Grid>
		</Container>
		<Modal open={isDeleteConfirmDialogOpen} onClose={onDeleteDialogClose}>
			<Box sx={dialogStyle}>
				<Card>
					<CardContent>
						<Typography variant={'h6'}>
							Deleting {deletingItem >= 0 ? StorageInstance.getProductionSite(deletingItem).name : '(MISSINGNO.)'}
						</Typography>
						<Typography>Are you sure?</Typography>
					</CardContent>
					<CardActions>
						<Button onClick={onDeleteDialogClose}>Cancel</Button>
						<Button color={'error'} onClick={onDeleteConfirmed}>Delete!</Button>
					</CardActions>
				</Card>
			</Box>
		</Modal>
	</>);
}

import React, { useState } from 'react';
import {
	AppBar,
	Box, Button,
	Card, CardActions,
	CardContent,
	Container,
	CssBaseline,
	Grid,
	IconButton, Modal, Paper, TextField,
	Toolbar,
	Typography,
} from '@mui/material';
import HideOnScroll from '../components/HideOnScroll';
import { ArrowBack, Edit, Power, ReceiptLong } from '@mui/icons-material';
import { StorageInstance } from '../logic/Storage';
import { ProductionSite } from '../models/ProductionSite';

export interface EditorPageProps {
	id: number;

	loadLandingPage: () => void;
}

export default function ProductionSiteEditor(props: EditorPageProps) {
	let savedSite: ProductionSite;

	try {
		savedSite = StorageInstance.getProductionSite(props.id);
	} catch (e) {
		savedSite = {
			name: 'MissingNo.',
			lastEditTime: 0,
			pipelines: []
		};
		console.error(`${props.id} is not a valid site`);
		props.loadLandingPage();
	}

	const [site, setSite] = useState(savedSite);
	const [siteName, setSiteName] = useState(site.name);
	const [isNameEditorOpen, setNameEditorOpen] = useState(false);

	const onNameEditClick = () => {
		setNameEditorOpen(true);
	};

	const onNameEditDialogClose = () => {
		setNameEditorOpen(false);
	};

	const onNameEditDialogSave = () => {
		setNameEditorOpen(false);
		if (siteName.length > 0) {
			savedSite.name = siteName;
			setSite(savedSite);
			StorageInstance.saveSite(props.id, savedSite);
			StorageInstance.commit();
		} else {
			setSiteName(site.name);
		}
	};

	const onNameEditDialogCancel = () => {
		setNameEditorOpen(false);
		setSiteName(site.name);
	};

	return (<>
		<CssBaseline />
		<HideOnScroll>
			<AppBar>
				<Toolbar>
					<IconButton onClick={props.loadLandingPage}>
						<ArrowBack sx={{color: 'white'}} />
					</IconButton>
					<Box sx={{width: 8}} />
					<Typography variant={'h6'} component={'div'}>
						{site.name}
					</Typography>
					<Box sx={{width: 4}} />
					<IconButton onClick={onNameEditClick}>
						<Edit sx={{color: 'white'}} />
					</IconButton>
				</Toolbar>
			</AppBar>
		</HideOnScroll>
		<Container>
			<Grid container direction={'column'} alignItems={'stretch'} spacing={2} sx={{py: 10}}>
				<Grid item>
					<Paper>
						<Toolbar>
							<Button startIcon={<ReceiptLong />}>
								BOM
							</Button>
							<Button startIcon={<Power />}>
								Power
							</Button>
						</Toolbar>
					</Paper>
				</Grid>

				{site.pipelines.map((it, index) =>
					<Grid item key={index}>
						<Card>
							<CardContent>
								<Typography>{it.name}</Typography>
							</CardContent>
							<CardActions>
								<Button>Edit</Button>
								<Box sx={{flexGrow: 1}} />
								<Button>Delete</Button>
							</CardActions>
						</Card>
					</Grid>
				)}

				<Grid item>
					<Card>
						<CardContent>
							<Typography variant={'h5'}>New Pipeline</Typography>
						</CardContent>
						<CardActions>
							<Button>Create</Button>
						</CardActions>
					</Card>
				</Grid>
			</Grid>
		</Container>
		<Modal open={isNameEditorOpen} onClose={onNameEditDialogClose}>
			<Container>
				<Grid container direction={'column'} alignItems={'center'} justifyContent={'center'} sx={{height: '100vh'}}>
					<Grid item>
						<Card>
							<CardContent>
								<TextField label={'Pipeline name'} value={siteName} onChange={e => setSiteName(e.target.value)}></TextField>
							</CardContent>
							<CardActions>
								<Button onClick={onNameEditDialogSave}>Save</Button>
								<Button onClick={onNameEditDialogCancel}>Cancel</Button>
							</CardActions>
						</Card>
					</Grid>
				</Grid>
			</Container>
		</Modal>
	</>);
}

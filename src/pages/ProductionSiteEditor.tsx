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
import { randomIdString } from '../util/Random';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

export interface EditorPageProps {
	id: number;

	loadLandingPage: () => void;
	loadPipelinePage: (x: number) => void;
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
	const [isPipelineDeleteOpen, setPipelineDeleteOpen] = useState(false);
	const [operatingPipeline, setOperatingPipeline] = useState(-1);

	const onNameEditClick = () => {
		setNameEditorOpen(true);
	};

	const onNameEditDialogSave = () => {
		setNameEditorOpen(false);
		if (siteName.length > 0) {
			const newSite = {...site, name: siteName};
			setSite(newSite);
			StorageInstance.saveSite(props.id, newSite);
			StorageInstance.commit();
		} else {
			setSiteName(site.name);
		}
	};

	const onNameEditDialogCancel = () => {
		setNameEditorOpen(false);
		setSiteName(site.name);
	};

	const onCreateButtonClick = () => {
		const newSite = {...site, pipelines: site.pipelines.concat([{name: `Pipeline #${randomIdString()}`, stages: []}])}
		setSite(newSite);
		StorageInstance.saveSite(props.id, newSite);
		StorageInstance.commit();
	};

	const onPipelineEditButtonClick = (x: number) => {
		return () => {
			props.loadPipelinePage(x);
		};
	};

	const deletePipeline = (x: number) => {
		const newSite = {...site, pipelines: site.pipelines.filter((it, index) => index !== x)}
		setSite(newSite);
		StorageInstance.saveSite(props.id, newSite);
		StorageInstance.commit();
	}

	const onPipelineDeleteButtonClick = (x: number) => {
		return () => {
			if (site.pipelines[x].stages.length > 0) {
				setPipelineDeleteOpen(true);
				setOperatingPipeline(x);
			} else {
				deletePipeline(x);
			}
		};
	};

	const onPipelineDeleteConfirm = () => {
		deletePipeline(operatingPipeline);
		setOperatingPipeline(-1);
		setPipelineDeleteOpen(false);
	};

	const onPipelineDeleteCancel = () => {
		setPipelineDeleteOpen(false);
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

				{site.pipelines.length === 0 ?
					<Grid item>
						<Typography>Empty pipeline</Typography>
					</Grid>
					:
					site.pipelines.map((it, index) =>
					<Grid item key={index}>
						<Card>
							<CardContent>
								<Typography variant={'h5'}>{it.name}</Typography>
								<Typography>Stage count: {it.stages.length}</Typography>
							</CardContent>
							<CardActions>
								<Button onClick={onPipelineEditButtonClick(index)}>Edit</Button>
								<Box sx={{flexGrow: 1}} />
								<Button color={'error'} onClick={onPipelineDeleteButtonClick(index)}>Delete</Button>
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
							<Button onClick={onCreateButtonClick}>Create</Button>
						</CardActions>
					</Card>
				</Grid>
			</Grid>
		</Container>
		<Modal open={isNameEditorOpen}>
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

		<DeleteConfirmModal open={isPipelineDeleteOpen} title={`Deleting ${operatingPipeline >= 0 ? site.pipelines[operatingPipeline].name : '(MISSINGNO.)'}`} description={'Are you sure?'} onConfirm={onPipelineDeleteConfirm} onCancel={onPipelineDeleteCancel} />
	</>);
}

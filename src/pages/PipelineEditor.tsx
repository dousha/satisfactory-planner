import React, { useState } from 'react';
import {
	AppBar,
	Box,
	Button, Card, CardActions, CardContent,
	Container,
	CssBaseline,
	Grid,
	IconButton,
	Paper,
	Toolbar,
	Typography,
} from '@mui/material';
import HideOnScroll from '../components/HideOnScroll';
import { Add, ArrowBack, Delete, Edit, Power, ReceiptLong } from '@mui/icons-material';
import { StorageInstance } from '../logic/Storage';
import MachineView from '../components/MachineView';
import { randomIdString } from '../util/Random';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import MachineCreationModal from '../components/MachineCreationModal';
import { MachineInstance } from '../models/MachineInstance';
import NameEditDialog from '../components/NameEditDialog';

export interface PipelineEditorProps {
	id: number;
	line: number;

	loadSitePage: () => void;
}

export default function PipelineEditor(props: PipelineEditorProps) {
	const site = StorageInstance.getProductionSite(props.id);
	let savedPipeline = site.pipelines[props.line];

	const [pipeline, setPipeline] = useState(savedPipeline);
	const [isNameDialogOpen, setNameDialogOpen] = useState(false);
	const [pipelineName, setPipelineName] = useState(pipeline.name);
	const [isStageDeleteDialogOpen, setStageDeleteDialogOpen] = useState(false);
	const [currentOperatingStage, setCurrentOperatingStage] = useState(-1);
	const [isMachineCreationDialogOpen, setMachineCreationDialogOpen] = useState(false);
	const [isStageNameDialogOpen, setStageNameDialogOpen] = useState(false);

	const savePipeline = () => {
		const newPipeline = {...savedPipeline};
		const newSite = {...site, pipelines: site.pipelines.map((it, index) => index === props.line ? newPipeline : it)};
		setPipeline(newPipeline);
		StorageInstance.saveSite(props.id, newSite);
		StorageInstance.commit();
	};

	const onNameEditClick = () => {
		setNameDialogOpen(true);
	};

	const onCreateClick = () => {
		savedPipeline.stages.push({
			name: `New stage #${randomIdString()}`,
			machines: []
		});
		savePipeline();
	};

	const onNameDialogSave = (xs: string) => {
		savedPipeline.name = xs;
		setPipelineName(xs);
		savePipeline();
		setNameDialogOpen(false);
	};

	const onNameDialogCancel = () => {
		setPipelineName(pipeline.name);
		setNameDialogOpen(false);
	};

	const onStageNameEdit = (x: number) => {
		return () => {
			setCurrentOperatingStage(x);
			setStageNameDialogOpen(true);
		};
	};

	const onStageNameDialogSave = (xs: string) => {
		savedPipeline.stages[currentOperatingStage].name = xs;
		savePipeline();
		setCurrentOperatingStage(-1);
		setStageNameDialogOpen(false);
	};

	const onStageNameDialogCancel = () => {
		setCurrentOperatingStage(-1);
		setStageNameDialogOpen(false);
	};

	const onStageDeleteClick = (x: number) => {
		return () => {
			if (savedPipeline.stages[x].machines.length < 1) {
				savedPipeline.stages.splice(x);
				savePipeline();
			} else {
				setCurrentOperatingStage(x);
				setStageDeleteDialogOpen(true);
			}
		};
	};

	const onStageDeleteConfirm = () => {
		savedPipeline.stages.splice(currentOperatingStage);
		setCurrentOperatingStage(-1);
		setStageDeleteDialogOpen(false);
		savePipeline();
	};

	const onStageDeleteCancel = () => {
		setStageDeleteDialogOpen(false);
		setCurrentOperatingStage(-1);
	};

	const onStageMachineAdd = (x: number) => {
		return () => {
			setCurrentOperatingStage(x);
			setMachineCreationDialogOpen(true);
		};
	};

	const onStageMachineAddConfirm = (machine: MachineInstance) => {
		savedPipeline.stages[currentOperatingStage].machines.push(machine);
		savePipeline();
	};

	const onStageMachineAddCancel = () => {
		setMachineCreationDialogOpen(false);
	};

	const editingStageName = currentOperatingStage >= 0 ? pipeline.stages[currentOperatingStage].name : '(MISSINGNO).';

	return (<>
		<CssBaseline />
		<HideOnScroll>
			<AppBar>
				<Toolbar>
					<IconButton onClick={props.loadSitePage}>
						<ArrowBack sx={{color: 'white'}} />
					</IconButton>
					<Box sx={{width: 8}} />
					<Typography variant={'h6'} component={'div'}>
						{pipeline.name}
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

				{pipeline.stages.length === 0 ?
					<Grid item>
						<Typography>Empty pipeline</Typography>
					</Grid>
					:
					pipeline.stages.map((it, index) =>
					<Grid item key={index}>
						<Card>
							<CardContent>
								<Grid container direction={'row'} alignItems={'center'} spacing={1}>
									<Grid item>
										<Typography variant={'h5'}>{it.name}</Typography>
									</Grid>
									<Grid item>
										<IconButton onClick={onStageNameEdit(index)}>
											<Edit />
										</IconButton>
									</Grid>
								</Grid>
								<Grid container>
									{it.machines.length === 0 ?
										<Typography>No machine.</Typography>
										:
										it.machines.map((it, index) => <Grid item key={index}><MachineView machine={it} /></Grid>)
									}
								</Grid>
							</CardContent>
							<CardActions>
								<IconButton onClick={onStageMachineAdd(index)}>
									<Add />
								</IconButton>
								<Box sx={{flexGrow: 1}} />
								<IconButton onClick={onStageDeleteClick(index)}>
									<Delete />
								</IconButton>
							</CardActions>
						</Card>
					</Grid>
				)}

				<Grid item>
					<Card>
						<CardContent>
							<Typography variant={'h5'}>New Stage</Typography>
						</CardContent>
						<CardActions>
							<Button onClick={onCreateClick}>Create</Button>
						</CardActions>
					</Card>
				</Grid>
			</Grid>
		</Container>

		<NameEditDialog open={isNameDialogOpen} title={'Pipeline name'} initialValue={pipelineName} onConfirm={onNameDialogSave} onCancel={onNameDialogCancel} />

		<NameEditDialog open={isStageNameDialogOpen} title={'Stage name'} initialValue={editingStageName} onConfirm={onStageNameDialogSave} onCancel={onStageNameDialogCancel} />

		<DeleteConfirmModal open={isStageDeleteDialogOpen} title={`Deleting ${editingStageName}`} onConfirm={onStageDeleteConfirm} onCancel={onStageDeleteCancel} />

		<MachineCreationModal open={isMachineCreationDialogOpen} onConfirm={onStageMachineAddConfirm} onCancel={onStageMachineAddCancel} />
	</>);
}

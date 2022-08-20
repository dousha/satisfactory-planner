import React, { useState } from 'react';
import {
	AppBar,
	Box,
	Button, Card, CardActions, CardContent,
	Container,
	CssBaseline,
	Grid,
	IconButton,
	Paper, Popover, Slider,
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
	const [currentOperatingMachine, setCurrentOperatingMachine] = useState(-1);
	const [isClockSpeedPopupOpen, setClockSpeedPopupOpen] = useState(false);
	const [currentReferencingElement, setCurrentReferencingElement] = useState<HTMLButtonElement | null>(null);
	const [currentEditingClockSpeed, setCurrentEditingClockSpeed] = useState(1.0);

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
		setMachineCreationDialogOpen(false);
	};

	const onStageMachineAddCancel = () => {
		setMachineCreationDialogOpen(false);
	};

	const onMachineDelete = (stageIndex: number, machineIndex: number) => {
		return () => {
			savedPipeline.stages[stageIndex].machines.splice(machineIndex);
			savePipeline();
		};
	};

	const onMachineClockSpeedEdit = (stageIndex: number, machineIndex: number) => {
		return (e: React.MouseEvent<HTMLButtonElement>) => {
			setCurrentReferencingElement(e.currentTarget);
			setCurrentOperatingStage(stageIndex);
			setCurrentOperatingMachine(machineIndex);
			setCurrentEditingClockSpeed(pipeline.stages[stageIndex].machines[machineIndex].clockSpeed);
			setClockSpeedPopupOpen(true);
		};
	};

	const onMachineClockSpeedEditConfirm = () => {
		savedPipeline.stages[currentOperatingStage].machines[currentOperatingMachine].clockSpeed = currentEditingClockSpeed;
		savePipeline();
		setClockSpeedPopupOpen(false);
		setCurrentOperatingStage(-1);
		setCurrentOperatingMachine(-1);
		setCurrentEditingClockSpeed(1.0);
		setCurrentReferencingElement(null);
	};

	const onSliderChange = (e: any, value: number | number[]) => {
		setCurrentEditingClockSpeed(value as number);
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
					pipeline.stages.map((it, stageIndex) =>
					<Grid item key={stageIndex}>
						<Card>
							<CardContent>
								<Grid container direction={'row'} alignItems={'center'} spacing={1}>
									<Grid item>
										<Typography variant={'h5'}>{it.name}</Typography>
									</Grid>
									<Grid item>
										<IconButton onClick={onStageNameEdit(stageIndex)}>
											<Edit />
										</IconButton>
									</Grid>
								</Grid>
								<Grid container direction={'row'} spacing={1}>
									{it.machines.length === 0 ?
										<Grid item>
											<Typography>No machine.</Typography>
										</Grid>
										:
										it.machines.map((it, machineIndex) => <Grid item key={machineIndex}><MachineView machine={it} onMachineDelete={onMachineDelete(stageIndex, machineIndex)} onMachineClockSpeedEdit={onMachineClockSpeedEdit(stageIndex, machineIndex)} /></Grid>)
									}
								</Grid>
							</CardContent>
							<CardActions>
								<IconButton onClick={onStageMachineAdd(stageIndex)}>
									<Add />
								</IconButton>
								<Box sx={{flexGrow: 1}} />
								<IconButton onClick={onStageDeleteClick(stageIndex)}>
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

		<Popover open={isClockSpeedPopupOpen} anchorEl={currentReferencingElement} anchorOrigin={{vertical: 'bottom', horizontal: 'left'}} transformOrigin={{vertical: 'top', horizontal: 'left'}}>
			<Box sx={{padding: 2, minWidth: '36em'}}>
				<Grid container direction={'column'}>
					<Grid item>
						<Grid container direction={'row'} justifyContent={'space-between'}>
							<Grid item>
								<Typography>Clock rate</Typography>
							</Grid>
							<Grid item>
								<Typography>{Math.floor(currentEditingClockSpeed * 100)}%</Typography>
							</Grid>
						</Grid>
						<Slider value={currentEditingClockSpeed} step={0.01} min={0.01} max={2.5} marks={clockRateMarks} onChange={onSliderChange} />
					</Grid>
					<Grid item>
						<Button onClick={onMachineClockSpeedEditConfirm}>OK</Button>
					</Grid>
				</Grid>
			</Box>
		</Popover>
	</>);
}

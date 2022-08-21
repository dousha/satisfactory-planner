import React, { useState } from 'react';
import {
	AppBar,
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Container,
	CssBaseline,
	Grid,
	IconButton,
	Paper,
	Popover,
	Slider,
	TextField,
	Toolbar,
	Tooltip,
	Typography,
} from '@mui/material';
import HideOnScroll from '../components/HideOnScroll';
import { Add, ArrowBack, Delete, Edit, Power, ReceiptLong, Warning } from '@mui/icons-material';
import { StorageInstance } from '../logic/Storage';
import MachineView from '../components/MachineView';
import { randomIdString } from '../util/Random';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import MachineCreationModal from '../components/MachineCreationModal';
import { MachineInstance } from '../models/MachineInstance';
import NameEditDialog from '../components/NameEditDialog';
import { CalculatedProductionPipeline } from '../models/ProductionPipeline';

export interface PipelineEditorProps {
	id: number;
	line: number;

	loadSitePage: () => void;
}

export default function PipelineEditor(props: PipelineEditorProps) {
	const site = StorageInstance.getProductionSite(props.id);
	let savedPipeline = site.pipelines[props.line];
	const calculatedPipeline = new CalculatedProductionPipeline(savedPipeline);

	const [pipeline, setPipeline] = useState(savedPipeline);
	const [isNameDialogOpen, setNameDialogOpen] = useState(false);
	const [pipelineName, setPipelineName] = useState(pipeline.name);
	const [isStageDeleteDialogOpen, setStageDeleteDialogOpen] = useState(false);
	const [currentOperatingStage, setCurrentOperatingStage] = useState(-1);
	const [isMachineCreationDialogOpen, setMachineCreationDialogOpen] = useState(false);
	const [isStageNameDialogOpen, setStageNameDialogOpen] = useState(false);
	const [currentOperatingMachine, setCurrentOperatingMachine] = useState('');
	const [isClockSpeedPopupOpen, setClockSpeedPopupOpen] = useState(false);
	const [currentReferencingElement, setCurrentReferencingElement] = useState<HTMLButtonElement | null>(null);
	const [currentEditingClockSpeed, setCurrentEditingClockSpeed] = useState(1.0);
	const [isPriorityPopupOpen, setPriorityPopupOpen] = useState(false);
	const [currentEditingPriority, setCurrentEditingPriority] = useState(1);

	const savePipeline = () => {
		const newPipeline = {...savedPipeline};
		const newSite = {
			...site,
			pipelines: site.pipelines.map((it, index) => index === props.line ? newPipeline : it),
		};
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
			machines: [],
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
				savedPipeline.stages.splice(x, 1);
				setCurrentOperatingStage(-1);
				setCurrentOperatingMachine('');
				savePipeline();
			} else {
				setCurrentOperatingStage(x);
				setCurrentOperatingMachine('');
				setStageDeleteDialogOpen(true);
			}
		};
	};

	const onStageDeleteConfirm = () => {
		savedPipeline.stages.splice(currentOperatingStage, 1);
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

	const onMachineDelete = (stageIndex: number, machineId: string) => {
		return () => {
			const machineIndex = savedPipeline.stages[stageIndex].machines.findIndex(it => it.id === machineId);
			savedPipeline.stages[stageIndex].machines.splice(machineIndex, 1);
			savePipeline();
		};
	};

	const onMachineClockSpeedEdit = (stageIndex: number, machineId: string) => {
		return (e: React.MouseEvent<HTMLButtonElement>) => {
			const machineIndex = pipeline.stages[stageIndex].machines.findIndex(it => it.id === machineId);
			setCurrentReferencingElement(e.currentTarget);
			setCurrentOperatingStage(stageIndex);
			setCurrentOperatingMachine(machineId);
			setCurrentEditingClockSpeed(pipeline.stages[stageIndex].machines[machineIndex].clockSpeed);
			setClockSpeedPopupOpen(true);
		};
	};

	const onMachinePriorityEdit = (stageIndex: number, machineId: string) => {
		return (e: React.MouseEvent<HTMLButtonElement>) => {
			const machineIndex = pipeline.stages[stageIndex].machines.findIndex(it => it.id === machineId);
			setCurrentReferencingElement(e.currentTarget);
			setCurrentOperatingStage(stageIndex);
			setCurrentOperatingMachine(machineId);
			setCurrentEditingPriority(pipeline.stages[stageIndex].machines[machineIndex].priority);
			setPriorityPopupOpen(true);
		};
	};

	const onMachineClockSpeedEditConfirm = () => {
		const machineIndex = savedPipeline.stages[currentOperatingStage].machines.findIndex(it => it.id === currentOperatingMachine);
		savedPipeline.stages[currentOperatingStage].machines[machineIndex].clockSpeed = currentEditingClockSpeed;
		savePipeline();
		setClockSpeedPopupOpen(false);
		setCurrentOperatingStage(-1);
		setCurrentOperatingMachine('');
		setCurrentEditingClockSpeed(1.0);
		setCurrentReferencingElement(null);
	};

	const onSliderChange = (e: any, value: number | number[]) => {
		setCurrentEditingClockSpeed(value as number);
	};

	const onMachinePriorityEditConfirm = () => {
		const machineIndex = savedPipeline.stages[currentOperatingStage].machines.findIndex(it => it.id === currentOperatingMachine);
		savedPipeline.stages[currentOperatingStage].machines[machineIndex].priority = isNaN(currentEditingPriority) ? 1 : currentEditingPriority;
		savePipeline();
		setPriorityPopupOpen(false);
		setCurrentOperatingStage(-1);
		setCurrentOperatingMachine('');
		setCurrentEditingPriority(1);
		setCurrentReferencingElement(null);
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
		<CssBaseline/>
		<HideOnScroll>
			<AppBar>
				<Toolbar>
					<IconButton onClick={props.loadSitePage}>
						<ArrowBack sx={{color: 'white'}}/>
					</IconButton>
					<Box sx={{width: 8}}/>
					<Typography variant={'h6'} component={'div'}>
						{pipeline.name}
					</Typography>
					<Box sx={{width: 4}}/>
					<IconButton onClick={onNameEditClick}>
						<Edit sx={{color: 'white'}}/>
					</IconButton>
				</Toolbar>
			</AppBar>
		</HideOnScroll>
		<Container>
			<Grid container direction={'column'} alignItems={'stretch'} spacing={2} sx={{py: 10}}>
				<Grid item>
					<Paper>
						<Toolbar>
							<Button startIcon={<ReceiptLong/>}>
								BOM
							</Button>
							<Button startIcon={<Power/>}>
								Power
							</Button>
						</Toolbar>
					</Paper>
				</Grid>

				{calculatedPipeline.stages.length === 0 ?
					<Grid item>
						<Typography>Empty pipeline</Typography>
					</Grid>
					:
					calculatedPipeline.stages.map((it, stageIndex) =>
						<Grid item key={stageIndex}>
							<Card>
								<CardContent>
									<Grid container direction={'row'} alignItems={'center'} spacing={1}>
										<Grid item>
											<Typography variant={'h5'}>{it.name}</Typography>
										</Grid>
										<Grid item>
											<IconButton onClick={onStageNameEdit(stageIndex)}>
												<Edit/>
											</IconButton>
										</Grid>
										<Grid item sx={{flexGrow: 1}}>
										</Grid>
										<Grid item>
											{it.machines.findIndex(it => it.isRunningShort()) >= 0 ?
												<Tooltip title={'Some machines are not operating at full capacity'}
														 placement={'left'}>
													<Warning/>
												</Tooltip>
												: null
											}
										</Grid>
									</Grid>
									<Grid container direction={'row'} spacing={1}>
										{it.machines.length === 0 ?
											<Grid item>
												<Typography>No machine.</Typography>
											</Grid>
											:
											it.machines.map((it, machineIndex) => <Grid item
																						key={machineIndex}><MachineView
												machine={it} onMachineDelete={onMachineDelete(stageIndex, it.instance.id)}
												onMachineClockSpeedEdit={onMachineClockSpeedEdit(stageIndex, it.instance.id)}
												onMachinePriorityEdit={onMachinePriorityEdit(stageIndex, it.instance.id)}/></Grid>)
										}
									</Grid>
								</CardContent>
								<CardActions>
									<IconButton onClick={onStageMachineAdd(stageIndex)}>
										<Add/>
									</IconButton>
									<Box sx={{flexGrow: 1}}/>
									<IconButton onClick={onStageDeleteClick(stageIndex)}>
										<Delete/>
									</IconButton>
								</CardActions>
							</Card>
						</Grid>,
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

		<NameEditDialog open={isNameDialogOpen} title={'Pipeline name'} initialValue={pipelineName}
						onConfirm={onNameDialogSave} onCancel={onNameDialogCancel}/>

		<NameEditDialog open={isStageNameDialogOpen} title={'Stage name'} initialValue={editingStageName}
						onConfirm={onStageNameDialogSave} onCancel={onStageNameDialogCancel}/>

		<DeleteConfirmModal open={isStageDeleteDialogOpen} title={`Deleting ${editingStageName}`}
							onConfirm={onStageDeleteConfirm} onCancel={onStageDeleteCancel}/>

		<MachineCreationModal open={isMachineCreationDialogOpen} onConfirm={onStageMachineAddConfirm}
							  onCancel={onStageMachineAddCancel}/>

		<Popover open={isClockSpeedPopupOpen} anchorEl={currentReferencingElement}
				 anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
				 transformOrigin={{vertical: 'top', horizontal: 'left'}}>
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
						<Slider value={currentEditingClockSpeed} step={0.01} min={0.01} max={2.5} marks={clockRateMarks}
								onChange={onSliderChange}/>
					</Grid>
					<Grid item>
						<Button onClick={onMachineClockSpeedEditConfirm}>OK</Button>
					</Grid>
				</Grid>
			</Box>
		</Popover>

		<Popover open={isPriorityPopupOpen} anchorEl={currentReferencingElement}
				 anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
				 transformOrigin={{vertical: 'top', horizontal: 'left'}}>
			<Box sx={{padding: 2, minWidth: '9em'}}>
				<Grid container direction={'column'}>
					<Grid item>
						<TextField label={'Priority'} value={currentEditingPriority} placeholder={'1'} type={'number'}
								   fullWidth onChange={e => setCurrentEditingPriority(Number(e.target.value))}/>
					</Grid>
					<Grid item>
						<Button onClick={onMachinePriorityEditConfirm}>OK</Button>
					</Grid>
				</Grid>
			</Box>
		</Popover>
	</>);
}

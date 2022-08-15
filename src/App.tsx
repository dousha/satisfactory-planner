import React, { useState } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage';
import { Pages } from './pages/Pages';
import ProductionSiteEditor from './pages/ProductionSiteEditor';
import PipelineEditor from './pages/PipelineEditor';

function App() {
	const [currentPage, setCurrentPage] = useState(Pages.Landing);
	const [currentEditingSite, setCurrentEditingSite] = useState(-1);
	const [currentEditingPipeline, setCurrentEditingPipeline] = useState(-1);

	const loadEditor = (x: number) => {
		setCurrentEditingSite(x);
		setCurrentPage(Pages.SiteEditor);
	};

	const loadPipeline = (x: number) => {
		setCurrentEditingPipeline(x);
		setCurrentPage(Pages.PipelineEditor);
	};

	switch (currentPage) {
		case Pages.Landing:
			return <LandingPage loadEditor={loadEditor} />;
		case Pages.SiteEditor:
			return <ProductionSiteEditor id={currentEditingSite} loadLandingPage={() => setCurrentPage(Pages.Landing)} loadPipelinePage={loadPipeline} />;
		case Pages.PipelineEditor:
			return <PipelineEditor id={currentEditingSite} line={currentEditingPipeline} loadSitePage={() => setCurrentPage(Pages.SiteEditor)}></PipelineEditor>;
	}
}

export default App;

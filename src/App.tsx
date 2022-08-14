import React, { useState } from 'react';
import './App.css';
import LandingPage from './pages/LandingPage';
import { Pages } from './pages/Pages';
import ProductionSiteEditor from './pages/ProductionSiteEditor';
import PipelineEditor from './pages/PipelineEditor';
import BillOfMaterialPage from './pages/BillOfMaterialPage';

function App() {
	const [currentPage, setCurrentPage] = useState(Pages.Landing);
	const [currentEditingSite, setCurrentEditingSite] = useState(-1);
	const loadEditor = (x: number) => {
		setCurrentEditingSite(x);
		setCurrentPage(Pages.SiteEditor);
	};

	switch (currentPage) {
		case Pages.Landing:
			return <LandingPage loadEditor={loadEditor} />;
		case Pages.SiteEditor:
			return <ProductionSiteEditor id={currentEditingSite} loadLandingPage={() => setCurrentPage(Pages.Landing)} />;
		case Pages.PipelineEditor:
			return <PipelineEditor id={currentEditingSite} loadSitePage={() => setCurrentPage(Pages.SiteEditor)}></PipelineEditor>;
	}
}

export default App;

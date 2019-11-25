import createPageList from './pagelist'
import createRenderer from './renderer'
import createMiddleware from './middleware'

export default function staticRenderer ({
	config,
	routes,
	pages
}) {
	const pagelist = createPageList({
		config,
		pages,
		routes
	})

	const renderer = createRenderer({
		config,
		pagelist
	})

	const middleware = createMiddleware({
		config,
		pagelist,
		render: renderer.render
	})

	return {
		middleware,
		launch: renderer.launch,
		render: renderer.render,
		renderAll: renderer.renderAll,
		setEntries: renderer.setEntries
	}
}

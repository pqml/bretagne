import path from 'path';

export default function getEntries( config, list ) {

	const vendors = [];
	const js = [];
	const css = [];

	Array.from( list ).forEach( url => {

		const name = path.basename( url );
		const splitted = name.split( '.' );
		const ext = path.extname( url );
		const subtype = splitted[ splitted.length - 2 ];

		if ( name.split( '~' ).length > 1 ) vendors.push( url );
		else if ( subtype === 'bundle' && ext === '.js' ) js.push( url );
		else if ( subtype === 'bundle' && ext === '.css' ) css.push( url );

	} );

	// const out = {
	// 	css,
	// 	js: [].concat( vendors, js )
	// };

	// for ( const k in out ) {

	// 	out[ k ] = out[ k ].map( v => ! v.startsWith( '/' ) ? config.baseURL + v : v );

	// }

	// return out;

	return []
		.concat( css, vendors, js )
		.map( v => ! v.startsWith( '/' ) ? config.baseURL + v : v );

}

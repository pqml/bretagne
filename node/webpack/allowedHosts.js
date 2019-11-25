import os from 'os';

const hosts = new Set();
const interfaces = os.networkInterfaces();

// Add local hosts
hosts.add( 'localhost' );
hosts.add( '127.0.0.1' );
hosts.add( '0.0.0.0' );
hosts.add( '::1' );

Object
	.keys( interfaces )
	.forEach( ( name ) =>
		interfaces[ name ]
			.filter( i => ! i.internal && i.family === 'IPv4' )
			.forEach( i => hosts.add( i.address ) )
	);

export default Array.from( hosts );
